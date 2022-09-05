/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-26 18:20:12
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-02 02:17:22
 * @FilePath: \src\szpt\index.ts
 * @Description:
 */
/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-26 18:20:12
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-27 18:39:43
 * @FilePath: \server_szpt\src\szpt\index.ts
 * @Description:
 */

import qs from "qs";
import axios from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";
import {
  _headers_get_jsessionid,
  _headers_get_authsession,
  _body_get_aeskey,
} from "./get-keys";
import { _encrypto } from "./aes";

import { SZPTClient_plugin_info } from "./plugins/info";
import { SZPTClient_plugin_lession } from "./plugins/lession";
import { SZPTClient_plugin_dayReport } from "./plugins/day-report";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63";

export class SZPTClient {
  private cookieJar = new CookieJar();

  // 类内插件
  public readonly plugins = {
    info: new SZPTClient_plugin_info(this),
    lession: new SZPTClient_plugin_lession(this),
    dayReport: new SZPTClient_plugin_dayReport(this),
  };

  set_session(JSESSIONID: string, CASTGC: string) {
    this.cookieJar = CookieJar.deserializeSync({
      version: "tough-cookie@4.1.2",
      storeType: "MemoryCookieStore",
      rejectPublicSuffixes: true,
      cookies: [
        {
          key: "JSESSIONID",
          value: encodeURIComponent(JSESSIONID),
          domain: "authserver.szpt.edu.cn",
          path: "/",
          httpOnly: true,
          hostOnly: true,
        },
        {
          key: "CASTGC",
          value: encodeURIComponent(CASTGC),
          domain: "authserver.szpt.edu.cn",
          path: "/authserver/",
          secure: true,
          httpOnly: true,
          hostOnly: true,
        },
      ],
    });
  }

  get_session() {
    const cookie = this.cookieJar.toJSON();
    return cookie.cookies.reduce((prev, curr) => {
      if (curr.key === "JSESSIONID" || curr.key === "CASTGC") {
        prev[curr.key] = decodeURIComponent(curr.value);
      }

      return prev;
    }, {}) as {
      JSESSIONID: string;
      CASTGC: string;
    };
  }

  copy_cookies() {
    return this.cookieJar.cloneSync();
  }

  create_request_instance(
    baseURL: string,
    cookieJar: CookieJar = this.copy_cookies()
  ) {
    const agent_config = {
      cookies: { jar: cookieJar },
      keepAlive: true,
      rejectUnauthorized: false, // disable CA checks
    };

    return axios.create({
      httpAgent: new HttpCookieAgent(agent_config),
      httpsAgent: new HttpsCookieAgent(agent_config),
      baseURL,
      headers: {
        Accept: "*/*",
        Connection: "keep-alive",
        "Accept-encoding": "gzip, deflate, br",
        "User-agent": UA,
      },
    });
  }

  async login(user: string, pass: string) {
    const cookieJar = new CookieJar();
    const request = this.create_request_instance(
      "https://authserver.szpt.edu.cn",
      cookieJar
    );

    // 获取登录页数据
    // 并确定账户是否需要验证码
    const url = "/authserver/login?service=https://i.szpt.edu.cn/deal_with_st";
    const [login_ready_responst, need_captcha] = await Promise.allSettled([
      request.get<string>(url),
      this.need_captcha(user),
    ]);

    if (
      login_ready_responst.status === "rejected" ||
      need_captcha.status === "rejected"
    ) {
      return this._err_callback(-1);
    }

    // 获取登录页数据
    // 获取lt与登录时的aeskey
    // 提取jsessionid
    const { headers, data } = await login_ready_responst.value;
    const { lt, execution, pwdDefaultEncryptSalt } = _body_get_aeskey(data);
    const { JSESSIONID } = _headers_get_jsessionid(headers);

    // 判断是否异常
    if (!JSESSIONID) {
      return this._err_callback(-2);
    }

    if (!lt || !pwdDefaultEncryptSalt) {
      return this._err_callback(-3);
    }

    const username = user;
    const password = _encrypto(pass, pwdDefaultEncryptSalt);
    const auth_data = {
      username,
      password,
      lt,
      dllt: "userNamePasswordLogin",
      execution,
      _eventId: "submit",
      rmShown: "1",
    };

    const auth_headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const auth_result = await request.post(url, qs.stringify(auth_data), {
        maxRedirects: 0,
        headers: auth_headers,
        validateStatus(status) {
          return status === 302;
        },
      });

      const { cookies } = cookieJar.toJSON();
      if (cookies.findIndex((cookie) => cookie.key === "CASTGC") > -1) {
        this.cookieJar = cookieJar.cloneSync();

        return {
          ...this._err_callback(0),
          session: this.get_session(),
        };
      }
    } catch {}

    return this._err_callback(-5);
  }

  async need_captcha(user: string) {
    const baseUrl = `https://authserver.szpt.edu.cn/authserver/needCaptcha.html?username=${user}&pwdEncrypt2=pwdEncryptSalt&_=${new Date().getTime()}`;
    const { status, data } = await axios.get<boolean | string>(baseUrl);

    if (status !== 200) {
      return -1;
    }

    if (data === false) {
      return 0;
    }

    return 1;
  }

  _err_callback(type: number) {
    switch (type) {
      case 0:
        return {
          type: 0,
          error: "",
        };
      case -1:
        return {
          type: -1,
          error: "ERR_PAGE_NOT_ACCESSED",
        };
      case -2:
        return {
          type: -2,
          error: "ERR_UNKNOWN_JSESSIONID",
        };
      case -3:
        return {
          type: -3,
          error: "ERR_UNKNOWN_AESKEY",
        };
      case -5:
        return {
          type: -5,
          error: "ERR_UNKNOWN_ACCOUNT",
        };
      case -6:
        return {
          type: -6,
          error: "ERR_REQUEST_FAILED",
        };
      default:
        return {
          type: -404,
          error: "UNKNOWN_ERROR",
        };
    }
  }
}
