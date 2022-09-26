/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 00:55:45
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-06 00:53:05
 * @FilePath: \server_szpt\src\bark\index.ts
 * @Description:
 */
import axios, { AxiosInstance } from "axios";
import { INotifier, SendOption } from ".";

export class BarkConnector implements INotifier {
    private request: AxiosInstance;
    private option;

    constructor(option: {
        protocol: "http" | "https";
        host: string;
    }) {
        this.option = option;
        this.request = axios.create({
            baseURL: `${option.protocol}://${option.host}`,
        });
    }

    send(option: SendOption): void {
        const device_key = option.token;
        const temp: Omit<SendOption, "token"> & {
            token?: string
        } = option;
        delete temp.token;

        this.request.post("/push", {
            ...option,
            device_key
        })
    }
}
