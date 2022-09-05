/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-26 19:54:01
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-26 21:48:07
 * @FilePath: \server_szpt\src\szpt\aes.ts
 * @Description:
 */

import CryptoJS from "crypto-js";

const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
const chars_len = chars.length;

// 获取随机字符串
function randomStr(length: number) {
  let retStr = "";
  for (let i = 0; i < length; i++) {
    retStr += chars.charAt(Math.floor(Math.random() * chars_len));
  }

  // 返回
  return retStr;
}


export function _encrypto(password: string, aeskey: string) {
  const rd64 = randomStr(64);
  const rd16 = randomStr(16);
  const key = CryptoJS.enc.Utf8.parse(aeskey);
  const iv = CryptoJS.enc.Utf8.parse(rd16);

  const pwd = `${rd64}${password}`.replace(/(^\s+)|(\s+$)/g, "");
  const encrypted = CryptoJS.AES.encrypt(pwd, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}
