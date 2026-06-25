import SdkManager from "SdkManager";
import WxManager from "WxManager";

const { ccclass } = cc._decorator;
@ccclass
export default class GameTools {
    public static artNumberUnits: string[] = [".", "/", ":", "", "<", "=", ">"];
    // ---- number formatting tables --------------------------------------------
    public static units: string[] = [
        "", "K", "M", "B", "T", "P", "E", "Z", "Y", "S", "L", "X", "D",
        "KK", "KM", "KB", "KT", "KP", "KE", "KZ", "KY", "KS", "KL", "KX",
        "MM", "MB", "MT", "MP", "ME", "MZ", "MY", "MS", "ML", "MX", "MD",
    ];
    public static normalUnits: string[] = [".", "-", "+", "", "K", "M", "B", "T", "P", "E", "Z", "Y"];
    public static ResBundle2: cc.AssetManager.Bundle | null = null;
    public static sdkInstance: SdkManager | null = null;
    public static Jsonbundle: cc.AssetManager.Bundle | null = null;
    // ---- cached singletons / bundles -----------------------------------------
    public static sceneBundle: cc.AssetManager.Bundle | null = null;
    public static bundle: cc.AssetManager.Bundle | null = null;
    public static ResBundle1: cc.AssetManager.Bundle | null = null;
    public static getHowPoint(val: number, scale: number): number {
        return Math.floor(val * scale) / scale;
    }
    // ---- SDK bridge ----------------------------------------------------------
    public static getSdk(): SdkManager {
        if (this.sdkInstance == null) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                this.sdkInstance = new WxManager();
            }
            else {
                this.sdkInstance = new SdkManager();
            }

        }
        return this.sdkInstance;
    }
    public static ConvertTargetPointToCoor(point: cc.Vec2, from: cc.Node, to: cc.Node): cc.Vec2 {
        let out = cc.Vec2.ZERO;
        try {
            const world = from.convertToWorldSpaceAR(point);
            out = to.convertToNodeSpaceAR(world);
        }
        catch (e) { /* ignore */ }
        return out;
    }
    // public static GetRes(bundleName: string, path: string): any{
    //     return GameTools.GetResJson(bundleName,path);
    // }
    public static GetRes<T>(bundleName: string, path: string, type: {
        new (): T;
    }): T | null {
        const b = this.getBundle(bundleName);
        const res = b && b.get(path, type);
        if (!res) {
            // console.log("还没有加载过的资源： " + path);
            return res as unknown as T;
        }
        return res as unknown as T;
    }
    public static loadJson(bundleName: string, path: string): Promise<any> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, cc.JsonAsset, (err: Error | null, asset: cc.JsonAsset | null) => {
                if (err) {
                    console.error(err);
                    resolve({});
                    return;
                }
                if (asset instanceof cc.JsonAsset)
                    resolve(this.parseCompressedJson(asset.json));
            });
        });
    }
    public static IsPosInCanvas(node: cc.Node): boolean {
        const canvas = cc.find("Canvas");
        if (canvas) {
            const local = this.ConvertTargetToCurLocal(node, canvas);
            const hw = canvas.width / 2;
            const hh = canvas.height / 2;
            return local.x >= -hw && local.x <= hw && local.y >= -hh && local.y <= hh;
        }
        console.log("没有找到canvas!!!!");
        return false;
    }
    public static IsGamePause(): boolean { return cc.director.isPaused(); }
    public static async GetResJson(bundleName: string, path: string): Promise<any[]> {
        const b = this.getBundle(bundleName);
        const res = b && b.get<cc.JsonAsset>(path);
        if (!res) {
            // console.log("还没有加载过的资源： " + path);
            return await GameTools.loadJson(bundleName, path);
        }
        return GameTools.parseCompressedJson(res.json);
    }
    /** Snap a point to its closest edge on a rect. */
    public static GetCloseInRectByPos(p: cc.Vec2, r: cc.Rect): cc.Vec2 {
        const dTop = Math.abs(r.yMax - p.y);
        const dBottom = Math.abs(r.yMin - p.y);
        const dLeft = Math.abs(r.xMin - p.x);
        const dRight = Math.abs(r.xMax - p.x);
        let min = dTop;
        if (min > dBottom)
            min = dBottom;
        if (min > dLeft)
            min = dLeft;
        if (min > dRight)
            min = dRight;
        if (min == dTop)
            return new cc.Vec2(p.x, r.yMax);
        if (min == dBottom)
            return new cc.Vec2(p.x, r.yMin);
        if (min == dLeft)
            return new cc.Vec2(r.xMin, p.y);
        return new cc.Vec2(r.xMax, p.y);
    }
    public static LoadFont(bundleName: string, path: string): Promise<cc.Font | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, cc.Font, (err: Error | null, asset: cc.Font | null) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
    /** Returns `[a%360, chosen b equivalent]` so that the angular difference to `a` is minimal. */
    public static GetMinAngleValue(a: number, b: number): number[] {
        a %= 360;
        b %= 360;
        let chosen = b;
        let minAbs = Math.abs(a - b);
        const b1 = b + 360;
        const d1 = Math.abs(a - b1);
        if (d1 < minAbs) {
            minAbs = d1;
            chosen = b1;
        }
        const b2 = b - 360;
        const d2 = Math.abs(a - b2);
        if (d2 < minAbs) {
            minAbs = d2;
            chosen = b2;
        }
        return [a, chosen];
    }
    // ---- time helpers --------------------------------------------------------
    /** Timestamp (ms) corresponding to 00:00 local time today. */
    public static get0Time(): number {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    }
    public static GetTwoArray<T>(rows: number, cols: number, fill: T): T[][] {
        const out: T[][] = [];
        for (let i = 0; i < rows; i++)
            out.push(this.GetOneArray(cols, fill));
        return out;
    }
    public static GetOneArray<T>(len: number, fill: T): T[] {
        const out: T[] = [];
        for (let i = 0; i < len; i++)
            out.push(fill);
        return out;
    }
    public static loadAudioClip(bundleName: string, path: string): Promise<cc.AudioClip | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, cc.AudioClip, (err: Error | null, asset: cc.AudioClip | null) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
    public static GamePause(): void { cc.director.pause(); }
    // ---- bundle async loaders ------------------------------------------------
    /**
     * 解压压缩格式的 JSON 数据
     * 压缩格式: [["key1","key2",...],[val1,val2,...],...]
     * 解压为: [{key1:val1, key2:val2, ...}, ...]
     */
    public static parseCompressedJson(raw: any[]): any[] {
        if (!Array.isArray(raw) || raw.length === 0)
            return raw;
        if (!Array.isArray(raw[0]))
            return raw;
        const keys: string[] = raw[0];
        const result: any[] = [];
        for (let i = 1; i < raw.length; i++) {
            const obj: any = {};
            const row: any[] = raw[i];
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j]] = row[j];
            }
            result.push(obj);
        }
        return result;
    }
    public static loadImage(bundleName: string, path: string): Promise<cc.SpriteFrame | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, cc.SpriteFrame, (err: Error | null, asset: cc.SpriteFrame | null) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
    public static hour_min_secTimeFuncion(sec: number): string {
        let out = "";
        if (sec > -1) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor(sec / 60 - 60 * h);
            const s = Math.floor(sec - 3600 * h - 60 * m);
            let hh = h.toString();
            let mm = m.toString();
            let ss = s.toString();
            if (h < 10)
                hh = "0" + h.toString();
            if (m < 10)
                mm = "0" + m.toString();
            if (s < 10)
                ss = "0" + s.toString();
            out = hh + ":" + mm + ":" + ss;
        }
        return out;
    }
    public static Screen2CoordPos(screen: cc.Vec2, target: cc.Node, camera: cc.Camera): cc.Vec2 {
        let out = cc.Vec2.ZERO;
        try {
            const world = camera.getScreenToWorldPoint(screen);
            const p = target.convertToNodeSpaceAR(world);
            out = new cc.Vec2(p.x, p.y);
        }
        catch (e) { /* ignore */ }
        return out;
    }
    public static GetComponentInParent<T extends cc.Component>(node: cc.Node, compType: {
        new (): T;
    } | string): T | null {
        const parent = node.parent;
        if (!parent)
            return null;
        const comp = parent.getComponent(compType as any) as T | null;
        if (comp)
            return comp;
        try {
            return this.GetComponentInParent(parent, compType);
        }
        catch (e) {
            return null;
        }
    }
    public static sec_to_timefunction(sec: number): string {
        let out = "";
        if (sec > -1) {
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec - 60 * m);
            out = (m >= 10 ? "" + m : "0" + m) + ":" + (s >= 10 ? "" + s : "0" + s);
        }
        return out;
    }
    public static LoadAny<T>(bundleName: string, path: string, type: {
        new (): T;
    }): Promise<T | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, type, (err: Error | null, asset: T | null) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
    public static isWxGame(): boolean {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }

    public static RemoveFromArray<T>(arr: T[] | undefined, item: T): void {
        if (arr === undefined)
            arr = [];
        const idx = arr.indexOf(item);
        if (idx > -1)
            arr.splice(idx, 1);
    }
    /** Convert a cc.Node world rect to WeChat mini-program screen coords. */
    public static cocosToWX(node: cc.Node): cc.Rect {
        const fw = cc.view.getFrameSize().width;
        const fh = cc.view.getFrameSize().height;
        const vw = cc.winSize.width;
        const vh = cc.winSize.height;
        const w = node.width;
        const h = node.height;
        const lt = node.convertToWorldSpace(cc.v2(0, h));
        return cc.rect((fw / vw) * lt.x, (1 - lt.y / vh) * fh, (fw / vw) * w, (fh / vh) * h);
    }
    public static GameResume(): void { cc.director.resume(); }
    /** Format big numbers with K/M/B/... suffix. */
    public static refSetCoin(val: number): string {
        if (val == null) {
            return "???";
        }
        if (typeof val != "string") {
            val = Number(val);
        }
        if (val < 1000) {
            return Math.floor(val) == val ? val.toFixed(0) + "" : val.toFixed(2) + "";
        }
        let out = "???";
        const n = this.units.length;
        let base = 1;
        for (let i = 0; i < n; i++) {
            const upper = 1000 * base;
            if (val < upper) {
                out = (Math.floor(val / base * 10) / 10) + this.units[i];
                break;
            }
            base = upper;
        }
        return out;
    }
    public static GetUpDirLocalVect(target: cc.Node, ref: cc.Node | null = null): cc.Vec2 {
        if (ref == null)
            ref = target.parent;
        const up = target.up;
        const v = cc.v2(up.x, up.y);
        return (ref as cc.Node).convertToNodeSpaceAR(v);
    }
    // ---- number -> string formatting -----------------------------------------
    public static ConvertNumberToUit(val: number, units?: string[]): string {
        if (units === undefined)
            units = this.normalUnits;
        const negative = val < 0;
        let out = "????";
        val = Math.abs(val);
        if (val < 1000)
            return negative ? units[1] + val.toFixed(0) + "" : val.toFixed(0) + "";
        const n = units.length;
        let base = 1;
        for (let i = 3; i < n; i++) {
            const upper = 1000 * base;
            if (val < upper) {
                out = (Math.floor(val / base * 10) / 10) + units[i];
                break;
            }
            base = upper;
        }
        out.replace(".", units[0]);
        if (negative)
            out = units[1] + out;
        return out;
    }
    /** Seconds remaining until midnight (local time). */
    public static nowToZero(): number {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();
        const ss = now.getSeconds();
        const remain = 86400 - (3600 * hh + 60 * mm + ss);
        console.log("now:", hh, mm, ss, remain);
        return remain;
    }
    public static GetNumFromArray<T>(arr: T[] | undefined, item: T): number {
        if (arr === undefined)
            arr = [];
        let count = 0;
        const n = arr.length;
        for (let i = 0; i < n; i++)
            if (arr[i] == item)
                count += 1;
        return count;
    }
    /** Resolve one of the known AssetManager bundles by its declarative key. */
    public static getBundle(name: string): cc.AssetManager.Bundle | null {
        let b: cc.AssetManager.Bundle | null = null;
        switch (name) {
            case "JsonBundle":
                b = GameTools.Jsonbundle;
                break;
            case "Bundle":
                b = GameTools.bundle;
                break;
            case "ResBundle1":
                b = GameTools.ResBundle1;
                break;
            case "ResBundle2":
                b = GameTools.ResBundle2;
                break;
        }
        return b;
    }
    public static randomMinToMax(min: number, max: number): number {
        const r = Math.random();
        return parseInt((100 * (r * (max - min) + min)) + "") / 100;
    }
    // ---- coordinate-space helpers --------------------------------------------
    public static ConvertTargetToCurLocal(target: cc.Node, cur: cc.Node): cc.Vec2 {
        let out = cc.Vec2.ZERO;
        try {
            const pos = target.getPosition();
            const world = target.parent!.convertToWorldSpaceAR(pos);
            out = cur.convertToNodeSpaceAR(world);
        }
        catch (e) { /* ignore */ }
        return out;
    }
    public static ConvertNumberToAscii(val: number, units?: string[], withPlus?: boolean): string {
        if (units === undefined)
            units = this.normalUnits;
        if (withPlus === undefined)
            withPlus = true;
        val = parseInt(val.toString());
        let out = val.toString();
        if (val < 0) {
            out = out.replace("-", "");
            out = units[1] + out;
        }
        else if (withPlus) {
            out = out.replace("+", "");
            out = units[2] + out;
        }
        return out;
    }
    public static ConvertTargetCameraToCur(target: cc.Node, camera: cc.Camera, cur: cc.Node, cur2: cc.Camera): cc.Vec2 {
        const world = target.parent!.convertToWorldSpaceAR(target.getPosition());
        const screen = camera.getWorldToScreenPoint(world);
        return this.Screen2CoordPos(new cc.Vec2(screen.x, screen.y), cur, cur2);
    }
    public static loadPrefab(bundleName: string, path: string): Promise<cc.Prefab | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, cc.Prefab, (err: Error | null, asset: cc.Prefab | null) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
    public static LoadSpinData(bundleName: string, path: string): Promise<sp.SkeletonData | null> {
        return new Promise((resolve) => {
            this.getBundle(bundleName)!.load(path, sp.SkeletonData, (err: Error | null, asset: sp.SkeletonData | null) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
}
