/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-27 18:42:45
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-02 00:36:54
 * @FilePath: \src\szpt\plugins\lession\index.ts
 * @Description: 课程表接入的是第三方的服务，需要单独使用SZPT的学号与session登录 密码也行
 */

import axios from "axios";
import { SZPTClient_plugin_template } from "../template";
import { Cookie, CookieJar } from "tough-cookie";
import { _body_get_redirect_form } from "./chaoxin-get-keys";
import type { iLessionTypes } from "./types";

type iLessionSession = {
  [key in "_d" | "UID" | "vc3"]: string;
};

export class SZPTClient_plugin_lession extends SZPTClient_plugin_template {
  private lession_session: iLessionSession | null = null;

  // 登录到超新课程表
  async active() {
    const cookieJar = this.copy_cookies();
    const request = this.create_request_instance(
      "https://authserver.szpt.edu.cn",
      cookieJar
    );

    try {
      const url =
        "/authserver/login?service=https://istudy.szpt.edu.cn/sso/szpt";

      // 先访问一次主页面
      // 再访问一次json页面 激活session
      const auth_responst = await request.get(url);
      const { data, action } = _body_get_redirect_form(auth_responst.data);

      // 二次凭证
      const lession_passport = await request.post(action, data);
      const lession_session = this._analysis_cookies(
        cookieJar.toJSON().cookies
      );

      if (!lession_session.success) {
        throw null;
      }

      this.lession_session = {
        _d: lession_session._d,
        UID: lession_session.UID,
        vc3: lession_session.vc3,
      };

      return {
        ...this._err_callback(0),
        lession_session,
      };
    } catch (err) {
      return this._err_callback(-1);
    }
  }

  async get_lession(week: number = 1) {
    if (!this.lession_session) {
      return this._err_callback(-1);
    }

    const { _d, UID, vc3 } = this.lession_session;
    const url = `https://kb.chaoxing.com/pc/curriculum/getMyLessons?week=${week}`;

    try {
      const lession_response = await axios.get<{
        result: number;
        msg: string;
        data: iLessionTypes;
      }>(url, {
        // 只能200 204和302为没登陆
        validateStatus: (status: number) => status === 200,
        headers: {
          Cookie: `_d=${_d}; UID=${UID}; vc3=${vc3}`,
        },
      });

      const { data } = lession_response;

      // 如果页面格式为string 表示跳转到登录页了
      // result必须为1才有课表
      if (typeof data === "string" || data.result !== 1) {
        throw null;
      }

      return {
        ...this._err_callback(0),
        data: data.data,
      };
    } catch {
      return this._err_callback(-6);
    }
  }

  get_session() {
    return this.lession_session
      ? {
          _d: decodeURIComponent(this.lession_session._d),
          UID: decodeURIComponent(this.lession_session.UID),
          vc3: decodeURIComponent(this.lession_session.vc3),
        }
      : null;
  }

  set_session(_d: string, UID: string, vc3: string) {
    this.lession_session = {
      _d: encodeURIComponent(_d),
      UID: encodeURIComponent(UID),
      vc3: encodeURIComponent(vc3),
    };
  }

  private _analysis_cookies(
    _cookies: Cookie.Serialized[]
  ): ({ success: true } & iLessionSession) | { success: false } {
    // 只有3个字段的session有效
    // 只有这个字段下的cookie才能访问课程表
    const filter_mark = "istudy.szpt.edu.cn";
    const cookies_mark = ["_d", "UID", "vc3"];
    const cookies = _cookies
      .filter((raw) => raw.domain === filter_mark)
      .reduce((prev, curr) => {
        if (cookies_mark.includes(curr.key)) {
          prev[curr.key] = curr.value;
        }
        return prev;
      }, {}) as iLessionSession;

    const cookies_available = Object.keys(cookies).every((key) =>
      cookies_mark.includes(key)
    );

    return cookies_available
      ? {
          success: true,
          ...cookies,
        }
      : {
          success: false,
        };
  }
}
