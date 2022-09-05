/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-27 18:36:22
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-27 20:08:09
 * @FilePath: \server_szpt\src\szpt\plugins\template.ts
 * @Description:
 */
import { SZPTClient } from "..";
import { CookieJar } from "tough-cookie";

export class SZPTClient_plugin_template {
  private client: SZPTClient;

  constructor(client: SZPTClient) {
    this.client = client;
  }

  getClient() {
    return this.client;
  }

  create_request_instance(baseURL: string, cookieJar?: CookieJar) {
    return this.client.create_request_instance(baseURL, cookieJar);
  }

  copy_cookies() {
    return this.client.copy_cookies();
  }

  _err_callback(type: number) {
    return this.client._err_callback(type);
  }
}
