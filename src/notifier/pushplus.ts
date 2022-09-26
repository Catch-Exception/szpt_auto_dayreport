import axios, { AxiosInstance } from "axios";
import { INotifier, SendOption } from ".";

export class PushplusConnector implements INotifier {
    private request: AxiosInstance;

    constructor() {
        this.request = axios.create({
            baseURL: "http://www.pushplus.plus",
        });
    }

    send(option: SendOption) {
        const content = option.body;
        const temp: Omit<SendOption, "body"> & {
            body?: string;
        } = option;
        delete temp.body;

        this.request.post("/send", {
            ...temp,
            content
        });
    }
}