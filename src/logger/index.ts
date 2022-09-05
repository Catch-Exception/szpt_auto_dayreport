/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 00:48:59
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-03 01:09:09
 * @FilePath: \src\logger\index.ts
 * @Description:
 */
function getTime(timestamp?: number) {
  const currentDate = timestamp ? new Date(timestamp) : new Date();
  const lengthFormat = (t: string) => (t.length < 2 ? `0${t}` : t);

  const currentHours = currentDate.getHours() + "";
  const currentMinutes = currentDate.getMinutes() + "";
  const currentSeconds = currentDate.getSeconds() + "";

  return (
    "[" +
    lengthFormat(currentHours) +
    ":" +
    lengthFormat(currentMinutes) +
    ":" +
    lengthFormat(currentSeconds) +
    "]"
  );
}

export class logger {
  static info(message: string) {
    console.log(`${getTime()}[INFO] ${message}`);
  }

  static error(message: string) {
    console.error(`${getTime()}[ERROR] ${message}`);
  }

  static warn(message: string) {
    console.warn(`${getTime()}[WARN] ${message}`);
  }
}
