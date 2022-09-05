/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-27 18:40:13
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-02 02:42:31
 * @FilePath: \src\szpt\plugins\day-report\index.ts
 * @Description:
 */
import { SZPTClient_plugin_template } from "../template";
import { x_form_headers } from "./headers";
import { empty_form_builder } from "./form";
import type { AxiosInstance } from "axios";
import type {
  iDayReportSaveForm,
  iDayReportUploadForm,
  iDayReportBaseForm,
} from "./types";

export class SZPTClient_plugin_dayReport extends SZPTClient_plugin_template {
  private request: AxiosInstance | null = null;

  // 登录到学生健康信息报送
  async active() {
    const request = this.create_request_instance("https://ehall.szpt.edu.cn/");

    try {
      const url = `https://authserver.szpt.edu.cn/authserver/login`;
      const url_main = `/publicappinternet/sys/szptpubxsjkxxbs/index.do`;
      // 先访问一次主页面
      // 再访问一次json页面 激活session
      const auth_responst = await request.get(url);
      const auth_result = await request.get(url_main);

      // 赋予实例
      this.request = request;
      return this._err_callback(0);
    } catch {
      return this._err_callback(-1);
    }
  }

  // 获取上一次填报的数据
  async get_save_report(): Promise<
    | {
        success: false;
        type: number;
        error: string;
      }
    | {
        success: true;
        data: iDayReportSaveForm;
        type: number;
        error: string;
      }
  > {
    if (!this.request) {
      return {
        ...this._err_callback(-1),
        success: false,
      };
    }

    const url = `/publicappinternet/sys/szptpubxsjkxxbs/mrxxbs/getSaveReportInfo.do`;
    const request = this.request;

    try {
      const { data } = await request.post<{
        datas: iDayReportSaveForm;
        daySchool: false;
        code: string;
      }>(url);

      if (typeof data === "string" || data.code !== "0") {
        throw null;
      }

      return {
        ...this._err_callback(0),
        success: true,
        data: data.datas,
      };
    } catch {
      return {
        ...this._err_callback(-6),
        success: false,
      };
    }
  }

  // 上报信息
  async upload_report<T>(data: T extends iDayReportBaseForm ? T : never) {
    if (!this.request) {
      return this._err_callback(-1);
    }

    const request = this.request;
    const url = `/publicappinternet/sys/szptpubxsjkxxbs/mrxxbs/saveReportInfo.do`;
    const body = `formData=${encodeURIComponent(
      JSON.stringify({
        ...empty_form_builder(),
        ...data,
      })
    )}`;

    try {
      const { data } = await request.post<{
        datas: unknown;
        code: string;
      }>(url, body, {
        headers: x_form_headers,
      });

      if (typeof data === "string" || data.code !== "0") {
        throw null;
      }

      return this._err_callback(0);
    } catch {
      return this._err_callback(-6);
    }
  }
}
