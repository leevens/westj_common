/**
 * GameSystem - 游戏系统核心管理器
 * 负责管理游戏中的全局数据、运行时状态和资源引用
 */
import SaveManager from "SaveManager";
import { EventConst } from "EventConst";
const { ccclass } = cc._decorator;
@ccclass
export default class GameSystem extends cc.Component {
    /** 队伍数据 */
    public static team: any[] = [];
    /** 弟子等级数据 */
    public static discipleLv: any[] = [];
    /** 宠物经验数组 */
    public static petexp2: number[] = [];
    /** 奖励数据 */
    public static award: number[] = [];
    /** 丹药时间 */
    public static drugtime: number[] = [];
    /** 商店盒子时间 */
    public static shopboxtime: number[] = [];
    /** 宠物等级数组 */
    public static petlevel2: number[] = [];
    /** 解锁的神器列表 */
    public static unlockartifacts: number[] = [];
    /** 商店盒子数量 */
    public static shopboxnum: number[] = [];
    /** 在线奖励领取状态 */
    public static onlineisget: number[] = [0, 0, 0, 0];
    /** 引导进度 */
    public static guide: number[] = [1, 0];
    /** 神器列表 */
    public static artifactslist: number[] = [];
    /** 背包数据 */
    public static pack: any[] = [];
    /** 地标数据 */
    public static landmark: number[] = [];
    /** 游历宝箱领取状态 */
    public static roamboxisget: number[] = [];
    /** 刷新时间 */
    public static reftime: number[] = [];
    /** 技能等级数组 */
    public static skilllevel: number[] = [1, 0, 0, 0, 0];
    /** 强化等级数组 */
    public static intensifyLv: number[] = [];
    /** 建筑等级数组 */
    public static buildlv: number[] = [];
    /** 商品列表 */
    public static goods: number[] = [];
    /** 游历宝箱 */
    public static roambox: number[] = [];
    /** 丹药过期时间 */
    public static drugover: number[] = [];
    /** 丹药数量 */
    public static drugnum: number[] = [];
    /** 丹药盒数量 */
    public static drugboxnum: number[] = [];
    /** 每日任务数据 */
    public static everyday: any[] = [];
    /** 金币数量 */
    public static gold: number = 0;
    /** 商店购买次数 */
    public static shopcount: number = 0;
    /** 丹药预制 */
    public static danMadicine: any = null;
    /** 商品项 */
    public static goodsitem: any = {};
    /** 铜币图标预制 */
    public static CoinIcon: any = null;
    /** 铜币数量 */
    public static coin: number = 0;
    /** 最高层 */
    public static maxtier: number = 0;
    /** 在线时长 */
    public static online: number = 0;
    /** 每日任务完成次数 */
    public static everydaycount: number = 0;
    // ========== 运行时对象池/Prefab 引用 ==========
    /** 提示文本预制 */
    public static _tipTxt: any = null;
    /** 是否显示横幅广告 */
    public static isShowBannerAd: boolean = true;
    /** 月亮特效预制 */
    public static MoonEffect: any = null;
    /** 产出铜币预制 */
    public static OutputCoin: any = null;
    /** 最高关卡 */
    public static maxcustoms: number = 0;
    /** 重生次数 */
    public static resume: number = 0;
    /** 当前层 */
    public static tier: number = 0;
    /** 战斗升级预制 */
    public static CombatBoost: any = null;
    // ========== 运行时标记 ==========
    /** 是否已登录 */
    public static islogin: boolean = false;
    /** 是否添加颜色标记 */
    public static isaddColorSign: boolean = false;
    /** 是否显示视频广告 */
    public static isShowVideoAd: boolean = true;
    /** 技能特效预制 */
    public static SkillSp: any = null;
    /** 性别（0-男，1-女） */
    public static sex: number = 0;
    /** 回城技能特效 */
    public static SkillHC: any = null;
    /** 刀特效预制 */
    public static Knife: any = null;
    /** 用户ID */
    public static userid: string = "";
    /** 当前位置 */
    public static pos: number = 0;
    /** 业火特效 */
    public static yehuo: any = null;
    /** 星辰特效预制 */
    public static StarEffect: any = null;
    /** 战斗文本预制 */
    public static fightTxt: any = null;
    /** 购买次数 */
    public static buycount: number = 0;
    // ========== 持久化数据 ==========
    /** 当前关卡 */
    public static customs: number = 0;
    /** 宗门文本预制 */
    public static SectText: any = null;
    /** 是否自动战斗 */
    public static automatic: boolean = false;
    /** 怪物预制 */
    public static monster: any = null;
    /** 光谱特效预制 */
    public static spectrum: any = null;
    public static adaward_nexttime: number = 0;
    /** 火焰特效预制 */
    public static FlameEffect: any = null;
    /** 是否开启加速 */
    public static Speed: boolean = false;
    /** 开放ID */
    public static openid: string = "";
    /** 渠道名称 */
    public static channel: string = "blank";
    /** 插屏广告时间 */
    public static interTime: number = 0;
    /** 持续治愈特效 */
    public static PersistentHeal: any = null;
    /** 商店刷新次数 */
    public static shopref: number = 0;
    /** 是否显示插屏广告 */
    public static isShowInterAd: boolean = true;
    /** 当前速度倍数 */
    public static speed: number = 1;
    /** 扫荡次数 */
    public static mopup: number = 1;
    /** 境界经验 */
    public static realmexp: number = 0;
    /** 奖励物品预制 */
    public static rewardItem: any = null;
    /** 火焰掌特效 */
    public static Flamepalm: any = null;
    /** 今日时间戳（用于跨天判断） */
    public static todayTime: number = 0;
    /** 游历经验 */
    public static roamexp: number = 0;
    /** 重置时间 */
    public static resetTime: number = 0;
    /** 最大神器数量 */
    public static maxartifacts: number = 0;
    /** 治愈矩阵特效 */
    public static HealingMatrix: any = null;
    /** 转世次数 */
    public static reincarn: number = 0;
    /** 灼热光环特效 */
    public static HeatHalo: any = null;
    /** 引导怪物预制 */
    public static GuideMonster: any = null;
    /** 星星特效预制 */
    public static star: any = null;
    /** 诅咒矩阵特效 */
    public static BaneMatrix: any = null;
    /** 陨石特效预制 */
    public static meteor: any = null;
    /** 是否中断 */
    public static doBreak: boolean = false;
    /** 灾难值 */
    public static disater: number = 100;
    /** 当前神器 */
    public static nowartifacts: number = 0;
    /** 弟子预制 */
    public static disciple: any = null;
    /** 游历宝箱物品预制 */
    public static roamboxitem: any = null;
    /** 音乐开关 */
    public static music: boolean = true;
    /** 音效开关 */
    public static sound: boolean = true;
    
    /** 游历次数 */
    public static roamcount: number = 0;
    /** 神器预制 */
    public static artifacts: any = null;
    /** 保存时间 */
    public static saveTime: number = 0;
    /** 子弹预制 */
    public static buttet: any = null;
    /** 是否跳过引导 */
    public static isjumpguide: boolean = false;
    /** 闪屏广告计数 */
    public static splashAdCount: number = 5;
    /** 骰子数量 */
    public static dicenum: number = 0;
    /** 是否首次加载游戏 */
    public static isFirstLoad: boolean = true;
    /** 装备物品预制 */
    public static equipitem: any = null;
    /** 是否已添加到桌面 */
    public static isAddToDesktop: boolean = false;
    /** 雷电特效预制 */
    public static ThunderEffect: any = null;
    /** 魔值 */
    public static devil: number = 0;
    /** 是否已签到 */
    public static signisget: boolean = false;
    /** 风特效预制 */
    public static WindEffect: any = null;
    /** 服务器时间戳 */
    public static serverTime: number = 0;
    /** 五庄灵墟命中特效 */
    public static wzlxHit: any = null;
    /** 强化次数 */
    public static intensivecount: number = 0;
    /** 是否正在录制 */
    public static isdorecorder: boolean = false;
    /** 添加时间 */
    public static addTime: number = 0;
    /** 是否允许移动 */
    public static doMove: boolean = true;
    /** 剩余转世次数 */
    public static reincarncount: number = 0;
    /** 宝石数量 */
    public static jewel: number = 0;
    /** 连击技能特效 */
    public static SkillLJ: any = null;
    /** 游戏天数 */
    public static day: number = 0;
    /** 最高等级 */
    public static maxlevel: number = 1;
    /** 当前宠物索引 */
    public static petIndex: number = 1;
    /** 背包物品预制 */
    public static packitem: any = null;
    /** 重置次数 */
    public static resetcount: number = 1;
    /** 制作次数 */
    public static makecount: number = 0;
    /** 游戏是否在运行 */
    public static tick: boolean = true;
    /** 当前等级 */
    public static level: number = 1;
    /** 火球特效预制 */
    public static Fireball: any = null;
    /** 骰子时间 */
    public static dicetime: number = 0;
    /** 升级物品预制 */
    public static raiseditem: any = null;
    /** 漩涡特效预制 */
    public static Eddy: any = null;
    /** 炼丹次数 */
    public static drugcount: number = 0;
    public static getGoodsItem(): any { return this.goodsitem; }
    public static getOffTime(): number { return this.saveTime; }
    // ========== 加载 / 保存 ==========
    /** 加载游戏存档数据 */
    public static LoadGameDate(): void {
        this.saveTime = SaveManager.readInt("SAVETIME", 0);
        this.todayTime = SaveManager.readInt("TOADYTIME", 0);
        this.team = SaveManager.readobjArray("TEAM", this.initTeam());
        this.petIndex = SaveManager.readInt("PETINDEX", 1);
        this.level = SaveManager.readInt("LEVEL", 1);
        this.maxlevel = SaveManager.readInt("MAXLEVEL", 1);
        this.sex = SaveManager.readInt("SEX", 0);
        // this.coin = SaveManager.readInt("COIN", 0);
        // this.jewel = SaveManager.readInt("JEWEL", 300);
        // this.gold = SaveManager.readInt("GOLD", 0);
        this.isFirstLoad = SaveManager.readBool("ISFRISTLOAD", true);
        this.devil = SaveManager.readInt("DEVIL", 0);
        this.buycount = SaveManager.readInt("BUYCOUNT", 0);
        this.maxartifacts = SaveManager.readInt("MAXARTIFACTS", 0);
        this.artifactslist = SaveManager.readintArray("ARTIFACTSLIST", this.initArtifacts());
        this.unlockartifacts = SaveManager.readintArray("UNLOCKARTIFACTS", []);
        this.nowartifacts = SaveManager.readInt("NOWARTIFACTS", 0);
        this.petlevel2 = SaveManager.readintArray("PETLEVEL2", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        this.petexp2 = SaveManager.readintArray("PETEXP2", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.customs = SaveManager.readInt("CUSTOMS", 1);
        this.maxcustoms = SaveManager.readInt("MAXCUSTOMS", 1);
        this.guide = SaveManager.readintArray("GUIDE", [1, 0]);
        this.everyday = SaveManager.readEveryDay("EVERYDAY", this.initEveryDay());
        this.everydaycount = SaveManager.readInt("EVERYDAYCOUNT", 0);
        this.award = SaveManager.readintArray("AWARD", this.initAward());
        this.roamcount = SaveManager.readInt("ROAMCOUNT", 0);
        this.intensivecount = SaveManager.readInt("INTENSIVECOUNT", 0);
        this.makecount = SaveManager.readInt("MAKECOUNT", 0);
        this.shopcount = SaveManager.readInt("SHOPCOUNT", 0);
        this.tier = SaveManager.readInt("TIER", 1);
        this.maxtier = SaveManager.readInt("MAXTIER", 1);
        this.resume = SaveManager.readInt("RESUME", 0);
        this.buildlv = SaveManager.readintArray("BUILDLV", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.resetcount = SaveManager.readInt("RESETCOUNT", 1);
        this.mopup = SaveManager.readInt("MOPUP", 1);
        this.music = SaveManager.readBool("MUSIC", true);
        this.sound = SaveManager.readBool("SOUND", true);
        this.goods = SaveManager.readintArray("GOODS", this.initGoods());
        this.shopref = SaveManager.readInt("SHOPREF", 4);
        this.shopboxnum = SaveManager.readintArray("SHOPBOXNUM", [2, 2]);
        this.shopboxtime = SaveManager.readintArray("SHOPBOXTIME", [0, 0]);
        this.reftime = SaveManager.readintArray("REFTIME", [0, 0, 0, 0]);
        this.goodsitem = SaveManager.readObject("GOODSITEM", {});
        this.pack = SaveManager.readpack("PACK", []);
        this.reincarn = SaveManager.readInt("REINCARN", 0);
        this.reincarncount = SaveManager.readInt("REINCARNCOUNT", 3);
        this.automatic = SaveManager.readBool("AUTOMATIC", false);
        this.Speed = SaveManager.readBool("SPEED", false);
        this.online = SaveManager.readInt("ONLINE", 0);
        this.onlineisget = SaveManager.readintArray("ONLINEISGET", [0, 0, 0, 0]);
        this.day = SaveManager.readInt("DAY", 0);
        this.signisget = SaveManager.readBool("SIGNISGET", false);
        this.dicenum = SaveManager.readInt("DICENUM", 10);
        this.dicetime = SaveManager.readInt("DICETIME", 0);
        this.pos = SaveManager.readInt("POS", 2);
        this.roamexp = SaveManager.readInt("ROAMEXP", 0);
        this.roambox = SaveManager.readintArray("ROAMBOX", []);
        this.roamboxisget = SaveManager.readintArray("ROAMBOXISGET", []);
        this.landmark = SaveManager.readintArray("LANDMARK", this.initLandMark());
        this.drugnum = SaveManager.readintArray("DRUGNUM", [0, 0, 0, 0, 0, 0]);
        this.drugtime = SaveManager.readintArray("DRUGTIME", [0, 0, 0, 0, 0, 0]);
        this.drugboxnum = SaveManager.readintArray("DRUGBOXNUM", [0, 0, 0, 0, 0, 0]);
        this.drugover = SaveManager.readintArray("DRUGOVER", [0, 0, 0, 0, 0, 0]);
        this.drugcount = SaveManager.readInt("DRUGCOUNT", 0);
        this.realmexp = SaveManager.readInt("REALMEXP", 0);
        this.intensifyLv = SaveManager.readintArray("INTENSIFYLV", [0, 0, 0, 0, 0]);
        this.skilllevel = SaveManager.readintArray("SKILLLEVEL", [1, 0, 0, 0, 0]);
        this.discipleLv = SaveManager.readDisciple("DISCIPLELV", this.initDisciple());
        this.isAddToDesktop = SaveManager.readBool("ISADDTODESKTOP", false);
        this.isaddColorSign = SaveManager.readBool("ISADDCOLORSIGN", false);
        this.adaward_nexttime = SaveManager.readInt("ADNEXTTIME", 0);
        const now = new Date();
        GameSystem.serverTime = now.getTime();
        const todayStart: number = new Date(this.serverTime).setHours(0, 0, 0, 0);
        // 跨天处理
        // 换日次数重置 TODO
        if (this.todayTime < todayStart) {
            // console.log("跨天了刷新");
            this.todayTime = todayStart;
            SaveManager.writeData("TOADYTIME", this.todayTime);
            this.resetcount = 1;
            SaveManager.writeData("RESETCOUNT", this.resetcount);
            this.mopup = 1;
            SaveManager.writeData("MOPUP", this.mopup);
            this.shopboxnum = [2, 2];
            SaveManager.writeData("SHOPBOXNUM", this.shopboxnum);
            this.reftime = [0, 0, 0, 0];
            SaveManager.writeData("REFTIME", this.reftime);
            this.reincarncount = 3;
            SaveManager.writeData("REINCARNCOUNT", this.reincarncount);
            this.everyday = this.initEveryDay();
            SaveManager.writeData("EVERYDAY", this.everyday);
            this.setShopRefCount(true);
            this.online = 0;
            SaveManager.writeData("ONLINE", this.online);
            this.onlineisget = [0, 0, 0, 0];
            SaveManager.writeData("ONLINEISGET", this.onlineisget);
            this.day += 1;
            SaveManager.writeData("DAY", this.day);
            this.signisget = false;
            SaveManager.writeData("SIGNISGET", this.signisget);
            SaveManager.writeData("ADCOUNT", 0);
        }
        SaveManager.writeData("ENC", 1);
    }
    public static setDevil(v: number): void { this.devil = v; SaveManager.writeData("DEVIL", this.devil); }
    public static getJewel(): number { return SaveManager.readInt("JEWEL", 0); }
    public static getInviteFinish(): number { return SaveManager.readInt("INVITE_FINISH", 0); }
    public static getEveryDay(): any[] { return this.everyday; }
    public static getUnlockArtifacts(): number[] { return this.unlockartifacts; }
    public static getSex(): number { return this.sex; }
    public static setUnlockArtifacts(): void { this.unlockartifacts.push(); SaveManager.writeData("UNLOCKARTIFACTS", this.unlockartifacts); }
    public static getPetExp(): number[] { return this.petexp2; }
    public static addCoin(v: number): void { SaveManager.addData("COIN", v); }
    public static getGuide(): number[] { return this.guide; }
    public static getCustoms(): number { return this.customs; }
    public static getaddColorSign(): boolean { return this.isaddColorSign; }
    public static getRoamBox(): number[] { return this.roambox; }
    public static setMopUp(v: number): void { this.mopup = v; SaveManager.writeData("MOPUP", this.mopup); }
    public static setOffTime(): void { const now = new Date(); this.saveTime = now.getTime(); SaveManager.writeData("SAVETIME", this.saveTime); }
    public static getLevel(): number { return this.level; }
    public static getDrugNum(): number[] { return this.drugnum; }
    public static setisAddToDesktop(): void { this.isAddToDesktop = true; SaveManager.writeData("ISADDTODESKTOP", this.isAddToDesktop); }
    public static getAdCount(): number { return SaveManager.readInt("ADCOUNT", 0); }
    public static setMaxLevel(v: number): void { this.maxlevel = v; SaveManager.writeData("MAXLEVEL", this.maxlevel); }
    public static setAdNextTime(v: number): void { this.adaward_nexttime = v; SaveManager.writeData("ADNEXTTIME", this.adaward_nexttime); }
    public static setLandmark(idx: number): void { this.landmark[idx] += 1; SaveManager.writeData("LANDMARK", this.landmark); }
    // ========== 初始化辅助 ==========
    /** 初始化队伍数据 */
    public static initTeam(): any[] {
        const arr: any[] = [];
        for (let i = 0; i < 6; i++) {
            if (i === 0)
                arr.push({ type: 0, id: 0 });
            else if (i === 1)
                arr.push({ type: 1, id: -1 });
            else
                arr.push({ type: 2, id: -1 });
        }
        return arr;
    }
    public static setArtifactslist(v: number[]): void { this.artifactslist = v; SaveManager.writeData("ARTIFACTSLIST", this.artifactslist); }
    public static getDrugOver(): number[] { return this.drugover; }
    public static getShopBoxNum(): number[] { return this.shopboxnum; }
    public static setRoamCount(): void { this.roamcount++; SaveManager.writeData("ROAMCOUNT", this.roamcount); }
    public static getEveryDayCount(): number { return this.everydaycount; }
    public static setIsFirst(): void { this.isFirstLoad = false; SaveManager.writeData("ISFRISTLOAD", this.isFirstLoad); }
    public static getPlayerId(): string { return SaveManager.readString("_id", ""); }
    public static _clearGameData(): void { cc.sys.localStorage.clear(); }
    public static setDrugCount(v: number): void { this.drugcount += v; SaveManager.writeData("DRUGCOUNT", this.drugcount); }
    public static setGoods(v: number[]): void { this.goods = v; SaveManager.writeData("GOODS", this.goods); }
    public static setEveryDayCount(): void { this.everydaycount++; SaveManager.writeData("EVERYDAYCOUNT", this.everydaycount); }
    public static getBuildLv(): number[] { return this.buildlv; }
    public static getRefTime(): number[] { return this.reftime; }
    public static setShopBoxTime(v: number[]): void { this.shopboxtime = v; SaveManager.writeData("SHOPBOXTIME", this.shopboxtime); }
    public static setDrugNum(v: number[]): void { this.drugnum = v; SaveManager.writeData("DRUGNUM", this.drugnum); }
    public static setRoamBox(v: number[]): void { this.roambox = v; SaveManager.writeData("ROAMBOX", this.roambox); }
    public static getBuyCount(): number { return this.buycount; }
    public static setBuildLv(v: number[]): void { this.buildlv = v; SaveManager.writeData("BUILDLV", this.buildlv); }
    public static setMaxCustoms(v: number): void { this.maxcustoms = v; SaveManager.writeData("MAXCUSTOMS", this.maxcustoms); }
    /** 初始化奖励数据 */
    public static initAward(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < 15; i++)
            arr.push(1);
        return arr;
    }
    public static getAward(): number[] { return this.award; }
    public static setMaxArtifacts(v: number): void { this.maxartifacts = v; SaveManager.writeData("MAXARTIFACTS", this.maxartifacts); }
    public static addGold(v: number): void { SaveManager.addData("GOLD", v); }
    /** 初始化地标数据 */
    public static initLandMark(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < 12; i++)
            arr.push(0);
        return arr;
    }
    public static setTeam(v: any[]): void { this.team = v; SaveManager.writeData("TEAM", this.team); }
    public static setSex(v: number): void { this.sex = v; SaveManager.writeData("SEX", this.sex); }
    public static getGoods(): number[] { return this.goods; }
    public static setResetCount(v: number): void { this.resetcount = v; SaveManager.writeData("RESETCOUNT", this.resetcount); }
    public static getMaxTier(): number { return this.maxtier; }
    public static getRoamBoxIsGet(): number[] { return this.roamboxisget; }
    public static setRefTime(v: number[]): void { this.reftime = v; SaveManager.writeData("REFTIME", this.reftime); }
    public static setDisciple(v: any[]): void {
        this.discipleLv = v;
        SaveManager.writeData("DISCIPLELV", this.discipleLv);
        cc.systemEvent.emit(EventConst.Game_Guide);
    }
    public static getRealmExp(): number { return this.realmexp; }
    public static getMaxCustoms(): number { return this.maxcustoms; }
    public static setMakeCount(): void { this.makecount++; SaveManager.writeData("MAKECOUNT", this.makecount); }
    public static getAdNextTime(): number { return this.adaward_nexttime; }
    public static setBuyCount(reset?: boolean): void {
        if (reset === undefined)
            reset = false;
        if (reset)
            this.buycount = 0;
        else
            this.buycount += 1;
        SaveManager.writeData("BUYCOUNT", this.buycount);
    }
    public static getMakeCount(): number { return this.makecount; }
    public static initSkillLevel(): void { this.skilllevel = [1, 0, 0, 0, 0]; SaveManager.writeData("SKILLLEVEL", this.skilllevel); }
    /** 初始化商品数据 */
    public static initGoods(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < 12; i++)
            arr.push(1);
        return arr;
    }
    public static getSignIsGet(): boolean { return this.signisget; }
    public static getDrugTime(): number[] { return this.drugtime; }
    public static getMaxArtifacts(): number { return this.maxartifacts; }
    public static getIsFirst(): boolean { return this.isFirstLoad; }
    /** 保存游戏存档数据 */
    public static SaveGameDate(): void {
        // SaveManager.writeDatas({
        //     TEAM: this.team,
        //     SAVETIME: this.saveTime,
        //     LEVEL: this.level,
        //     // COIN: this.coin,
        //     // JEWEL: this.jewel,
        //     // GOLD: this.gold,
        //     BUYCOUNT: this.buycount,
        //     MAXARTIFACTS: this.maxartifacts,
        //     ARTIFACTSLIST: this.artifactslist,
        //     UNLOCKARTIFACTS: this.unlockartifacts,
        //     NOWARTIFACTS: this.nowartifacts,
        //     CUSTOMS: this.customs,
        //     DRUGNUM: this.drugnum,
        //     DRUGTIME: this.drugtime,
        //     REALMEXP: this.realmexp,
        //     DRUGOVER: this.drugover,
        //     DRUGBOXNUM: this.drugboxnum,
        //     EVERYDAY: this.everyday,
        //     SHOPBOXTIME: this.shopboxtime,
        //     DICETIME: this.dicetime,
        //     DEVIL: this.devil,
        //     ONLINE: this.online,
        // });
    }
    public static getAutomatic(): boolean { return this.automatic; }
    public static setOnlineIsGet(idx: number): void { this.onlineisget[idx] = 1; SaveManager.writeData("ONLINEISGET", this.onlineisget); }
    public static getDevil(): number { return this.devil; }
    public static getPack(): any[] { return this.pack; }
    public static getReincarnCount(): number { return this.reincarncount; }
    public static setShopCount(): void { this.shopcount++; SaveManager.writeData("SHOPCOUNT", this.shopcount); }
    public static setEveryDay(v: any[]): void { this.everyday = v; SaveManager.writeData("EVERYDAY", this.everyday); }
    public static setDiceNum(v: number): void { this.dicenum += v; SaveManager.writeData("DICENUM", this.dicenum); }
    /** 初始化神器数据 */
    public static initArtifacts(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < 12; i++)
            arr.push(0);
        return arr;
    }
    // 增加今日广告次数，以及广告次数的重置时间
    public static addAdCount(): void {
        SaveManager.writeData("ADCOUNT", this.getAdCount() + 1);
    }
    public static setGuide(v: number[]): void { this.guide = v; SaveManager.writeData("GUIDE", this.guide); }
    public static setDiceTime(v: number): void { this.dicetime = v; SaveManager.writeData("DICETIME", this.dicetime); }
    public static setRoamBoxIsGet(v: number[]): void { this.roamboxisget = v; SaveManager.writeData("ROAMBOXISGET", this.roamboxisget); }
    /** 初始化每日任务数据 */
    public static initEveryDay(): any[] {
        const arr: any[] = [];
        for (let i = 0; i < 12; i++)
            arr.push({ state: 0, time: 0 });
        return arr;
    }
    public static setReincarnCount(v: number): void { this.reincarncount = v; this.setResume(); SaveManager.writeData("REINCARNCOUNT", this.reincarn); }
    public static getMaxLevel(): number { return this.maxlevel; }
    public static getSpeed(): boolean { return this.Speed; }
    public static getLandmark(): number[] { return this.landmark; }
    public static getIntensify(): number[] { return this.intensifyLv; }
    public static setIntensify(idx: number): void { this.intensifyLv[idx] += 1; SaveManager.writeData("INTENSIFYLV", this.intensifyLv); }
    public static setSignIsGet(): void { this.signisget = true; SaveManager.writeData("SIGNISGET", this.signisget); }
    public static getSkillLevel(): number[] { return this.skilllevel; }
    public static getRoamExp(): number { return this.roamexp; }
    public static addJewel(v: number): void { SaveManager.addData("JEWEL", v); }
    public static getShopCount(): number { return this.shopcount; }
    public static getOnlineIsGet(): number[] { return this.onlineisget; }
    public static setShopRefCount(reset?: boolean): void {
        if (reset === undefined)
            reset = false;
        if (reset)
            this.shopref = 4;
        else
            this.shopref -= 1;
        SaveManager.writeData("SHOPREF", this.shopref);
    }
    public static setSpeed(v: boolean): void { this.Speed = v; SaveManager.writeData("SPEED", this.Speed); }
    public static setSkillLevel(idx: number): void { this.skilllevel[idx] += 1; SaveManager.writeData("SKILLLEVEL", this.skilllevel); }
    public static getTeam(): any[] { return this.team; }
    public static setPos(v: number): void { this.pos = v; SaveManager.writeData("POS", this.pos); }
    public static setMaxTier(v: number): void { this.maxtier = v; SaveManager.writeData("MAXTIER", this.maxtier); }
    public static setLevel(v?: number): void {
        if (v)
            this.level = v;
        else
            this.level += 1;
        SaveManager.writeData("LEVEL", this.level);
        if (this.level > this.getMaxLevel())
            this.setMaxLevel(this.level);
        cc.systemEvent.emit(EventConst.Game_Guide);
    }
    public static getTier(): number { return this.tier; }
    public static setIntensiveCount(): void { this.intensivecount++; SaveManager.writeData("INTENSIVECOUNT", this.intensivecount); }
    public static getInviteNum(): number { return SaveManager.readInt("INVITE_NUM", 0); }
    public static getShopBoxTime(): number[] { return this.shopboxtime; }
    public static setReincarn(v: number): void { this.reincarn = v; this.setResume(); SaveManager.writeData("REINCARN", this.reincarn); }
    public static getisAddToDesktop(): boolean { return this.isAddToDesktop; }
    // ========== Getter / Setter ==========
    public static getDay(): number { return this.day; }
    public static getNowArtifacts(): number { return this.nowartifacts; }
    public static getMusic(): boolean { return this.music; }
    public static getSound(): boolean { return this.sound; }
    public static setDrugTime(v: number[]): void { this.drugtime = v; SaveManager.writeData("DRUGTIME", this.drugtime); }
    public static setTier(v: number): void { this.tier = v; SaveManager.writeData("TIER", this.tier); }
    public static getDrugBoxNum(): number[] { return this.drugboxnum; }
    public static getGold(): number { return SaveManager.readInt("GOLD", 0); }
    public static getDiceNum(): number { return this.dicenum; }
    public static setAutomatic(): void { this.automatic = !this.automatic; SaveManager.writeData("AUTOMATIC", this.automatic); }
    public static getRoamCount(): number { return this.roamcount; }
    public static setAward(v: number[]): void { this.award = v; SaveManager.writeData("AWARD", this.award); }
    /** 占位方法 */
    public static Plate(): void { }
    public static setRealmExp(v: number): void { this.realmexp += v; SaveManager.writeData("REALMEXP", this.realmexp); }
    public static getDiceTime(): number { return this.dicetime; }
    public static setPetLevel(idx: number, v: number): void { this.petlevel2[idx] = v; SaveManager.writeData("PETLEVEL2", this.petlevel2); }
    public static getDisciple(): any[] { return this.discipleLv; }
    public static getPetIndex(): number { return this.petIndex; }
    public static getShopRefCount(): number { return this.shopref; }
    public static getResume(): number { return this.resume; }
    public static setPack(v: any[]): void { this.pack = v; SaveManager.writeData("PACK", this.pack); }
    public static setShopBoxNum(v: number[]): void { this.shopboxnum = v; SaveManager.writeData("SHOPBOXNUM", this.shopboxnum); }
    public static setIsFristLoad(): void { SaveManager.writeData("ISFRISTLOAD", false); }
    public static setOnline(v: number): void { this.online = v; SaveManager.writeData("ONLINE", this.online); }
    public static getPos(): number { return this.pos; }
    /** 初始化弟子数据 */
    public static initDisciple(): any[] {
        const arr: any[] = [];
        for (let i = 0; i < 4; i++)
            arr.push({ level: 1, skill1: 1, skill2: 0, skill3: 0, unlock: false, state: false });
        return arr;
    }
    public static setRoamExp(v: number): void { this.roamexp += v; SaveManager.writeData("ROAMEXP", this.roamexp); }
    public static getMopUp(): number { return this.mopup; }
    public static getOnline(): number { return this.online; }
    public static setMusic(v: boolean): void { this.music = v; SaveManager.writeData("MUSIC", this.music); }
    public static setSound(v: boolean): void { this.sound = v; 
        // SaveManager.writeData("SOUND", this.sound); 
    }
    public static setGoodsItem(v: any): void { this.goodsitem = v; SaveManager.writeData("GOODSITEM", this.goodsitem); }
    public static getIntensiveCount(): number { return this.intensivecount; }
    public static getCoin(): number { return SaveManager.readInt("COIN", 0); }
    public static setNowArtifacts(v: number): void { this.nowartifacts = v; SaveManager.writeData("NOWARTIFACTS", this.nowartifacts); }
    public static getReincarn(): number { return this.reincarn; }
    public static getArtifactslist(): number[] { return this.artifactslist; }
    public static getResetCount(): number { return this.resetcount; }
    public static setaddColorSign(): void { this.isaddColorSign = true; SaveManager.writeData("ISADDCOLORSIGN", this.isaddColorSign); }
    public static setCustoms(v: number): void { this.customs = v; SaveManager.writeData("CUSTOMS", this.customs); cc.systemEvent.emit(EventConst.Game_Guide); }
    public static setResume(): void { this.resume += 1; SaveManager.writeData("RESUME", this.resume); }
    public static setPetExp(idx: number, v: number): void { this.petexp2[idx] += v; SaveManager.writeData("PETEXP2", this.petexp2); }
    public static getPetLevel(): number[] { return this.petlevel2; }
    public static setDrugBoxNum(v: number[]): void { this.drugboxnum = v; SaveManager.writeData("DRUGBOXNUM", this.drugboxnum); }
    public static setDrugOver(v: number[]): void { this.drugover = v; SaveManager.writeData("DRUGOVER", this.drugover); }
    public static getDrugCount(): number { return this.drugcount; }
    public static setPetIndex(v: number): void { this.petIndex = v; SaveManager.writeData("PETINDEX", this.petIndex); }
}
