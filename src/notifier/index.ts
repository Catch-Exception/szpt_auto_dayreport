import { logger } from "../logger";
import { BarkConnector } from "./bark";
import { PushplusConnector } from "./pushplus";

export interface SendOption {
    title: string;
    body: string;
    //bark_key or pushplus token
    token: string;
    extra?: {
        [index: string]: string
    }
}

export interface NotifierOption {
    type: "pushplus" | "bark";
    option: {
        //bark_key or pushplus token
        token: string;
        //bark only
        host?: string;
        protocol?: "http" | "https";
        extra?: {
            [index: string]: string
        }
    },
}

export interface INotifier {
    send(option: SendOption): void;
}

export class Notifier implements INotifier {
    constructor(private connector: INotifier | null) { }

    send(option: SendOption) {
        this.connector?.send(option);
    }
}

export class NotifierFactory {
    private static readonly INSTANCE: Map<string, INotifier> = new Map();

    public static create(option: NotifierOption): Notifier {
        let instance: INotifier | null = null;

        do {
            if (option.type === "bark") {
                const host = option.option.host!;
                const protocol = option.option.protocol!;
                const addr = `${host}://${protocol}`;
                if (!host || !protocol) break;

                if (this.INSTANCE.has(addr)) {
                    instance = this.INSTANCE.get(addr)!;
                    break;
                }
                instance = new BarkConnector({
                    host,
                    protocol
                });
                this.INSTANCE.set(addr, instance);
                break;
            }

            if (option.type === "pushplus") {
                const addr = `www.pushplus.plus://http`;

                if (this.INSTANCE.has(addr)) {
                    instance = this.INSTANCE.get(addr)!;
                    break;
                }

                instance = new PushplusConnector();
                this.INSTANCE.set(addr, instance);
                break;
            }
        } while (false);

        return new Notifier(instance);
    }
}