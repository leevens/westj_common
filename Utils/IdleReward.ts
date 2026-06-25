import CoinOutputDataManager from "CoinOutputDataManager";
import HeartDevilDataManager from "HeartDevilDataManager";
import HeroDataManager from "HeroDataManager";
import { SoundManager, Sound } from "SoundManager";
import SystemDataManager from "SystemDataManager";
import GameSystem from "GameSystem";
import { EventConst } from "EventConst";
import GameTools from "GameTools";
import PoolManager from "PoolManager";
import OutputCoin from "OutputCoin";
import PanelConst from "PanelConst";
import TipGroup from "TipGroup";
import UIManager from "UIManager";
import UnlockSys from "UnlockSys";
import { GameFight, FightState } from "GameFight";
import TalkPanel from "TalkPanel";
import StoryTalkManager from "StoryTalkManager";
/**
 * IdleReward - 挂机主界面
 * 管理游戏主界面的各个功能按钮和状态显示
 * 包含角色属性、境界、装备、法器、灵宠等功能入口
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class IdleReward extends cc.Component {
    /** 预制体数组 */
    @property(cc.Prefab)
    prefabs: any[] = [];
    /** 精灵帧数组 */
    @property(cc.SpriteFrame)
    sprite: any[] = [];
    /** 录像精灵帧数组 */
    @property(cc.SpriteFrame)
    RecorderSp: any[] = [];
    /** 转世按钮 */
    reincarnBtn: any = null;
    BreakSoundHandle = -1;
    /** 任务按钮 */
    taskBtn: any = null;
    trialsBtn: any = null;
    /** 进度值 */
    pro: number = 0;
    /** 自动战斗精灵 */
    Automatic: any = null;
    shopBtn: any = null;
    Talk3TestId = 1;
    /** 法器组件 */
    Artifacts: any = null;
    /** 心魔动画组件 */
    @property(sp.Skeleton)
    DevilSp: sp.Skeleton = null;
    /** 速度精灵 */
    SpeedSprite: any = null;
    /** 战斗力标签 */
    FightLabel: any = null;
    BreakStartTime = 0;
    @property(cc.Sprite)
    breakCdPro: any = null;
    roamBtn: any = null;
    /** 境界精灵节点 */
    @property(cc.Node)
    RealmSp: any = null;
    /** 引导精灵节点 */
    @property(cc.Node)
    guideSp: any = null;
    @property(cc.Node)
    breakParticle: cc.Node = null;
    /** 中间层节点 */
    @property(cc.Node)
    interlayer: any = null;
    /** 下一关节点 */
    Next: any = null;
    /** 法器按钮 */
    artifactsBtn: any = null;
    /** 炼丹按钮 */
    alchemyBtn: any = null;
    /** 境界标签 */
    Realm: any = null;
    /** 添加到桌面按钮 */
    @property(cc.Node)
    addToDesktop: any = null;
    /** 灵宠按钮 */
    petBtn: any = null;
    /** 升级动画组件 */
    UpSp: any = null;
    /** 突破组件 */
    @property(sp.Skeleton)
    Break: sp.Skeleton = null;
    // Guide: any = null;
    static instance: any = null;
    @property(cc.Node)
    BreakOutCoin: cc.Node = null;
    /**
     * 初始化可视化形象
     */
    oldVisualize: string = "";
    /** 录像按钮 */
    @property(cc.Sprite)
    SaveManager: any = null;
    sectBtn: any = null;
    /** 攻击力标签 */
    AtkLabel: any = null;
    Talk1TestId = 1;
    /** 可视化形象组件 */
    Visualize: any = null;
    Talk2TestId = 1;
    /** 进度值2 */
    pro2: number = 0;
    @property(cc.Node)
    devtools: cc.Node = null;
    /** 灵石进度条 */
    CoinProgress: any = null;
    /** 下一关进度条 */
    Nextprogress: any = null;
    /** 下一级需求标签 */
    Nextneed: any = null;
    /** 弟子按钮 */
    discipleBtn: any = null;
    packBtn: any = null;
    /** 遮罩节点 */
    @property(cc.Node)
    mask: any = null;
    /** 强制按钮 */
    @property(cc.Node)
    compel: any = null;
    breakState: number = -1;
    /** 强化按钮 */
    intensifyBtn: any = null;
    /** 时间 */
    _time: number = 3;
    /** 引导节点 */
    @property(cc.Node)
    guide: any = null;
    /** 提示节点 */
    Tips: any = null;
    weaponBtn: any = null;
    /** 产出灵石位置 */
    OutputCoinpos: any = null;
    /** 内容容器 */
    Content: any = null;
    // 运行时在 onLoad 中动态赋值
    /** 生命值标签 */
    HpLabel: any = null;
    /** 提示节点 */
    @property(cc.Node)
    tips: any = null;
    /** 遮罩 */
    Mask: any = null;
    /** 速度标签 */
    SpeedLabel: any = null;
    @property(cc.Node)
    BreakDujie: cc.Node = null;
    BreakCdTween: any = null;
    ChangeJewel(t: any) {
        GameSystem.addJewel(t);
        cc.systemEvent.emit(EventConst.Jewel);
    }
    async ClickSign(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.SignPanel);
    }
    async MetaTestTalk1() {
        await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
        UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).init(this.Talk1TestId++, () => { });
    }
    async ClickBreak(): Promise<void> {
        if (GameSystem.doBreak)
            return;
        GameSystem.doBreak = true;
        SoundManager.instance.play(Sound.Click);
        if (!CoinOutputDataManager.Instance.IsCanBreak()) {
            TipGroup.instance.setText(-1, "灵气不足");
            GameSystem.doBreak = false;
            return;
        }
        if (CoinOutputDataManager.Instance.BreakOrDisaster() == 0) {
            // 正常突破
            let useQuick = false;
            if (GameSystem.getLevel() < GameSystem.getMaxLevel()) {
                useQuick = (await CoinOutputDataManager.Instance.IsCanQuick()) > 1;
            }
            if (useQuick) {
                this.Break.setAnimation(0, "kuasutupo_chenggong", false);
                this.UpSp.setAnimation(0, "lvup2", false);
                this.UpSp.setCompleteListener(() => {
                    if (this.UpSp.animation == "lvup2")
                        this.QuickBreakSuccess();
                });
            }
            else {
                const t = CoinOutputDataManager.Instance.GetNeedCoin();
                UIManager.Instance.ChangeCoin(-t);
                this.Break.setAnimation(0, "tupochenggong", false);
                this.UpSp.setAnimation(0, "lvup", false);
                this.UpSp.setCompleteListener(() => {
                    if (this.UpSp.animation == "lvup")
                        this.BreakSuccess();
                });
            }
        }
        else {
            // 天劫
            if (GameSystem.getLevel() < 30) {
                GameSystem.disater = 100;
                const t = CoinOutputDataManager.Instance.GetNeedCoin();
                UIManager.Instance.ChangeCoin(-t);
                await UIManager.Instance.ShowUI(PanelConst.DisasterPanel);
            }
            else {
                UIManager.Instance.ShowUI(PanelConst.AscensionEffect);
            }
            GameSystem.doBreak = false;
        }
        IdleReward.instance.HideCompelGuideSp();
    }
    async ClickBreakDujie(): Promise<void> {
        if (CoinOutputDataManager.Instance.BreakOrDisaster() != 0) {
            // 天劫
            if (GameSystem.getLevel() < 30) {
                GameSystem.disater = 100;
                const t = CoinOutputDataManager.Instance.GetNeedCoin();
                UIManager.Instance.ChangeCoin(-t);
                await UIManager.Instance.ShowUI(PanelConst.DisasterPanel);
            }
            else {
                UIManager.Instance.ShowUI(PanelConst.AscensionEffect);
            }
            GameSystem.doBreak = false;
        }
    }
    initNextNeed() {
        this.Nextprogress.fillRange = GameSystem.getCoin() / CoinOutputDataManager.Instance.GetNeedCoin();
        this.Nextneed.string = GameTools.refSetCoin(GameSystem.getCoin()) + "/" + GameTools.refSetCoin(CoinOutputDataManager.Instance.GetNeedCoin());
    }
    /**
     * 游戏开始时初始化
     */
    onGameStart() {
        this.ShowCompelGuideSp();
        this.interlayer.active = true;
        this.mask.active = false;
        this.initVisualize();
        this.initArtifacts();
        this.initRealm();
        this.initRole();
        this.initBreak();
        this.initNextNeed();
        this.initButton();
        this.initTips();
        this.initAutomatic();
        this.initFightSpeed();
        // this.ShowGuideSp(22);
    }
    async ClickShowFreeJewel(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.FreeJewel);
    }
    async ClickShowFreeCoin(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.FreeCoin);
    }
    ClickAddToDesktop() {
        UIManager.Instance.ShowUI(PanelConst.SaveToDesktop);
    }
    async ClickShowFreeGold(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.FreeGold);
    }
    async ClickBreakCoinOut(): Promise<void> {
        if (!CoinOutputDataManager.Instance.IsCanBreak()) {
            TipGroup.instance.setText(-1, "灵气不足");
            UIManager.Instance.ShowUI(PanelConst.FreeCoin);
            GameSystem.doBreak = false;
            return;
        }
    }
    /**
     * 初始化自动战斗状态
     */
    initAutomatic() {
        this.Automatic.spriteFrame = GameSystem.getAutomatic() ? this.sprite[2] : this.sprite[3];
    }
    async ClickAlchemy(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(5)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(5));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.ALCHEMY_PANEL);
    }
    async ClickTask(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(7)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(7));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.TASK_PANEL);
    }
    ClickRecorder() {
        if (GameSystem.isdorecorder)
            GameTools.getSdk().recorderstop();
        else
            GameTools.getSdk().recorderstart();
    }
    async MetaTestTalk3() {
        await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
        const nextId = StoryTalkManager.Instance.GetGroupTalkNextId(this.Talk3TestId);
        if (nextId == 0)
            return;
        this.Talk3TestId = nextId;
        UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).initCustoms(nextId, "start", () => { });
    }
    MetaPlayChapter() {
        // playPlace
        // cc.systemEvent.emit(EventConst.playChapter, {id:823,chapter:"测试章节"});
        cc.systemEvent.emit(EventConst.playPlace);
    }
    async MetaTestTalk4() {
        await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
        UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).initCustoms(this.Talk3TestId, "end", () => { });
    }
    /**
     * 初始化按钮状态
     */
    initButton() {
        this.packBtn.active = true;
        this.discipleBtn.active = SystemDataManager.Instance.isUnlockSys(2);
        this.petBtn.active = SystemDataManager.Instance.isUnlockSys(4);
        this.alchemyBtn.active = SystemDataManager.Instance.isUnlockSys(5);
        this.taskBtn.active = SystemDataManager.Instance.isUnlockSys(7);
        this.artifactsBtn.active = SystemDataManager.Instance.isUnlockSys(11);
        this.weaponBtn.active = SystemDataManager.Instance.isUnlockSys(9);
        this.shopBtn.active = SystemDataManager.Instance.isUnlockSys(13);
        this.intensifyBtn.active = SystemDataManager.Instance.isUnlockSys(15);
        this.reincarnBtn.active = SystemDataManager.Instance.isUnlockSys(16);
        this.sectBtn.active = SystemDataManager.Instance.isUnlockSys(14);
        this.trialsBtn.active = SystemDataManager.Instance.isUnlockSys(17);
        this.roamBtn.active = SystemDataManager.Instance.isUnlockSys(10);
    }
    async initBreak(): Promise<void> {
        let newbreakState = await this.calBreakState();
        if (this.breakState == newbreakState)
            return;
        this.breakState = newbreakState;
        if (newbreakState == 0) {
            this.BreakOutCoin.active = false;
            this.Break.node.active = false;
            this.BreakDujie.active = false;
            this.DevilSp.node.active = false;
            return;
        }
        if (newbreakState == 1) {
            this.BreakOutCoin.active = true;
            this.Break.node.active = false;
            this.BreakDujie.active = false;
            this.DevilSp.node.active = false;
            return;
        }
        // 需要驱魔
        if (newbreakState == 2) {
            this.DevilSp.node.active = true;
            this.Break.node.active = false;
            this.BreakDujie.active = false;
            this.BreakOutCoin.active = false;
            if (this.DevilSp.animation != "qumo") {
                this.DevilSp.setAnimation(0, "qumo", true);
            }
            return;
        }
        // 检查是否需要渡动
        if (newbreakState == 3) {
            this.BreakDujie.active = true;
            this.Break.node.active = false;
            this.BreakOutCoin.active = false;
            this.DevilSp.node.active = false;
            return;
        }
        this.Break.node.active = true;
        this.BreakDujie.active = false;
        this.BreakOutCoin.active = false;
        this.DevilSp.node.active = false;
        if (newbreakState == 4) {
            this.Break.setAnimation(0, "kuaisutupo", true);
            return;
        }
        else if (newbreakState == 5) {
            this.Break.setAnimation(0, "tupo", true);
            return;
        }
    }
    async MetaTestAddCustomerLevel() {
        GameSystem.setCustoms(GameSystem.getCustoms() + 1);
        GameSystem.setMaxCustoms(GameSystem.getMaxCustoms() + 1);
    }
    HideCompelGuideSp() {
        this.compel.active = false;
    }
    async MetaTestAddLevel() {
        this.BreakSuccess();
    }
    async ClickPet(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(4)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(4));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.PET_PANEL);
    }
    start() {
        cc.systemEvent.on(EventConst.Coin, this.initNextNeed, this);
        cc.systemEvent.on(EventConst.initTips, this.initTips, this);
        cc.systemEvent.on("push_msg", (message) => {
            // console.log("###push_msg",message);
            TipGroup.instance.setText(-1, message.data.msg);
            // if( message.type == "push_msg" )
            // {
            //     this.initRole();
            // }
        });
    }
    // async RetryConnect(target) {
    //     console.log("ReconnectBtn",target);
    //    await GameTools.getSdk().reconnect();
    // }
    ClickAutomaticSkill() {
        SoundManager.instance.play(Sound.Click);
        if (SystemDataManager.Instance.isUnlockSys(3)) {
            GameSystem.setAutomatic();
            this.Automatic.spriteFrame = GameSystem.automatic ? this.sprite[2] : this.sprite[3];
        }
        else {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(3));
        }
    }
    async initVisualize(): Promise<void> {
        // const t = 1 // GameSystem.getSex();
        const e = GameSystem.getLevel();
        const n = Math.floor((e - 1) / 10);
        const a = HeroDataManager.Instance.GetVisualizeArray(n);
        // // 修改为使用预制体加载
        const o = `player1/renwu${a}`;
        if (o == this.oldVisualize) {
            return;
        }
        this.oldVisualize = o;
        // if( this.Visualize.node.children.length > 0) {
        //     //this.Visualize.node.children[0].remove();
        //     // return;
        // }
        let prefab: cc.Prefab | null = GameTools.GetRes("Bundle", o, cc.Prefab);
        if (prefab == null) {
            prefab = await GameTools.LoadAny("Bundle", o, cc.Prefab);
        }
        // console.log("###initVisualize", o, prefab);
        if (prefab) {
            this.Visualize.node.removeAllChildren();
            const node = cc.instantiate(prefab) as cc.Node;
            node.setPosition(cc.Vec2.ZERO as any);
            node.setParent(this.Visualize.node);
        }
    }
    MetaGetAssect() {
        this.ChangeCoin(1e10);
        this.ChangeJewel(1e10);
        this.ChangeGold(1000);
    }
    /**
     * 初始化境界显示
     */
    initRealm() {
        this.Realm.string = CoinOutputDataManager.Instance.GetRealm();
    }
    ClickChangeSpeed() {
        SoundManager.instance.play(Sound.Click);
        if (SystemDataManager.Instance.isUnlockSys(6)) {
            if (GameSystem.getSpeed())
                GameSystem.setSpeed(false);
            else
                GameSystem.setSpeed(true);
            this.initFightSpeed();
        }
        else {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(6));
        }
    }
    /**
     * 产出灵石
     * @returns 产出的灵石数量
     */
    async OutputCoin(): Promise<number> {
        if (this.Mask.active)
            return;
        const t = 3 * await CoinOutputDataManager.Instance.GetOutPut();
        this.CreatOutputTxt(t);
        this.ChangeCoin(t);
        return t;
    }
    /**
     * 改变灵石数量
     * @param t 灵石变化量
     */
    ChangeCoin(t: any) {
        GameSystem.addCoin(t);
        this.initNextNeed();
        cc.systemEvent.emit(EventConst.Coin);
    }
    async MetaTestTalk2() {
        await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
        UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).initTeach(this.Talk2TestId++, () => { });
    }
    async ClickOnline(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.OnlinePanel);
    }
    /**
     * 创建灵石产出文本
     * @param t 灵石数量
     */
    CreatOutputTxt(t: any) {
        const e = GameSystem.OutputCoin.get();
        e.setParent(this.OutputCoinpos);
        e.getComponent(OutputCoin).init(t);
    }
    async ClickShop(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(13)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(13));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.ShopPanel);
    }
    async ClickEquip(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(9)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(9));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.EquipPanel);
    }
    async ClickOptions(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.OptionsPanel);
    }
    update(t: number) {
        if (GameSystem.isFirstLoad)
            return;
        this.pro += t;
        this.pro2 = this._time == 3 ? this.pro / 3 : this.pro / 1;
        this.CoinProgress.fillRange = this.pro2;
        if (this.pro2 >= 1) {
            this.pro = t;
            this.OutputCoin();
        }
    }
    ShowGuideSp(type: number) {
        let e: any = null;

        const n = e.parent.convertToWorldSpaceAR(e.getPosition());
        const a = this.guideSp.parent.convertToNodeSpaceAR(n);
        this.guideSp.setPosition(a);
        this.guideSp.active = true;
    }
    /**
     * 初始化UI节点引用
     */
    onLoad() {
        IdleReward.instance = this;
        this.Content = this.node.getChildByName("Content");
        // this.Guide = this.node.getChildByName("Guide").getChildByName("Guide");
        this.Realm = this.RealmSp.getChildByName("Realm").getComponent(cc.Label);
        this.OutputCoinpos = this.Content.getChildByName("OutputCoinpos");
        this.Visualize = this.Content.getChildByName("Visualize").getComponent(sp.Skeleton);
        this.Artifacts = this.Content.getChildByName("Artifacts").getComponent(sp.Skeleton);
        this.CoinProgress = this.Content.getChildByName("CoinProgress").getChildByName("progress").getComponent(cc.Sprite);
        this.HpLabel = this.Content.getChildByName("Hp");
        this.AtkLabel = this.Content.getChildByName("Atk");
        this.FightLabel = this.Content.getChildByName("Fight");
        this.SpeedLabel = this.Content.getChildByName("Speed");
        //this.Break = this.Content.getChildByName("Break").getComponent(sp.Skeleton);
        this.Next = this.Content.getChildByName("Next");
        this.Nextprogress = this.Next.getChildByName("progress").getComponent(cc.Sprite);
        this.Nextneed = this.Next.getChildByName("need").getComponent(cc.Label);
        this.SpeedSprite = this.Content.getChildByName("Up").getChildByName("Speed").getComponent(cc.Sprite);
        this.Automatic = this.Content.getChildByName("Up").getChildByName("Automatic").getComponent(cc.Sprite);
        this.Mask = this.node.getChildByName("mask");
        this.UpSp = this.Content.getChildByName("UpSp").getComponent(sp.Skeleton);
        this.Tips = this.Content.getChildByName("Tips");
        this.discipleBtn = this.Content.getChildByName("Left").getChildByName("discipleBtn");
        this.petBtn = this.Content.getChildByName("Left").getChildByName("petBtn");
        this.artifactsBtn = this.Content.getChildByName("Left").getChildByName("artifactsBtn");
        this.intensifyBtn = this.Content.getChildByName("Left").getChildByName("intensifyBtn");
        this.reincarnBtn = this.Content.getChildByName("Left").getChildByName("reincarnBtn");
        this.taskBtn = this.Content.getChildByName("Right").getChildByName("taskBtn");
        this.alchemyBtn = this.Content.getChildByName("Right").getChildByName("alchemyBtn");
        this.weaponBtn = this.Content.getChildByName("Right").getChildByName("weaponBtn");
        this.packBtn = this.Content.getChildByName("Right").getChildByName("packBtn");
        this.shopBtn = this.Content.getChildByName("Right").getChildByName("shopBtn");
        this.sectBtn = this.Content.getChildByName("Down").getChildByName("sectBtn");
        this.roamBtn = this.Content.getChildByName("Down").getChildByName("roamBtn");
        this.trialsBtn = this.Content.getChildByName("Down").getChildByName("trialsBtn");
        this.initPrefabs();
        this.mask.active = true;
        this.SaveManager.node.active = "TT" == GameSystem.channel;
        this.addToDesktop.active = GameTools.getSdk().isHaveAddToDesktop();
        cc.systemEvent.on(EventConst.GameStart, this.onGameStart, this);
        cc.systemEvent.on(EventConst.Coin, () => {
            this.initBreak();
        }, this);
        cc.systemEvent.on(EventConst.SaveManager, this.initRecorder, this);
        if (CC_DEV) {
            this.devtools.active = true;
        }
        else {
            this.devtools.active = false;
        }
        const breakps = this.breakParticle.getComponent(cc.ParticleSystem);
        const psliftVar = breakps.lifeVar;
        const pslift = breakps.life;
        const total = breakps.totalParticles;
        // const psRotatePers = breakps.rotatePerS;
        // let juqiSound = -1;
        this.Break.node.on(cc.Node.EventType.TOUCH_START, () => {
            // console.log("###breakParticle touch start");
            //breakps.speed = 1000;
            breakps.lifeVar = 0.5;
            breakps.life = 0.5;
            breakps.totalParticles = 2000;
            breakps.startSize = 200;
            this.BreakSoundHandle = SoundManager.instance.play(Sound.JuqiStart, false);
            // if( juqiSound != -1)
            // {
            //     SoundManager.instance.stop(juqiSound);
            // }
            this.BreakStartTime = Date.now();
            this.breakCdPro.node.parent.active = true;
            this.breakCdPro.fillRange = 0;
            if (this.BreakCdTween)
                this.BreakCdTween.stop();
            this.BreakCdTween = cc.tween(this.breakCdPro)
                .to(1, { fillRange: 1 })
                .start();
        }, this);
        this.Break.node.on(cc.Node.EventType.TOUCH_END, () => {
            // console.log("###breakParticle touch end");
            breakps.lifeVar = psliftVar;
            breakps.life = pslift;
            breakps.totalParticles = total;
            breakps.startSize = 10;
            // breakps.rotatePerS = psrotatePers;
            breakps.resetSystem();
            SoundManager.instance.stop(this.BreakSoundHandle);
            this.BreakSoundHandle = -1;
            this.BreakCdTween.stop();
            // console.log("###ClickBreak");
            let usetime = Date.now() - this.BreakStartTime;
            this.BreakStartTime = 0;
            SoundManager.instance.stop(this.BreakSoundHandle);
            this.BreakSoundHandle = -1;
            if (usetime < 1000) {
                TipGroup.instance.setText(-1, "蓄力不足");
                this.BreakCdTween = cc.tween(this.breakCdPro)
                    .to(2, { fillRange: 0 })
                    .start();
                return;
            }
            this.ClickBreak();
            this.breakCdPro.node.parent.active = false;
        }, this);
        this.Break.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            // console.log("###breakParticle touch cancel");
            breakps.lifeVar = psliftVar;
            breakps.life = pslift;
            breakps.startSize = 10;
            breakps.totalParticles = total;
            // breakps.rotatePerS = psrotatePers;
            breakps.resetSystem();
            SoundManager.instance.stop(this.BreakSoundHandle);
            this.BreakSoundHandle = -1;
            this.BreakCdTween.stop();
            this.BreakCdTween = cc.tween(this.breakCdPro)
                .to(2, { fillRange: 0 })
                .start();
        }, this);
    }
    async ClickRole(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.MESSAGE_PANEL);
    }
    async ClickSect(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(14)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(14));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.Sect);
    }
    ShowCompelGuideSp() {
        this.compel.active = true;
    }
    async ClickRealm(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.REALM_PANEL);
    }
    /**
     * 初始化法器显示
     */
    async initArtifacts(): Promise<void> {
        if (GameSystem.getMaxArtifacts() <= 0) {
            this.Artifacts.node.active = false;
            return;
        }
        this.Artifacts.node.active = true;
        const t = GameSystem.getNowArtifacts();
        const e = "Spines/Artifacts/fabao" + t + "/fabao" + t;
        let n: any = GameTools.GetRes("Bundle", e, sp.SkeletonData);
        if (!n)
            n = await GameTools.LoadSpinData("Bundle", e);
        this.Artifacts.skeletonData = n;
        const a = "fabao" + t;
        this.Artifacts.setAnimation(0, a, true);
    }
    async ClickPack(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.PACK_PANEL);
    }
    initRecorder() {
        this.SaveManager.spriteFrame = GameSystem.isdorecorder ? this.RecorderSp[1] : this.RecorderSp[0];
    }
    async ShowUnlockSys(t: any): Promise<void> {
        await UIManager.Instance.ShowUI(PanelConst.UnlockSys);
        UIManager.Instance.GetClass(PanelConst.UnlockSys).node.getComponent(UnlockSys).init(t);
    }
    /**
     * 初始化战斗速度状态
     */
    initFightSpeed() {
        if (GameSystem.getSpeed()) {
            this.SpeedSprite.spriteFrame = this.sprite[1];
            GameSystem.speed = 1.3;
        }
        else {
            this.SpeedSprite.spriteFrame = this.sprite[0];
            GameSystem.speed = 1;
        }
    }
    initRole() {
        const t = HeroDataManager.Instance.GetBasicRole();
        const e = HeroDataManager.Instance.GetRole();
        const n = HeroDataManager.Instance.GetFightNum();
        HeroDataManager.Instance.GetBasiFight();
        this.AtkLabel.getChildByName("atk").getComponent(cc.Label).string = GameTools.refSetCoin(Math.floor(t.atk));
        this.AtkLabel.getChildByName("add").getComponent(cc.Label).string = "+" + GameTools.refSetCoin(Math.floor(e.atk - t.atk));
        this.HpLabel.getChildByName("hp").getComponent(cc.Label).string = GameTools.refSetCoin(Math.floor(t.hp));
        this.HpLabel.getChildByName("add").getComponent(cc.Label).string = "+" + GameTools.refSetCoin(Math.floor(e.hp - t.hp));
        this.SpeedLabel.getChildByName("speed").getComponent(cc.Label).string = GameTools.refSetCoin(Math.floor(t.interval));
        this.SpeedLabel.getChildByName("add").getComponent(cc.Label).string = "+" + GameTools.refSetCoin(Math.floor(e.interval - t.interval));
        this.FightLabel.getChildByName("fight").getComponent(cc.Label).string = GameTools.refSetCoin(Math.floor(n));
    }
    async calBreakState(): Promise<number> {
        if (GameSystem.getMaxCustoms() < 3 || GameSystem.getLevel() >= 200) {
            //  console.log("### GameSystem.getLevel() ",GameSystem.getLevel())
            return 0;
        }
        let canBreak = CoinOutputDataManager.Instance.IsCanBreak();
        if (!canBreak) {
            return 1;
        }
        // 需要驱魔
        if (HeartDevilDataManager.Instance.isHaveDevil() && GameSystem.getDevil() > 0) {
            return 2;
        }
        // 检查是否需要渡动
        if (CoinOutputDataManager.Instance.BreakOrDisaster() == 1) {
            return 3;
        }
        if (GameSystem.getLevel() < GameSystem.getMaxLevel()) {
            if (await CoinOutputDataManager.Instance.IsCanQuick() > 1) {
                return 4;
            }
        }
        return 5;
    }
    /**
     * 初始化预制体对象池
     */
    initPrefabs() {
        GameSystem.OutputCoin = new PoolManager(this.prefabs[0], 10, 0);
    }
    async BreakSuccess(): Promise<void> {
        const t = await HeroDataManager.Instance.GetMaxFight();
        SoundManager.instance.play(Sound.PlayUp);
        GameSystem.doBreak = false;
        this.breakState = 0;
        GameSystem.setLevel();
        const e = await HeartDevilDataManager.Instance.isHaveDevil();
        if (e)
            GameSystem.setDevil(e);
        this.initVisualize();
        this.initRealm();
        this.initRole();
        this.MaxFightChange(t);
        this.initRealmAnimation();
        this.initBreak();
        GameTools.getSdk().sendEvent("heroLevel", { message: "主角等级", level: GameSystem.getLevel().toString() });
        GameTools.getSdk().sendEvent("heroLevelup", { message: "主角突破" });
    }
    async MaxFightChange(t: any): Promise<void> {
        const e = await HeroDataManager.Instance.GetMaxFight();
        if (t > e || t < e)
            TipGroup.instance.setFightNum(t, e);
    }
    async ClickTrials(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(17)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(17));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.TrialsPanel);
    }
    async ClickRoam(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(10)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(10));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.RoamPanel);
    }
    async ClickDisciple(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(2)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(2));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.DISCIPLE_PANEL);
    }
    async ClickReincarn(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(16)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(16));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.ReincarnationPanel);
    }
    initRealmAnimation() {
        this.Realm.node.stopAllActions();
        this.Realm.node.scale = 3;
        cc.tween(this.Realm.node).to(0.3, { scale: 1 }, { easing: "quadOut" }).start();
    }
    ClickDevil() {
        UIManager.Instance.ShowUI(PanelConst.DevilPanel);
    }
    async ClickArtifacts(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(11)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(11));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.ARTIFACTS);
    }
    MetaCleanData() {
        GameSystem._clearGameData();
    }
    async ClickIntensify(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        if (!SystemDataManager.Instance.isUnlockSys(15)) {
            TipGroup.instance.setText(-1, SystemDataManager.Instance.CanUnlock(15));
            return;
        }
        await UIManager.Instance.ShowUI(PanelConst.INTENSIFY_PANEL);
    }
    ChangeGold(t: any) {
        GameSystem.addGold(t);
        cc.systemEvent.emit(EventConst.Gold);
    }
    DispelDevil() {
        if (GameSystem.doBreak)
            return;
        GameSystem.doBreak = true;
        GameSystem.doBreak = false;
        this.DevilSp.setAnimation(0, "qumo_chenggong", true);
        this.DevilSp.setCompleteListener(() => {
            // this.DevilSp.node.active = false;
            this.initBreak();
        });
    }
    /**
     * 初始化提示信息
     */
    initTips() {
        const t = SystemDataManager.Instance.GetNextUnlock();
        if (t) {
            this.Tips.active = true;
            const e = t.level - GameSystem.getMaxCustoms();
            this.Tips.getChildByName("info").getComponent(cc.Label).string = "还差" + e + "关" + t.info;
        }
        else {
            this.Tips.active = false;
        }
    }
    async QuickBreakSuccess(): Promise<void> {
        const t = await HeroDataManager.Instance.GetMaxFight();
        const e = await CoinOutputDataManager.Instance.IsCanQuick();
        let n = true;
        let a = 0;
        do {
            const o = GameSystem.getCoin();
            const i = CoinOutputDataManager.Instance.GetNeedCoin();
            if (o >= i) {
                this.ChangeCoin(-i);
                GameSystem.setLevel();
                a++;
            }
            else {
                n = false;
            }
            if (a >= e)
                n = false;
        } while (n);
        GameSystem.doBreak = false;
        this.breakState = 0;
        SoundManager.instance.play(Sound.PlayUp);
        const r = await HeartDevilDataManager.Instance.isHaveDevil();
        if (r)
            GameSystem.setDevil(r);
        this.initRealmAnimation();
        this.initVisualize();
        this.initRealm();
        this.initRole();
        this.initBreak();
        this.MaxFightChange(t);
        GameTools.getSdk().sendEvent("heroLevel", { message: "主角等级", level: GameSystem.getLevel().toString() });
        GameTools.getSdk().sendEvent("heroLevelup", { message: "主角突破" });
    }
}
