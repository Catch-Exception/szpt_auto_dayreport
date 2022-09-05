import axios, { AxiosInstance } from "axios";

export class BarkConnector {
  private request: AxiosInstance;

  constructor(option: { protocol: "http" | "https" | string; host: string }) {
    this.request = axios.create({
      baseURL: `${option.protocol}://${option.host}`,
    });
  }

  send(
    device_key: string,
    option: {
      body: string;
      title?: string;
      group?: string;
      icon?: string;
    }
  ) {
    return this.request.post("/push", {
      ...option,
      device_key,
    });
  }
}
