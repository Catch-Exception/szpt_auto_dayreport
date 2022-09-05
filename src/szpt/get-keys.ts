/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-26 19:51:38
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-27 00:45:20
 * @FilePath: \server_szpt\src\szpt\get-keys.ts
 * @Description:
 */
import type { AxiosResponseHeaders } from "axios";
import { load as cheerio } from "cheerio";

// 提取jsessionid
export function _headers_get_jsessionid(headers: AxiosResponseHeaders) {
  if (!Object.keys(headers).includes("set-cookie")) {
    return {
      route: "",
      JSESSIONID: "",
    };
  }

  try {
    const cookies = headers["set-cookie"]!;
    const param_query = (left: string) =>
      cookies.find((raw) => raw.substring(0, left.length) === left);

    // 提取route和JSESSIONID
    const param_route = param_query("route=")!;
    const param_JSESSIONID = param_query("JSESSIONID=")!;
    const args_route = param_route.split("=")[1];
    const args_JSESSIONID = param_JSESSIONID.split(";")[0].split("=")[1];

    return {
      route: args_route,
      JSESSIONID: args_JSESSIONID,
    };
  } catch {
    return {
      route: "",
      JSESSIONID: "",
    };
  }
}

// 获取aeskey
export function _body_get_aeskey(body: string) {
  try {
    const $ = cheerio(body);
    const login_form = $("#casLoginForm");
    const lt = login_form.find("input[name='lt']").val() as string;
    const execution = login_form.find("[name='execution']").val() as string;
    const pwdDefaultEncryptSalt = login_form
      .find("#pwdDefaultEncryptSalt")
      .val() as string;

    return {
      lt,
      execution,
      pwdDefaultEncryptSalt,
    };
  } catch {
    return {
      lt: "",
      execution: "",
      pwdDefaultEncryptSalt: "",
    };
  }
}

export function _headers_get_authsession(headers: AxiosResponseHeaders) {
  if (!Object.keys(headers).includes("set-cookie")) {
    return {
      CASTGC: "",
      CASPRIVACY: "",
      iPlanetDirectoryPro: "",
    };
  }

  try {
    const cookies = headers["set-cookie"]!;
    const param_query = (left: string) =>
      cookies.find((raw) => raw.substring(0, left.length) === left);

    // 提取route和JSESSIONID
    const param_CASTGC = param_query("CASTGC=")!;
    const param_CASPRIVACY = param_query("CASPRIVACY=")!;
    const param_iPlanetDirectoryPro = param_query("iPlanetDirectoryPro=")!;
    const args_CASTGC = param_CASTGC.split(";")[0].split("=")[1];
    const args_CASPRIVACY = param_CASPRIVACY.split(";")[0].split("=")[1];
    const args_iPlanetDirectoryPro = param_iPlanetDirectoryPro
      .split("; ")[0]
      .split("=")[1];

    return {
      CASTGC: args_CASTGC,
      CASPRIVACY: args_CASPRIVACY,
      iPlanetDirectoryPro: args_iPlanetDirectoryPro,
    };
  } catch {
    return {
      CASTGC: "",
      CASPRIVACY: "",
      iPlanetDirectoryPro: "",
    };
  }
}
