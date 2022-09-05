/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 00:55:45
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-06 00:53:05
 * @FilePath: \server_szpt\src\bark\index.ts
 * @Description:
 */
import axios, { AxiosInstance } from "axios";

export class BarkConnector {
  private request: AxiosInstance;
  private option;

  constructor(option: {
    protocol: "http" | "https" | null | string;
    host: string | null;
  }) {
    this.option = option;
    this.request = axios.create({
      baseURL: `${option.protocol}://${option.host}`,
    });
  }

  send(
    device_key: string,
    option: {
      body: string;
      title?: string;
      group?: string;
      icon?: string;
    }
  ) {
    return !this.option.host
      ? null
      : this.request.post("/push", {
          ...option,
          device_key,
        });
  }
}
