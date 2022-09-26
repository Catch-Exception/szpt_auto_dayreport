/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 01:21:43
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-06 00:56:33
 * @FilePath: \server_szpt\src\catch-exception.ts
 * @Description:
 */
import { logger } from "./logger";
import dayjs from "dayjs";
import { NotifierFactory, NotifierOption } from "./notifier";

function send(title: string, body: string, notification: NotifierOption) {
  const connector = NotifierFactory.create(notification);
  const token = notification.option.token;
  const extra = notification.option.extra;
  connector.send({
    title,
    body,
    token,
    ...extra
  });
}

export const catch_exception = {
  login(name: string, userid: string, notification: NotifierOption, error: string) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户配置 ${name}(${userid}) 登录到学生系统时出现错误`;

    logger.error(body);

    send(
      `自动健康申报 - 异常`,
      `${body}\n原因: ${error}\n时间: ${time}`,
      notification
    );
  },

  dayreport_active(
    name: string,
    userid: string,
    notification: NotifierOption,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户配置 ${name}(${userid}) 登录到校园健康系统时出现错误`;

    logger.error(body);

    send(
      `自动健康申报 - 异常`,
      `${body}\n原因: ${error}\n时间: ${time}`,
      notification
    );
  },

  dayreport_getsave(
    name: string,
    userid: string,
    notification: NotifierOption,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `获取来自 ${name}(${userid}) 的健康档案时出现错误`;

    logger.error(body);

    send(
      `自动健康申报 - 异常`,
      `${body}\n原因: ${error}\n时间: ${time}`,
      notification
    );
  },

  dayreport_repeat(
    name: string,
    userid: string,
    notification: NotifierOption,
    CASTGC: string,
    undisturb: boolean
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `今日 ${name}(${userid}) 已经申报过了, 本次申报已跳过`;

    logger.warn(body);
    if (!undisturb) {
      send(
        `自动健康申报 - 重复`,
        `${body}\n时间: ${time}\nCASTGC_ID: ${CASTGC}`,
        notification
      );
    }
  },

  dayreport_upload_success(
    name: string,
    userid: string,
    notification: NotifierOption,
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

    send(
      `自动健康申报 - 成功`,
      `${body}\n申报人: ${nickname}\n申报时间: ${time}\nCASTGC_ID: ${CASTGC}`,
      notification
    );
  },

  dayreport_upload(
    name: string,
    userid: string,
    notification: NotifierOption,
    CASTGC: string,
    error: string
  ) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const body = `账户 ${name}(${userid}) 申报失败, 原因: ${error}`;

    logger.error(body);

    send(
      `自动健康申报 - 异常`,
      `${body}\n时间: ${time}\nCASTGC_ID: ${CASTGC}`,
      notification
    );
  },
};
