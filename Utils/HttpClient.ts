import MD5 from "MD5";
export default class HttpClient {
    // static gameUrl: string = "http://localhost:50000";  // 本地调试使用
    static gameUrl: string = "http://westj.the9.fun";
    static HEADER_TYPE_FORM: string = "application/x-www-form-urlencoded";
    static gid: number = 1016;
    static vid: number = 115;
    static HEADER_TYPE_JSON: string = "application/json";
    static secret: string = "";
    static _initialize: boolean = false;
    static saveData(t: any): void {

    }
    static getInfo(e: any, n: any): void {

    }
    static gameRequest(e: any, n: any, a: any, o: any): void {

    }
    static init(): void {
        if (this._initialize)
            return;
        this._initialize = true;
        // 如果是https或小游戏平台，修改http为https
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.gameUrl = this.gameUrl.replace("http://", "https://");
        }
    }


    static getJsonStr(e: any, n: any, a: boolean = true): string {
        if (!e.sign) {
            if (a) {
                const o = HttpClient.getFormStr(e, n, false, false);
                e.sign = this.getMd5(o, n);
            }
        }
        const i: any = {};
        const r = Object.keys(e);
        for (const s in r) {
            if ("object" == typeof e[r[s]])
                i[r[s]] = JSON.stringify(e[r[s]]);
            else
                i[r[s]] = e[r[s]];
        }
        return JSON.stringify(i);
    }



    static postJson(t: any, e: any, n: any): void {
        const a = this.getJsonStr(e, this.secret);
        this.post(t, a, n, this.HEADER_TYPE_JSON);
    }


    static post(url: any, body: any, callback: any, contentType?: any): void {
        // console.log("url:>>" + url + "<<",body);
        const o = new XMLHttpRequest();
        o.timeout = 30000;
        o.onload = () => {
            if (200 == o.status || 304 == o.status) {
                const t = o.responseText;
                if (callback.success)
                    callback.success(t);
            }
        };
        if (callback.fail) {
            o.ontimeout = () => { callback.fail("timeout"); };
            o.onerror = () => { callback.fail("error"); };
        }
        o.open("POST", this.gameUrl + url, true);
        if (contentType != null)
            o.setRequestHeader("content-type", contentType);
        else
            o.setRequestHeader("Content-Type", this.HEADER_TYPE_JSON);
        o.send(JSON.stringify(body));
    }

    static get(url: any, callback: any): void {
        const n = new XMLHttpRequest();
        n.timeout = 30000;
        n.onload = () => {
            if (n.status >= 200 || n.status < 400) {
                const t = n.responseText;
                callback.success(t);
            }
        };
        n.ontimeout = () => {
            callback.fail(n.status);
        };
        n.onerror = (t: any) => {
            callback.fail(n.status);
        };
        n.open("GET", url, true);
        n.send();
    }
    public static async async_post(url: any, body: any, contentType?: any) {
        return new Promise((resolve, reject) => {
            HttpClient.post(url, body, { success: resolve, fail: resolve }, contentType);
        });
    }
    static getMd5(t: any, e: any): string {
        t = decodeURIComponent(t);
        const n = t + e;
        return MD5.hex_md5(n);
    }

    static postObj(t: any, e: any, n: any, a: boolean = true): void {
        const o = this.getFormStr(e, this.secret);
        this.post(t, o, {
            success: (t: any) => {
                if (n.success) {
                    const e = JSON.parse(t);
                    if (a && 200 != e.code) {
                        if (n.fail)
                            n.fail(e.code);
                    }
                    else {
                        n.success(t);
                    }
                }
            },
            fail: (t: any) => {
                n.fail(t);
            }
        }, this.HEADER_TYPE_FORM);
    }
    static getFormStr(t: any, e: any, n: boolean = true, a: boolean = true): string {
        const o = Object.keys(t).sort();
        let i = "";
        for (const r in o) {
            if ("object" == typeof t[o[r]])
                i += o[r] + "=" + JSON.stringify(t[o[r]]) + "&";
            else if ("string" == typeof t[o[r]] && a)
                i += o[r] + "=" + encodeURIComponent(t[o[r]]) + "&";
            else
                i += o[r] + "=" + t[o[r]] + "&";
        }
        i = i.substr(0, i.length - 1);
        if (!t.sign && n)
            i += "&sign=" + this.getMd5(i, e);
        return i;
    }
    static put(url: any, body: any, callback: any, contentType?: any): void {
        // console.log("put,url:>>" + url + "<<");
        const o = new XMLHttpRequest();
        o.onreadystatechange = () => {
            if (4 == o.readyState && o.status >= 200 && o.status < 400) {
                const t = o.responseText;
                if (callback.success) {
                    console.info(t + "[" + typeof t + " ]");
                    callback.success(t);
                }
            }
        };
        if (callback.fail) {
            o.ontimeout = () => { callback.fail("timeout"); };
            o.onerror = () => { callback.fail("error"); };
        }
        o.open("PUT", url, true);
        if (contentType)
            o.setRequestHeader("Content-Type", contentType);
        else
            o.setRequestHeader("Content-Type", this.HEADER_TYPE_JSON);
        console.log("put里的body,", body, contentType);
        o.send(body);
    }


}
HttpClient.init();
