/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-08-27 18:40:13
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-08-29 12:42:51
 * @FilePath: \server_szpt\src\szpt\plugins\info\index.ts
 * @Description:
 */
import { SZPTClient_plugin_template } from "../template";

export class SZPTClient_plugin_info extends SZPTClient_plugin_template {
  // 获取用户学生信息
  async get_userinfo() {
    const request = this.create_request_instance(
      "https://authserver.szpt.edu.cn"
    );

    try {
      const url = "/authserver/login?service=https://i.szpt.edu.cn/my_stuinfo";

      // 先访问一次主页面
      // 再访问一次json页面 激活session
      const auth_responst = await request.get(url);
      const { data } = await request.get<{
        XH: string; // 学号
        WID: string; //
        BZ2: string; // 班级
        BZ1: string; // 专业名称
        XM: string; // 姓名
        DEPARTMENTNAME: string; // 学院名称
        USERSJ: string; // 手机号
        USEREMAIL: string; // 邮箱
        SJH: string; // 手机号2
        IDCARDNO: string; // 身份证
      }>(`${url}?mark=true`);

      if (typeof data === "string") {
        throw null;
      }

      return {
        ...this._err_callback(0),
        info: {
          name: data.XM,
          id: +data.XH,
          idCard: data.IDCARDNO,
          phoneNumber: +data.SJH,
          userPhoneNumber: +data.USERSJ,
          mail: data.USEREMAIL,
          className: data.BZ2,
          classType: data.BZ1,
          area: data.DEPARTMENTNAME,
          wid: data.WID,
        },
      };
    } catch {
      return this._err_callback(-1);
    }
  }
}
