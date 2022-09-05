/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 01:21:43
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-06 00:56:33
 * @FilePath: \server_szpt\src\catch-exception.ts
 * @Description:
 */
import config from "./config.json";
import { logger } from "./logger";
import { BarkConnector } from "./bark";
import dayjs from "dayjs";

const bark = new BarkConnector(config.bark_server);
const bark_global_template = {
  icon: "https://s1.ax1x.com/2022/09/02/vIPkXd.png",
  group: "com.mitay.szptdayreport",
};

export const catch_exception = {
  login(name: string, userid: string, bark_key: string, error: string) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户配置 ${name}(${userid}) 登录到学生系统时出现错误`;

    logger.error(body);

    if (!!bark_key) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 异常`,
        body: `${body}\n原因: ${error}\n时间: ${time}`,
      });
    }
  },

  dayreport_active(
    name: string,
    userid: string,
    bark_key: string,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户配置 ${name}(${userid}) 登录到校园健康系统时出现错误`;

    logger.error(body);

    if (!!bark_key) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 异常`,
        body: `${body}\n原因: ${error}\n时间: ${time}`,
      });
    }
  },

  dayreport_getsave(
    name: string,
    userid: string,
    bark_key: string,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `获取来自 ${name}(${userid}) 的健康档案时出现错误`;

    logger.error(body);

    if (!!bark_key) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 异常`,
        body: `${body}\n原因: ${error}\n时间: ${time}`,
      });
    }
  },

  dayreport_repeat(
    name: string,
    userid: string,
    bark_key: string,
    CASTGC: string,
    undisturb: boolean
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `今日 ${name}(${userid}) 已经申报过了, 本次申报已跳过`;

    logger.warn(body);

    if (!!bark_key && !undisturb) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 重复`,
        body: `${body}\n时间: ${time}\nCASTGC_ID: ${CASTGC}`,
      });
    }
  },

  dayreport_upload_success(
    name: string,
    userid: string,
    bark_key: string,
    CASTGC: string,
    username: string
  ) {
    // 马赛克(
    const nickname = `${Array(username.length - 1)
      .fill("*")
      .join("")}${username.substring(username.length - 1, username.length)}`;

    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户 ${name}(${userid}) 申报成功`;

    logger.info(body);

    if (!!bark_key) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 成功`,
        body: `${body}\n申报人: ${nickname}\n申报时间: ${time}\nCASTGC_ID: ${CASTGC}`,
      });
    }
  },

  dayreport_upload(
    name: string,
    userid: string,
    bark_key: string,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户 ${name}(${userid}) 申报失败, 原因: ${error}`;

    logger.error(body);

    if (!!bark_key) {
      bark.send(bark_key, {
        ...bark_global_template,
        title: `自动健康申报 - 异常`,
        body: `${body}\n时间: ${time}\nCASTGC_ID: ${CASTGC}`,
      });
    }
  },
};
