/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-26 17:24:05
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-04 04:24:13
 * @FilePath: \server_szpt\src\task.ts
 * @Description:
 */

import dayjs from "dayjs";
import config from "./config.json";

import { catch_exception } from "./catch-exception";
import { SZPTClient } from "./szpt";
import { logger } from "./logger";
import { NotifierOption } from "./notifier";

logger.info(`任务分配账户数量: ${config.accounts.length}`);
logger.info(`每日提交时间: ${config.day_report.upload_time}`);

const upload_time = config.day_report.upload_time.split(":").map((num) => +num);
const upload_task = async (is_auto = true) => {
  logger.info(`任务开始, 时间: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);

  const start_time = +dayjs();
  const upload_accounts = config.accounts;
  const upload_virus_checktime = dayjs().add(-1, "day").format("YYYY-MM-DD");

  for (let account of upload_accounts) {
    logger.info(`任务: ${account.name}(${account.userid})`);

    const client = new SZPTClient();
    const login_result = await client.login(account.userid, account.password);

    const notification = account.notification as NotifierOption;

    if (login_result.type !== 0) {
      catch_exception.login(
        account.name,
        account.userid,
        notification,
        login_result.error
      );
      continue;
    }

    const { CASTGC } = client.get_session();
    const dayreport_login_result = await client.plugins.dayReport.active();
    const dayreport_save = await client.plugins.dayReport.get_save_report();

    if (dayreport_login_result.type !== 0) {
      catch_exception.dayreport_active(
        account.name,
        account.userid,
        notification,
        CASTGC,
        login_result.error
      );
      continue;
    }

    if (!dayreport_save.success) {
      catch_exception.dayreport_getsave(
        account.name,
        account.userid,
        notification,
        CASTGC,
        login_result.error
      );
      continue;
    }

    if (dayreport_save.data.WID) {
      catch_exception.dayreport_repeat(
        account.name,
        account.userid,
        notification,
        CASTGC,
        is_auto
      );
      continue;
    }

    const upload_form = {
      ...dayreport_save.data,
      ...{
        HSJCJG_DISPLAY: account.option.update_virus_check_time ? "阴性" : "",
        HSJCJG: account.option.update_virus_check_time ? "1" : "",
        SFJXHSJC: account.option.update_virus_check_time ? "1" : "0",
        ZJYCHSJCSJ: account.option.update_virus_check_time
          ? upload_virus_checktime
          : "",
      },
    };

    const upload_result = await client.plugins.dayReport.upload_report(
      upload_form
    );

    if (upload_result.type === 0) {
      catch_exception.dayreport_upload_success(
        account.name,
        account.userid,
        notification,
        CASTGC,
        upload_form.USER_NAME
      );
    } else {
      catch_exception.dayreport_upload(
        account.name,
        account.userid,
        notification,
        CASTGC,
        upload_result.error
      );
    }
  }

  const upload_current_time = +dayjs();
  const upload_next_time = +dayjs()
    .add(1, "day")
    .set("hours", upload_time[0])
    .set("minute", upload_time[1])
    .set("seconds", upload_time[2]);

  setTimeout(() => {
    upload_task(true);
  }, upload_next_time - upload_current_time);

  logger.info(
    `任务完成, 完成时间: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}, 耗时: ${(+dayjs() - start_time) / 1000
    }s`
  );

  logger.info(
    `下次任务时间: ${dayjs(upload_next_time).format("YYYY-MM-DD HH:mm:ss")}`
  );
};

export { upload_task };
