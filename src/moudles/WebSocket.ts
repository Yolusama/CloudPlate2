import { ElNotification } from "element-plus";
import { webSocketUrl } from "./Request";
import { delayToRun } from "./Common";

const defaultErrorCallback = () => {
    ElNotification({
        message: "WebSocket连接或处理消息时出现问题!",
        type: "error"
    });
}

const defaultCloseCallback = () => {
    console.log("WebSocket已关闭...");
}

const defaultOpenCallback = () => {
    console.log("WebSocket已打开...");
}

class KWebSocket {
    private socket: any = null;
    private closeCallback: (event: CloseEvent) => void = defaultCloseCallback;
    private user: any = null;
    private timeout = 10 * 1000;
    private interval = 30 * 1000;
    private heartbeatTimer: any = 0;
    private reconnectTimer: any = 0;
    private heartbeatTimeout: any = 0;
    private maxTrial = 3;
    private shouldRetry = false;

    constructor() {

    }

    assign(userId: string, token: string) {
        if (this.user == null) {
            this.user = {
                id: userId,
                token: token
            };
        }
        const socket = new WebSocket(`${webSocketUrl}?userId=${userId}&token=${token}`);
        socket.onopen = () => {
            defaultOpenCallback();
            clearInterval(this.reconnectTimer);
            this.shouldRetry = false;
            this.heartbeatCheck();
        }
        socket.onclose = (event) => {
            if(!this.shouldRetry){
                this.closeCallback(event);
                return;
            }
            let i = 1;
            const expire = 5000;
            this.reconnectTimer = setInterval(() => {
                if(this.socket.readyState==this.socket.OPEN){
                    i=1;
                    clearInterval(this.reconnectTimer);
                    return;
                }
                if (i > this.maxTrial) {
                    console.log("重新连接次数超过最大重新次数，将放弃继续重新连接");
                    this.closeCallback(event);
                    clearInterval(this.reconnectTimer);
                }
                else {
                    this.reconnect();
                    console.log(`尝试重新连接，第${i++}次尝试...`);
                }
            }, expire);
        };
        socket.onerror = defaultErrorCallback;
        this.socket = socket;
    }

    assignOpenCallback(callback: (event: Event) => void) {
        this.socket.onopen = callback;
    }

    assignCloseCallback(callback: (event: CloseEvent) => void) {
        this.closeCallback = callback;
    }

    assignErrorCallback(callback: (event: Event) => void) {
        this.socket.onerror = callback;
    }

    assignMessageCallback(callback: (event: MessageEvent<any>) => void) {
        this.socket.onmessage = (event: MessageEvent<any>) => {
            const msg = JSON.parse(event.data);
            if (msg.isResponse != undefined) {
                console.log("收到心跳...");
                clearTimeout(this.heartbeatTimeout);
                this.heartbeatCheck();
            }
            else {
                callback(event);
            }
        }
    }

    sendMessage(message: any, callback: () => void) {
        try {
            this.socket.send(JSON.stringify(message));
            delayToRun(callback, 5);
        }
        catch (e) {
            console.log(e);
        }
    }

    close() {
        clearInterval(this.heartbeatTimer);
        clearTimeout(this.heartbeatTimeout);
        clearInterval(this.reconnectTimer);
        if (this.socket.readyState == this.socket.OPEN || this.socket.readyState == this.socket.CONNECTING)
            this.socket.close();
    }

    reconnect() {
        const socket = new WebSocket(`${webSocketUrl}?userId=${this.user.id}&token=${this.user.token}`);
        socket.onopen = this.socket.onopen;
        socket.onmessage = this.socket.onmessage;
        socket.onclose = this.socket.onclose;
        socket.onerror = this.socket.onerror;
        this.socket = socket;
    }

    private heartbeatCheck() {
        clearInterval(this.heartbeatTimer);
        clearInterval(this.reconnectTimer);
        clearTimeout(this.heartbeatTimeout);

        this.heartbeatTimer = setInterval(() => {
            this.heartbeatTimeout = setTimeout(() => {
                console.log("心跳超时！");
                this.close();
                this.shouldRetry = true;
            }, this.timeout);
            this.sendMessage({ userId: this.user.id, isResponse: false }, () => { });
        }, this.interval);
    }
}

const webSocket = new KWebSocket();
export default webSocket;