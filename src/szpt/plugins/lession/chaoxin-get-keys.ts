/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-27 18:46:57
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-27 18:53:07
 * @FilePath: \server_szpt\src\szpt\plugins\lession\chaoxin-get-keys.ts
 * @Description: 
 */
import { load as cheerio } from "cheerio";

export function _body_get_redirect_form(body: string) {
  const $ = cheerio(body);
  const form = $("#userLogin");
  const data = form.serialize();
  const action = form.attr("action")!;

  return {
    data,
    action,
  };
}
