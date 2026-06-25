import CoinIcon from "CoinIcon";
import SkillUI from "SkillUI";
import TreasureDataManager from "TreasureDataManager";
import CoinOutputDataManager from "CoinOutputDataManager";
import StoryTalkManager from "StoryTalkManager";
import CompanionDataManager from "CompanionDataManager";
import EquipDataManager from "EquipDataManager";
import HeroDataManager from "HeroDataManager";
import PetDataManager from "PetDataManager";
import PropDataManager from "PropDataManager";
import ReincarnationDataManager from "ReincarnationDataManager";
import SceneDataManager from "SceneDataManager";
import { SoundManager, Sound } from "SoundManager";
import TrialsDataManager from "TrialsDataManager";
import GameSystem from "GameSystem";
import { EventConst } from "EventConst";
import GameTools from "GameTools";
import PoolManager from "PoolManager";
import ChallengeLosePanel from "ChallengeLosePanel";
import FightText from "FightText";
import NewResultPanel from "NewResultPanel";
import PanelConst from "PanelConst";
import RewardPanel from "RewardPanel";
import TalkPanel from "TalkPanel";
import TipGroup from "TipGroup";
import UIManager from "UIManager";
import Artifacts from "Artifacts";
import GameFightSkill from "GameFightSkill";
import Monster from "Monster";
import IdleReward from "IdleReward";
import Teamer from "Teamer";
const { ccclass, property } = cc._decorator;
export enum FightState {
    ready = 0,
    fight = 1,
    challenge = 2,
    Trials = 3,
    roam = 4
}
@ccclass
export class GameFight extends cc.Component {
    startpos: any[] = [];
    teamData: any[] = [];
    monsterData: any[] = [];
    @property(cc.SpriteFrame)
    customsSp: any = [];
    reward: any[] = [];
    team: any[] = [];
    nowlevel: number = 1;
    allteamhp: number = 0;
    state: any = 1;
    maxwave: number = 1;
    TeamContent: any = null;
    startSp: any = null;
    allmonsterhp: number = 0;
    success: any = null;
    @property(cc.Prefab)
    roamboxitem: any = null;
    @property(cc.Node)
    outBtn: any = null;
    // Tips: any = null;
    // Guide: any = null;
    static instance: any = null;
    @property(cc.Prefab)
    Fireball: any = null;
    @property(cc.Prefab)
    star: any = null;
    @property(cc.Prefab)
    danMadicine: any = null;
    fightType: number = 0;
    @property(cc.Prefab)
    buttet: any = null;
    @property(cc.Prefab)
    MoonEffect: any = null;
    @property(cc.Prefab)
    FlameEffect: any = null;
    @property(cc.Prefab)
    monster: any = null;
    isStart: boolean = false;
    maxmonsterhp: number = 0;
    fail: any = null;
    tick: any = null;
    challengeBtn: any = null;
    @property(cc.Prefab)
    fighttxt: any = null;
    @property(cc.Label)
    TeamFight: any = null;
    @property(cc.Prefab)
    BaneMatrix: any = null;
    @property(cc.Node)
    banner: any = null;
    @property(cc.Label)
    Coin: any = null;
    MaxWave: any = null;
    // 运行时动态赋值字段（原反编译中通过 this.xxx = ... 创建，未在构造函数列出）
    tips: any = null;
    @property(cc.Prefab)
    rewardItem: any = null;
    @property(cc.Node)
    SkillUi: any = null;
    @property(cc.Label)
    challengelv: any = null;
    AllMonsterHp: any = null;
    @property(cc.Prefab)
    Knife: any = null;
    Mask: any = null;
    over: boolean = false;
    maxFightNum: number = 0;
    SceneData: any = null;
    LabelContent: any = null;
    Continuous: any = null;
    Up: any = null;
    RoamData: any = null;
    @property(cc.Prefab)
    ThunderEffect: any = null;
    Down: any = null;
    @property(cc.Prefab)
    spectrum: any = null;
    NowLevel: any = null;
    maxteamhp: number = 0;
    onhookMonster: any = null;
    @property(cc.Prefab)
    raiseditem: any = null;
    @property(cc.Prefab)
    Discipleitem: any = null;
    @property(cc.Node)
    customes: any = null;
    @property(cc.Prefab)
    wzlxHit: any = null;
    @property(cc.Prefab)
    Flamepalm: any = null;
    @property(cc.Prefab)
    packitem: any = null;
    blash: any = null;
    @property(cc.Node)
    challengebg: any = null;
    @property(cc.Prefab)
    StarEffect: any = null;
    challengelabel: any = null;
    MonsterContent: any = null;
    @property(cc.Label)
    MonsterFight: any = null;
    AllTeamHp: any = null;
    @property(cc.Sprite)
    artifacts: any = null;
    @property(cc.Prefab)
    SkillSp: any = null;
    @property(cc.Prefab)
    SkillLJ: any = null;
    fightContent: any = null;
    SkillContent: any = null;
    static FightState: any;
    @property(cc.Prefab)
    PersistentHeal: any = null;
    @property(cc.Prefab)
    HealingMatrix: any = null;
    @property(cc.Prefab)
    HeatHalo: any = null;
    time: number = 2;
    @property(cc.Prefab)
    equipitem: any = null;
    MessageContent: any = null;
    interval: number = 0.5;
    @property(cc.Prefab)
    Eddy: any = null;
    @property(cc.Prefab)
    WindEffect: any = null;
    @property(cc.Prefab)
    CoinIcon: any = null;
    playerNum: number = 0;
    @property(cc.Prefab)
    SkillHC: any = null;
    wave: number = 1;
    @property(cc.Prefab)
    SectText: any = null;
    async WinTrials(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        if (this.state === FightState.ready)
            return;
        if (this.wave < this.maxwave) {
            this.wave++;
            this.time = 0;
            this.OpenChallenge(false);
            return;
        }
        this.wave = 1;
        GameSystem.setCustoms(this.SceneData.level);
        await UIManager.Instance.ShowUI(PanelConst.RewardPanel);
        const t = TrialsDataManager.Instance.GetReward();
        UIManager.Instance.GetClass(PanelConst.RewardPanel).getComponent(RewardPanel).initAsset(t);
        let e = GameSystem.getMaxTier();
        e += 1;
        if (e >= TrialsDataManager.Instance.GetMaxTier())
            e = TrialsDataManager.Instance.GetMaxTier();
        GameSystem.setMaxTier(e);
        this.time = 0;
        this.state = FightState.ready;
        this.fightType = 0;
    }
    CreateStar() {
        const t = GameSystem.StarEffect.get();
        t.setParent(this.Up);
        return t;
    }
    ToKillMonster(t: any) {
        if (this.fightType === 0) {
            const e = this.SceneData.coin;
            GameSystem.addCoin(e);
            cc.systemEvent.emit(EventConst.Coin);
            const n = this.CreateCoinIcon();
            n.setParent(this.node);
            let a = t.node.getPosition();
            const o = t.node.parent.convertToWorldSpaceAR(a);
            a = this.node.parent.convertToNodeSpaceAR(o);
            // console.log("###a", a);
            n.setPosition(cc.v2(a.x, a.y + 20));
            n.getComponent(CoinIcon).init(e);
        }
    }
    onGameStart(): void {
        this.initStartpos();
        this.init();
        this.state = 0;
        this.isStart = true;
    }
    Createbuttet() {
        const t = GameSystem.buttet.get();
        t.setParent(this.Up);
        return t;
    }
    initTrialsMonster() {
        this.monsterData = [];
        this.allmonsterhp = 0;
        this.maxmonsterhp = 0;
        const t = TrialsDataManager.Instance.GetMonsterNum(this.wave);
        for (let e = 0; e < this.MonsterContent.childrenCount; e++) {
            if (e < t) {
                this.MonsterContent.children[e].active = true;
                let a: any;
                let o: any = null;
                if (TrialsDataManager.Instance.GetWave(this.wave) < 6) {
                    o = TrialsDataManager.Instance.GetMonsterRole(this.wave);
                }
                else {
                    a = TrialsDataManager.Instance.GetBossNum(1);
                    TrialsDataManager.Instance.GetBossNum(2);
                    if (e < a) {
                        o = TrialsDataManager.Instance.GetBossRole(1);
                        this.MonsterContent.scale = 1;
                    }
                    else {
                        o = TrialsDataManager.Instance.GetBossRole(2);
                        this.MonsterContent.scale = 1.5;
                    }
                }
                this.MonsterContent.children[e].getComponent(Monster).init(e, o, this.node.getComponent(GameFight));
                this.allmonsterhp += o.maxhp;
                this.maxmonsterhp = this.allmonsterhp;
                this.monsterData.push(this.MonsterContent.children[e].getComponent(Monster));
            }
            else {
                this.MonsterContent.children[e].active = false;
            }
        }
    }
    initSkill() {
        for (let t = 0; t < this.SkillContent.childrenCount; t++) {
            this.SkillContent.children[t].getComponent(GameFightSkill).init();
        }
    }
    async StartFight(t: boolean = true): Promise<void> {
        SoundManager.instance.playMusic(Sound.BGM1);
        this.HideFightBtn();
        this.initCustomes();
        GameSystem.doMove = true;
        this.over = false;
        this.Continuous.active = false;
        this.challengeBtn.active = true;
        this.outBtn.active = false;
        this.fightType = 0;
        this.state = FightState.fight;
        this.SceneData = await SceneDataManager.Instance.GetRole();
        this.maxwave = await SceneDataManager.Instance.GetMaxWave();
        if (t) {
            const a = this.GetTeam();
            for (let r = 0; r < a.length; r++)
                a[r].ChangeState(Teamer.STATE_DIE);
            const o = this.GetMonster();
            for (let r = 0; r < o.length; r++)
                o[r].ChangeState(Monster.STATE_DIE);
            await this.initTeam();
            await this.initArtifacts();
        }
        await this.initMonster();
        await this.initSkill();
        await this.initMessage();
        const i = this.GetMonster();
        for (let r = 0; r < i.length; r++)
            i[r].getComponent(Monster).Ready();
        this.artifacts.node.getComponent(Artifacts).Ready();
    }
    ClickTick() {
        SoundManager.instance.play(Sound.Click);
        GameSystem.tick = !GameSystem.tick;
        this.tick.active = GameSystem.tick;
    }
    async initYeldCoin(): Promise<void> {
        const t = await CoinOutputDataManager.Instance.GetOutPut();
        //this.Coin.string = "修炼效率:" + GameTools.refSetCoin(Math.floor(60 * t)) + "/分";
        this.Coin.string = GameTools.refSetCoin(Math.floor(60 * t)) + "/分";
    }
    CreatewzlxHit() {
        const t = GameSystem.wzlxHit.get();
        t.setParent(this.Up);
        return t;
    }
    async initArtifacts(): Promise<void> {
        const t = GameSystem.getNowArtifacts();
        if (GameSystem.getNowArtifacts() > 0) {
            this.artifacts.node.active = true;
            const e = "fight/Artifacts_xiao/fabao0" + t;
            let n: any = GameTools.GetRes("ResBundle1", e, cc.SpriteFrame);
            if (!n)
                n = await GameTools.loadImage("ResBundle1", e);
            this.artifacts.spriteFrame = n;
            this.artifacts.getComponent(Artifacts).init(this);
        }
        else {
            this.artifacts.node.active = false;
        }
    }
    ShowFightBtn() {
        this.SkillContent.active = true;
        this.fightContent.active = true;
        this.challengeBtn.active = false;
        this.banner.active = false;
        this.challengebg.active = true;
        IdleReward.instance.Automatic.node.active = true;
        // IdleReward.instance.Guide.active = false;
        // IdleReward.instance.Tips.active = false;
        this.tips.active = false;
        // this.Guide.active = false;
        // this.Tips.active = false;
        IdleReward.instance.guide.active = false;
        IdleReward.instance.tips.active = false;
    }
    async initTeam(t: boolean = true): Promise<void> {
        this.playerNum = 0;
        this.maxFightNum = 0;
        this.initUp();
        this.teamData = [];
        this.allteamhp = 0;
        this.maxteamhp = 0;
        for (let e = 0; e < this.team.length; e++) {
            if (this.team[e].id === -1) {
                this.TeamContent.children[e].active = false;
            }
            else {
                this.TeamContent.children[e].active = true;
                const n = this.TeamContent.children[e].getComponent(Teamer);
                let a: any = null;
                if (e === 0) {
                    a = HeroDataManager.Instance.GetRole();
                    this.maxFightNum += HeroDataManager.Instance.GetFightNum();
                }
                else if (e === 1) {
                    a = PetDataManager.Instance.GetRole();
                    this.maxFightNum += PetDataManager.Instance.GetFightNum();
                }
                else {
                    a = await CompanionDataManager.Instance.GetRole(this.team[e].id);
                    const prev = this.maxFightNum;
                    this.maxFightNum = prev + (await CompanionDataManager.Instance.GetFightNum(this.team[e].id));
                }
                this.allteamhp += a.maxhp;
                this.maxteamhp = this.allteamhp;
                if (e <= 1)
                    n.init(e, a, this);
                else
                    n.init(e, a, this, this.team[e].id);
                this.teamData.push(n);
            }
            if (t)
                this.TeamContent.children[e].setPosition(this.startpos[e]);
        }
    }
    async WinChallenge(): Promise<void> {
        if (this.over)
            return;
        const t = UIManager.Instance.GetPanelByType(PanelConst.GiveUpPanel);
        if (t)
            t.panelUI.CloseThis();
        this.over = true;
        if (this.state === FightState.ready)
            return;
        if (this.wave < this.maxwave) {
            this.wave++;
            this.time = 0;
            this.OpenChallenge(false);
            return;
        }
        this.wave = 1;
        const e = () => {
            GameTools.getSdk().sendEvent("finishMission", {
                message: "挑战成功",
                customes: this.SceneData.level.toString()
            });
            GameSystem.setCustoms(this.SceneData.level);
            if (this.SceneData.level < GameSystem.getMaxCustoms())
                console.log("轮回追赶状态，不修改最大关卡值");
            else
                GameSystem.setMaxCustoms(this.SceneData.level);
            this.reward.push(this.SceneData);
            this.GetReward();
            cc.systemEvent.emit(EventConst.Maps);
        };
        if (StoryTalkManager.Instance.isHaveTalk("end")) {
            await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
            UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).initCustoms(this.SceneData.level, "end", () => { e(); });
        }
        else {
            e();
        }
    }
    initUp() {
        this.team = [];
        this.team.push({ type: 0, id: 0 });
        this.team.push({ type: 1, id: PetDataManager.Instance.GetPetid() });
        for (let t = 0; t < 4; t++) {
            this.team.push({
                type: 2,
                id: GameSystem.getDisciple()[t].state ? t : -1,
            });
        }
    }
    initStartpos() {
        this.startpos = [];
        for (let t = 0; t < this.TeamContent.childrenCount; t++) {
            this.startpos.push(this.TeamContent.children[t].getPosition());
        }
    }
    CreateWind() {
        const t = GameSystem.WindEffect.get();
        t.setParent(this.Up);
        return t;
    }
    async initRoamMonster(): Promise<void> {
        this.monsterData = [];
        this.allmonsterhp = 0;
        this.maxmonsterhp = 0;
        const t = this.RoamData.monster_num + this.RoamData.boss_num;
        for (let e = 0; e < this.MonsterContent.childrenCount; e++) {
            if (e < t) {
                let a: any = null;
                if (e < this.RoamData.monster_num) {
                    a = await SceneDataManager.Instance.GetMonsterRole(this.wave);
                    a.name = this.RoamData.monster;
                    a.realm = this.MonsterRealm(0);
                    this.MonsterContent.children[e].getComponent(Monster).init(e, a, this.node.getComponent(GameFight));
                    this.allmonsterhp += a.maxhp;
                    this.maxmonsterhp = this.allmonsterhp;
                    this.MonsterContent.children[e].scale = 1;
                }
                else {
                    a = await SceneDataManager.Instance.RandomGetBoss();
                    a.name = this.RoamData.boss;
                    a.realm = this.MonsterRealm(1);
                    this.MonsterContent.children[e].getComponent(Monster).init(e, a, this.node.getComponent(GameFight));
                    this.allmonsterhp += a.maxhp;
                    this.maxmonsterhp = this.allmonsterhp;
                    this.MonsterContent.children[e].scale = 1.5;
                }
                this.monsterData.push(this.MonsterContent.children[e].getComponent(Monster));
            }
            else {
                this.MonsterContent.children[e].active = false;
            }
        }
    }
    CreateHothalo() {
        const t = GameSystem.HeatHalo.get();
        t.setParent(this.Down);
        return t;
    }
    CreateSkill(t: any) {
        const e = GameSystem.SkillSp.get();
        e.setParent(this.SkillUi);
        e.getComponent(SkillUI).init(t);
        return e;
    }
    CreateMoon() {
        const t = GameSystem.MoonEffect.get();
        t.setParent(this.Up);
        return t;
    }
    async init(): Promise<void> {
        this.time = 0;
        this.state = FightState.ready;
        this.SceneData = await SceneDataManager.Instance.GetRole();
        this.maxwave = await SceneDataManager.Instance.GetMaxWave();
        this.initMessage();
        this.initTeam();
        this.initMonster();
        this.initSkill();
    }
    ToStartpos() {
        this.playerNum++;
        const t = this.GetTeam().length;
        if (this.playerNum >= t) {
            this.playerNum = 0;
            if (this.fightType === 1)
                this.WinChallenge();
            else if (this.fightType === 2)
                this.WinTrials();
            else if (this.fightType === 3)
                this.WinRoam();
        }
    }
    CreateSkillHC() {
        const t = GameSystem.SkillHC.get();
        t.setParent(this.Down);
        return t;
    }
    async WinRoam(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        if (this.state === FightState.ready)
            return;
        if (this.wave < this.maxwave) {
            this.wave++;
            this.time = 0;
            this.OpenRoam(false);
            return;
        }
        this.wave = 1;
        this.time = 0;
        this.state = FightState.ready;
        this.fightType = 0;
        await UIManager.Instance.ShowUI(PanelConst.RoamPanel);
        this.success();
    }
    Activate() {
        for (let t = 0; t < this.teamData.length; t++)
            this.teamData[t].Ready();
    }
    CreatePersistCure() {
        const t = GameSystem.PersistentHeal.get();
        t.setParent(this.Up);
        return t;
    }
    async LoseRoam(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        for (let e = 0; e < this.monsterData.length; e++) {
            this.monsterData[e].ChangeState(Monster.STATE_WAIT);
            this.monsterData[e].node.active = false;
            this.monsterData[e].anger = 0;
        }
        const tTeam = this.GetTeam();
        for (let e = 0; e < tTeam.length; e++)
            tTeam[e].anger = 0;
        await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
        UIManager.Instance.GetClass(PanelConst.ChallengeLosePanel).getComponent(ChallengeLosePanel).addCallback(async () => {
            await UIManager.Instance.ShowUI(PanelConst.RoamPanel);
            this.fail();
        });
        if (this.state !== FightState.ready) {
            this.time = 0;
            this.wave = 1;
            this.state = FightState.ready;
            this.fightType = 0;
        }
    }
    ChangeAllHp(t: number, e: number) {
        if (t === 0)
            this.allteamhp += e;
        else
            this.allmonsterhp += e;
        this.initMessage();
    }
    OnHooKCallback() {
        this.playerNum++;
        const t = this.GetTeam().length;
        if (this.playerNum >= t) {
            this.playerNum = 0;
            this.Win();
        }
    }
    CreateFlamepalm() {
        const t = GameSystem.Flamepalm.get();
        t.setParent(this.Up);
        return t;
    }
    GetTeam(): any[] {
        const t: any[] = [];
        for (let e = 0; e < this.teamData.length; e++) {
            if (!this.teamData[e].isDie())
                t.push(this.teamData[e]);
        }
        return t;
    }
    CreateEddy() {
        const t = GameSystem.Eddy.get();
        t.setParent(this.Down);
        t.EquipDataManager = 320;
        return t;
    }
    CreateCoinIcon() {
        return GameSystem.CoinIcon.get();
    }
    async initMessage(): Promise<void> {
        this.AllTeamHp.fillRange = this.allteamhp / this.maxteamhp;
        this.AllMonsterHp.fillRange = this.allmonsterhp / this.maxmonsterhp;
        this.MaxWave.node.active = this.fightType !== 0;
        if (this.fightType === 2) {
            const eTrial = TrialsDataManager.Instance.GetRole();
            this.MonsterFight.string = "怪物总战力:" + GameTools.refSetCoin(Math.floor(0.8 * eTrial.maxfight));
            this.TeamFight.string = "我方总战力:" + GameTools.refSetCoin(Math.floor(this.maxFightNum));
            this.MaxWave.string = "波次: " + this.wave + "/" + this.maxwave;
            this.NowLevel.string = "试炼挑战" + GameSystem.getMaxTier() + "层";
        }
        else {
            this.MonsterFight.string = "怪物总战力:" + GameTools.refSetCoin(Math.floor(0.8 * this.SceneData.fightnum));
            this.TeamFight.string = "我方总战力:" + GameTools.refSetCoin(Math.floor(this.maxFightNum));
            this.MaxWave.string = "波次: " + this.wave + "/" + this.maxwave;
            const tRole = await SceneDataManager.Instance.GetRole();
            this.NowLevel.string = tRole.name + "-" + tRole.level2;
        }
        const nCha = await SceneDataManager.Instance.GetRole(GameSystem.getCustoms() + 1);
        this.challengelabel.string = nCha.name + "-" + nCha.level2;
    }
    async OpenTrials(t: boolean = true): Promise<void> {
        SoundManager.instance.playMusic(Sound.BGM3);
        for (let e = 0; e < this.teamData.length; e++)
            this.teamData[e].node.stopAllActions();
        this.over = false;
        this.fightType = 2;
        this.Continuous.active = false;
        this.state = FightState.Trials;
        this.maxwave = TrialsDataManager.Instance.GetMaxWave();
        if (t) {
            this.ClearUpAndDown();
            await this.initTeam();
            await this.initArtifacts();
        }
        this.initSkill();
        await this.initMessage();
        this.initMask(async () => {
            this.ShowFightBtn();
            this.initTrialsMonster();
            const tMon = this.GetMonster();
            for (let n = 0; n < tMon.length; n++)
                tMon[n].getComponent(Monster).Ready();
            const eTeam = this.GetTeam();
            for (let n = 0; n < eTeam.length; n++)
                eTeam[n].getComponent(Teamer).Ready();
            this.artifacts.node.getComponent(Artifacts).Ready();
        });
    }
    ClickChallenge() {
        SoundManager.instance.play(Sound.Click);
        this.nowlevel = GameSystem.getCustoms() + 1;
        if (this.state === FightState.fight || this.state === FightState.ready) {
            this.OpenChallenge();
            this.challengeBtn.active = false;
        }
        else if (this.state === FightState.challenge) {
            TipGroup.instance.setText(-1, "当前正在挑战中");
        }
        else if (this.state === FightState.Trials) {
            TipGroup.instance.setText(-1, "当前正在进行试炼");
        }
        IdleReward.instance.HideCompelGuideSp();
    }
    ClearUpAndDown() {
        this.Down.destroyAllChildren();
        this.Up.destroyAllChildren();
    }
    CreateFireBall() {
        const t = GameSystem.Fireball.get();
        t.setParent(this.Up);
        return t;
    }
    start() {
        cc.systemEvent.on(EventConst.Game_Fight_changeHp, this.ChangeAllHp, this);
        cc.systemEvent.on(EventConst.Coin, this.initYeldCoin, this);
        cc.systemEvent.on(EventConst.Jewel, this.initYeldCoin, this);
    }
    initMask(t: () => void) {
        cc.systemEvent.emit(EventConst.Maps);
        this.startSp.node.active = true;
        this.startSp.setAnimation(0, "start", false);
        setTimeout(() => { t(); }, 500);
    }
    onLoad() {
        GameFight.instance = this;
        this.TeamContent = this.node.getChildByName("CanMove").getChildByName("Team");
        this.LabelContent = this.node.getChildByName("CanMove").getChildByName("LabelContent");
        this.MonsterContent = this.node.getChildByName("CanMove").getChildByName("Monster");
        this.SkillContent = this.node.getChildByName("CanMove").getChildByName("SkillContent");
        this.MessageContent = this.node.getChildByName("Message");
        this.fightContent = this.MessageContent.getChildByName("Content");
        this.AllTeamHp = this.fightContent.getChildByName("TeamHp").getChildByName("hp").getComponent(cc.Sprite);
        this.AllMonsterHp = this.fightContent.getChildByName("MonsterHp").getChildByName("hp").getComponent(cc.Sprite);
        this.NowLevel = this.MessageContent.getChildByName("level").getComponent(cc.Label);
        this.MaxWave = this.fightContent.getChildByName("wave").getComponent(cc.Label);
        //this.MonsterFight = this.fightContent.getChildByName("fightmax").getComponent(cc.Label);
        this.tips = this.MessageContent.getChildByName("tips");
        // let onHook = this.node.getChildByName("IdleReward")
        // this.Tips = onHook.getChildByName("Tips");
        // this.Guide = onHook.getChildByName("Guide");
        this.Continuous = this.fightContent.getChildByName("AutomaticChallenge");
        this.tick = this.Continuous.getChildByName("circle").getChildByName("tick");
        this.Down = this.node.getChildByName("CanMove").getChildByName("down");
        this.Up = this.node.getChildByName("CanMove").getChildByName("up");
        this.Mask = this.node.getChildByName("CanMove").getChildByName("mask");
        this.challengelabel = this.node.getChildByName("CanMove").getChildByName("challenge").getChildByName("level").getComponent(cc.Label);
        this.challengeBtn = this.node.getChildByName("CanMove").getChildByName("challenge");
        this.onhookMonster = this.node.getChildByName("CanMove").getChildByName("onhookMonster");
        this.startSp = this.node.getChildByName("CanMove").getChildByName("startSp").getComponent(sp.Skeleton);
        this.blash = this.node.getChildByName("CanMove").getChildByName("blash").getComponent(sp.Skeleton);
        GameSystem.fightTxt = new PoolManager(this.fighttxt, 20, 0);
        GameSystem.buttet = new PoolManager(this.buttet, 30, 0);
        GameSystem.ThunderEffect = new PoolManager(this.ThunderEffect, 30, 0);
        GameSystem.Eddy = new PoolManager(this.Eddy, 30, 0);
        GameSystem.StarEffect = new PoolManager(this.StarEffect, 30, 0);
        GameSystem.star = new PoolManager(this.star, 5, 0);
        GameSystem.Knife = new PoolManager(this.Knife, 30, 0);
        GameSystem.HealingMatrix = new PoolManager(this.HealingMatrix, 10, 0);
        GameSystem.WindEffect = new PoolManager(this.WindEffect, 10, 0);
        GameSystem.BaneMatrix = new PoolManager(this.BaneMatrix, 10, 0);
        GameSystem.disciple = new PoolManager(this.Discipleitem, 20, 0);
        GameSystem.MoonEffect = new PoolManager(this.MoonEffect, 10, 0);
        GameSystem.FlameEffect = new PoolManager(this.FlameEffect, 10, 0);
        GameSystem.Flamepalm = new PoolManager(this.Flamepalm, 10, 0);
        GameSystem.PersistentHeal = new PoolManager(this.PersistentHeal, 10, 0);
        GameSystem.CoinIcon = new PoolManager(this.CoinIcon, 10, 0);
        GameSystem.rewardItem = new PoolManager(this.rewardItem, 10, 0);
        GameSystem.packitem = new PoolManager(this.packitem, 50, 0);
        GameSystem.SectText = new PoolManager(this.SectText, 50, 0);
        GameSystem.equipitem = new PoolManager(this.equipitem, 100, 0);
        GameSystem.spectrum = new PoolManager(this.spectrum, 30, 0);
        GameSystem.raiseditem = new PoolManager(this.raiseditem, 30, 0);
        GameSystem.roamboxitem = new PoolManager(this.roamboxitem, 50, 0);
        GameSystem.GuideMonster = new PoolManager(this.monster, 50, 0);
        GameSystem.Fireball = new PoolManager(this.Fireball, 20, 0);
        GameSystem.danMadicine = new PoolManager(this.danMadicine, 20, 0);
        GameSystem.HeatHalo = new PoolManager(this.HeatHalo, 10, 0);
        GameSystem.SkillLJ = new PoolManager(this.SkillLJ, 5, 0);
        GameSystem.SkillHC = new PoolManager(this.SkillHC, 5, 0);
        GameSystem.SkillSp = new PoolManager(this.SkillSp, 10, 0);
        GameSystem.wzlxHit = new PoolManager(this.wzlxHit, 20, 0);
        cc.systemEvent.on(EventConst.GameStart, this.onGameStart, this);
    }
    async LoseTrials(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        for (let e = 0; e < this.monsterData.length; e++) {
            this.monsterData[e].ChangeState(Monster.STATE_WAIT);
            this.monsterData[e].node.active = false;
            this.monsterData[e].anger = 0;
        }
        const tTeam = this.GetTeam();
        for (let e = 0; e < tTeam.length; e++)
            tTeam[e].anger = 0;
        await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
        this.time = 0;
        this.initToOnHook();
    }
    CreateBaneMatrix() {
        const t = GameSystem.BaneMatrix.get();
        t.setParent(this.Down);
        return t;
    }
    CreateCureMatrix() {
        const t = GameSystem.HealingMatrix.get();
        t.setParent(this.Down);
        t.EquipDataManager = 320;
        return t;
    }
    async initMonster(): Promise<void> {
        this.monsterData = [];
        this.allmonsterhp = 0;
        this.maxmonsterhp = 0;
        let t = 0;
        if (this.fightType === 1) {
            t = await SceneDataManager.Instance.GetMonsterNum(this.wave, GameSystem.getCustoms() + 1);
        }
        else {
            t = 2 * (await SceneDataManager.Instance.GetMonsterNum(this.wave));
            if (t >= 6)
                t = 6;
        }
        Math.floor(t / 2);
        for (let e = 0; e < this.MonsterContent.childrenCount; e++) {
            if (e < t) {
                this.MonsterContent.children[e].active = true;
                if (SceneDataManager.Instance.GetWave(this.wave) < 6) {
                    let i: any = null;
                    if (this.fightType === 1) {
                        i = await SceneDataManager.Instance.GetMonsterRole(this.wave, GameSystem.getCustoms() + 1);
                    }
                    else {
                        i = await SceneDataManager.Instance.GetMonsterRole(this.wave);
                    }
                    const a = Math.random();
                    i.atkType = a < 0.5 ? "近战" : "远程";
                    i.range = a < 0.5 ? 200 : 400;
                    i.realm = this.MonsterRealm(0);
                    this.MonsterContent.children[e].getComponent(Monster).init(e, i, this.node.getComponent(GameFight));
                    this.allmonsterhp += i.maxhp;
                    this.maxmonsterhp = this.allmonsterhp;
                    this.MonsterContent.children[e].scale = 1;
                }
                else {
                    let o = 0;
                    if (this.fightType === 1) {
                        o = await SceneDataManager.Instance.GetBossNum(1, GameSystem.getCustoms() + 1);
                        await SceneDataManager.Instance.GetBossNum(2, GameSystem.getCustoms() + 1);
                    }
                    else {
                        o = await SceneDataManager.Instance.GetBossNum(1);
                        await SceneDataManager.Instance.GetBossNum(2);
                    }
                    let i: any = null;
                    if (this.fightType === 1) {
                        if (e < o) {
                            i = await SceneDataManager.Instance.GetBossRole(1, GameSystem.getCustoms() + 1);
                        }
                        else {
                            i = await SceneDataManager.Instance.GetBossRole(2, GameSystem.getCustoms() + 1);
                        }
                    }
                    else {
                        if (e < o) {
                            i = await SceneDataManager.Instance.GetBossRole(1);
                        }
                        else {
                            i = await SceneDataManager.Instance.GetBossRole(2);
                        }
                    }
                    i.realm = this.MonsterRealm(1);
                    this.MonsterContent.children[e].getComponent(Monster).init(e, i, this.node.getComponent(GameFight));
                    this.allmonsterhp += i.maxhp;
                    this.maxmonsterhp = this.allmonsterhp;
                    this.MonsterContent.children[e].scale = 1.5;
                }
                this.monsterData.push(this.MonsterContent.children[e].getComponent(Monster));
            }
            else {
                this.MonsterContent.children[e].active = false;
            }
        }
    }
    MonsterRealm(t: number) {
        const e = CompanionDataManager.Instance.GetMaxLv();
        let n = t === 0 ? e - 2 : e + 3;
        if (n <= 1)
            n = 1;
        if (n >= 200)
            n = 200;
        return HeroDataManager.Instance.GetRealm(n);
    }
    HideFightBtn() {
        this.SkillContent.active = false;
        this.fightContent.active = false;
        this.challengeBtn.active = true;
        this.banner.active = true;
        this.challengebg.active = false;
        IdleReward.instance.Automatic.node.active = false;
        this.tips.active = true;
        // IdleReward.instance.Guide.active = true;
        // IdleReward.instance.Tips.active = true;
        // this.Guide.active = true;
        // this.Tips.active = true;
        IdleReward.instance.guide.active = true;
        IdleReward.instance.tips.active = true;
    }
    async Win(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        if (this.state !== FightState.ready) {
            if (this.wave < this.maxwave) {
                this.wave++;
                this.time = 0;
                this.StartFight();
            }
            else {
                this.time = 0;
                this.wave = 1;
                this.state = FightState.ready;
                this.fightType = 0;
            }
        }
    }
    async OpenFight(): Promise<void> {
        SoundManager.instance.playMusic(Sound.BGM1);
        this.fightType = 0;
        this.state = FightState.fight;
        this.SceneData = await SceneDataManager.Instance.GetRole();
        this.maxwave = await SceneDataManager.Instance.GetMaxWave();
        await this.initTeam(false);
        await this.initArtifacts();
        await this.initOnhookMonster();
        await this.initSkill();
        await this.initMessage();
        const n = this.GetTeam();
        for (let a = 0; a < n.length; a++)
            n[a].getComponent(Teamer).Ready();
        this.artifacts.node.getComponent(Artifacts).Ready();
        this.over = false;
    }
    update(t: number) {
        if (this.isStart) {
            this.MonsterFight.node.active = this.fightType !== 0;
            if (this.state !== FightState.challenge && this.state !== FightState.Trials) {
                if (this.time < this.interval)
                    this.time += t * GameSystem.speed;
                if (this.time >= this.interval && this.state === FightState.ready) {
                    this.time = this.interval;
                    switch (this.fightType) {
                        case 0:
                            this.StartFight();
                            break;
                        case 1:
                            this.OpenChallenge();
                            break;
                        case 2:
                            this.OpenTrials();
                            break;
                    }
                }
            }
        }
    }
    CreateFlame() {
        const t = GameSystem.FlameEffect.get();
        t.setParent(this.Up);
        return t;
    }
    CreateKnife() {
        const t = GameSystem.Knife.get();
        t.setParent(this.Up);
        return t;
    }
    async Lose(): Promise<void> {
        if (this.over)
            return;
        const t = UIManager.Instance.GetPanelByType(PanelConst.GiveUpPanel);
        if (t)
            t.panelUI.CloseThis();
        this.over = true;
        for (let n = 0; n < this.monsterData.length; n++) {
            this.monsterData[n].ChangeState(Monster.STATE_WAIT);
            this.monsterData[n].node.active = false;
            this.monsterData[n].anger = 0;
        }
        const eTeam = this.GetTeam();
        for (let n = 0; n < eTeam.length; n++)
            eTeam[n].anger = 0;
        await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
        if (this.state !== FightState.ready) {
            this.time = 0;
            this.wave = 1;
            this.state = FightState.ready;
            this.fightType = 0;
        }
    }
    setText(t: any, e: any, n: any) {
        const a = GameSystem.fightTxt.get();
        a.setParent(this.LabelContent);
        a.getComponent(FightText).setText(t, e, n);
    }
    async Showbalance(): Promise<void> {
        await UIManager.Instance.ShowUI(PanelConst.NEWRESULT_PANEL);
        UIManager.Instance.GetClass(PanelConst.NEWRESULT_PANEL).getComponent(NewResultPanel).init(this.reward, (e: any) => {
            this.reward = [];
            if (e) {
                this.time = 0;
                this.state = FightState.ready;
                this.fightType = 0;
                this.challengeBtn.active = true;
                this.outBtn.active = false;
                this.ClickChallenge();
            }
            else {
                this.time = 0;
                this.state = FightState.ready;
                this.fightType = 0;
                this.challengeBtn.active = true;
                this.outBtn.active = false;
            }
        });
    }
    initToOnHook() {
        if (this.state !== FightState.ready) {
            this.time = 0;
            this.wave = 1;
            this.state = FightState.ready;
            this.fightType = 0;
        }
    }
    initBlash() { }
    async ClickMaps(): Promise<void> {
        SoundManager.instance.play(Sound.Click);
        await UIManager.Instance.ShowUI(PanelConst.MapsPanel);
    }
    CreatorMonster() {
        const t = GameSystem.monster.get();
        t.setParent(this.onhookMonster);
        return t;
    }
    GetMonster(): any[] {
        const t: any[] = [];
        for (let e = 0; e < this.monsterData.length; e++) {
            if (!this.monsterData[e].isDie())
                t.push(this.monsterData[e]);
        }
        return t;
    }
    async OpenRoam(t: boolean = true): Promise<void> {
        SoundManager.instance.playMusic(Sound.BGM3);
        for (let a = 0; a < this.teamData.length; a++)
            this.teamData[a].node.stopAllActions();
        this.over = false;
        this.fightType = 3;
        this.Continuous.active = false;
        const eTeam0 = this.GetTeam();
        for (let a = 0; a < eTeam0.length; a++)
            eTeam0[a].ChangeState(Teamer.STATE_DIE);
        const nMon0 = this.GetMonster();
        for (let a = 0; a < nMon0.length; a++)
            nMon0[a].ChangeState(Monster.STATE_DIE);
        this.SceneData = await SceneDataManager.Instance.GetRole();
        this.maxwave = 1;
        if (t) {
            this.ClearUpAndDown();
            await this.initTeam();
            await this.initArtifacts();
        }
        await this.initMonster();
        await this.initSkill();
        await this.initMessage();
        this.initMask(async () => {
            this.ShowFightBtn();
            await this.initRoamMonster();
            const tMon = this.GetMonster();
            for (let n = 0; n < tMon.length; n++)
                tMon[n].getComponent(Monster).Ready();
            const eTeam = this.GetTeam();
            for (let n = 0; n < eTeam.length; n++)
                eTeam[n].getComponent(Teamer).Ready();
            this.artifacts.node.getComponent(Artifacts).Ready();
        });
    }
    async GetReward(): Promise<void> {
        const t = this.SceneData;
        const e: any[] = [];
        let n: any;
        if (t.rewardCoin > 0) {
            n = PropDataManager.Instance.GetCoinProp();
            e.push({ prop: n, have: t.rewardCoin });
        }
        if (t.rewardgoods1num > 0) {
            n = PropDataManager.Instance.GetProp(t.rewardgoods1);
            e.push({ prop: n, have: t.rewardgoods1num });
        }
        if (t.rewardgoods2num > 0) {
            n = PropDataManager.Instance.GetProp(t.rewardgoods2);
            e.push({ prop: n, have: t.rewardgoods2num });
        }
        if (t.rewardgoods3num > 0) {
            n = PropDataManager.Instance.GetProp(t.rewardgoods3);
            e.push({ prop: n, have: t.rewardgoods3num });
        }
        for (let a = 0; a < e.length; a++) {
            let o: any;
            if (e[a].prop.type === 4) {
                o = ReincarnationDataManager.Instance.GetAddOutput() * e[a].have;
                UIManager.Instance.AddCoin(o);
            }
            else if (e[a].prop.type === 5) {
                o = TreasureDataManager.Instance.GetOutPut() * e[a].have;
                UIManager.Instance.GetJewel(o);
            }
            else {
                PropDataManager.Instance.addPack([e[a]]);
                EquipDataManager.Instance.AddNewEquip(e[a]);
            }
        }
        UIManager.Instance.ShowUI(PanelConst.ShowNewEquip);
        if (this.SceneData.level < GameSystem.getMaxCustoms() && GameSystem.tick) {
            this.time = 0;
            this.state = FightState.ready;
            this.fightType = 1;
        }
        else {
            this.Showbalance();
        }
    }
    ClickOut() {
        SoundManager.instance.play(Sound.Click);
        UIManager.Instance.ShowUI(PanelConst.GiveUpPanel);
    }
    async OpenChallenge(t: boolean = true): Promise<void> {
        SoundManager.instance.playMusic(Sound.BGM3);
        this.initCustomes();
        GameSystem.doMove = false;
        this.fightType = 1;
        this.state = FightState.challenge;
        for (let e = 0; e < this.teamData.length; e++)
            this.teamData[e].node.stopAllActions();
        const doInit = async (): Promise<void> => {
            this.ShowFightBtn();
            const eTeam = this.GetTeam();
            for (let a = 0; a < eTeam.length; a++)
                eTeam[a].ChangeState(Teamer.STATE_DIE);
            const nMon = this.GetMonster();
            for (let a = 0; a < nMon.length; a++)
                nMon[a].ChangeState(Monster.STATE_DIE);
            this.SceneData = await SceneDataManager.Instance.GetRole(GameSystem.getCustoms() + 1);
            this.maxwave = await SceneDataManager.Instance.GetMaxWave(GameSystem.getCustoms() + 1);
            if (t) {
                GameTools.getSdk().sendEvent("challengeMisson", {
                    message: "挑战关卡",
                    customes: (GameSystem.getCustoms() + 1).toString()
                });
                this.ClearUpAndDown();
                this.wave = 1;
                await this.initTeam();
                await this.initArtifacts();
            }
            await this.initMonster();
            this.initSkill();
            await this.initMessage();
            if (this.SceneData.level <= GameSystem.getMaxCustoms()) {
                this.Continuous.active = true;
                this.tick.active = GameSystem.tick;
            }
            else {
                this.Continuous.active = false;
            }
        };
        const doStart = async (): Promise<void> => {
            if (t) {
                this.startSp.node.active = true;
                this.startSp.setAnimation(0, "start", false);
                this.playChallengelv();
                this.startSp.setCompleteListener(async () => {
                    this.startSp.node.active = false;
                    this.over = false;
                    this.outBtn.active = true;
                    const tMon = this.GetMonster();
                    for (let n = 0; n < tMon.length; n++)
                        tMon[n].getComponent(Monster).Ready();
                    const eTeam = this.GetTeam();
                    for (let n = 0; n < eTeam.length; n++)
                        eTeam[n].getComponent(Teamer).Ready();
                    this.artifacts.node.getComponent(Artifacts).Ready();
                });
            }
            else {
                this.startSp.node.active = true;
                this.startSp.setAnimation(0, "start", false);
                this.startSp.setCompleteListener(async () => {
                    this.startSp.node.active = false;
                    this.over = false;
                    const tMon = this.GetMonster();
                    for (let n = 0; n < tMon.length; n++)
                        tMon[n].getComponent(Monster).Ready();
                    const eTeam = this.GetTeam();
                    for (let n = 0; n < eTeam.length; n++)
                        eTeam[n].getComponent(Teamer).Ready();
                    this.artifacts.node.getComponent(Artifacts).Ready();
                });
            }
        };
        if (t) {
            this.blash.node.active = true;
            this.blash.setAnimation(0, "in", false);
            this.blash.setEventListener((t2: any, e2: any) => {
                if (e2.data.name === "stop")
                    doInit();
            });
            this.blash.setCompleteListener(async () => {
                if (StoryTalkManager.Instance.isHaveTalk("start")) {
                    await UIManager.Instance.ShowUI(PanelConst.TalkPanel);
                    UIManager.Instance.GetClass(PanelConst.TalkPanel).getComponent(TalkPanel).initCustoms(GameSystem.getCustoms() + 1, "start", () => { doStart(); });
                }
                else {
                    doStart();
                }
                this.blash.node.active = false;
            });
        }
        else {
            doInit();
            doStart();
        }
    }
    async initOnhookMonster(): Promise<void> {
        this.monsterData = [];
        this.allmonsterhp = 0;
        this.maxmonsterhp = 0;
        const t = Math.floor(5 * Math.random()) + 1;
        const e = cc.v2(0, 0);
        for (let a = 0; a < t; a++) {
            const o = this.CreatorMonster();
            const i: any = await SceneDataManager.Instance.GetMonsterRole(this.wave);
            o.getComponent(Monster).init(a, i, this.node.getComponent(GameFight));
            this.allmonsterhp += i.maxhp;
            this.maxmonsterhp = this.allmonsterhp;
            this.monsterData.push(o.getComponent(Monster));
            switch (Math.floor(3 * Math.random())) {
                case 0:
                    e.x = 750 * Math.random() - 375;
                    e.y = -150;
                    break;
                case 1:
                    e.x = 750 * Math.random() - 375;
                    e.y = -750;
                    break;
                case 2:
                    e.x = 500;
                    e.y = 950 * Math.random() - 200;
                    break;
            }
            o.setPosition(e);
            o.getComponent(Monster).Ready();
        }
        this.time = 0;
        this.wave = 1;
        this.state = FightState.ready;
        this.fightType = 0;
    }
    RoamFight(t: any, e: any, n: any) {
        this.RoamData = t;
        this.success = e;
        this.fail = n;
        this.OpenRoam();
    }
    playChallengelv() {
        const t = this.challengelv.node.parent;
        t.active = true;
        t.opacity = 0;
        this.challengelv.string = this.SceneData.name + "-" + this.SceneData.level2;
        cc.tween(t).delay(0.5).to(0.3, { opacity: 255 }).delay(0.5).to(0.3, { opacity: 0 }).call(() => {
            t.active = false;
        }).start();
    }
    CreateSkillLJ() {
        const t = GameSystem.SkillLJ.get();
        t.setParent(this.Down);
        return t;
    }
    CreateThunder() {
        return GameSystem.ThunderEffect.get();
    }
    async LoseChallenge(): Promise<void> {
        if (this.over)
            return;
        this.over = true;
        for (let e = 0; e < this.monsterData.length; e++) {
            this.monsterData[e].ChangeState(Monster.STATE_WAIT);
            this.monsterData[e].node.active = false;
            this.monsterData[e].anger = 0;
        }
        const tTeam = this.GetTeam();
        for (let e = 0; e < tTeam.length; e++)
            tTeam[e].anger = 0;
        if (this.SceneData.level < GameSystem.getMaxCustoms()) {
            if (GameSystem.tick) {
                GameSystem.tick = false;
                if (this.reward.length > 0) {
                    this.Showbalance();
                }
                else {
                    await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
                    this.initToOnHook();
                }
            }
            else {
                await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
                this.initToOnHook();
            }
        }
        else {
            await UIManager.Instance.ShowUI(PanelConst.ChallengeLosePanel);
            this.initToOnHook();
        }
    }
    async initCustomes(): Promise<void> {
        GameSystem.getCustoms();
        const t = [0, 0, 0, 0, 0];
        let e = 0;
        const n: any = await SceneDataManager.Instance.GetNowPlace();
        let a = 0;
        const o: any = await SceneDataManager.Instance.GetRole();
        a = o.level2;
        e = a <= 3 ? a - 1 : (n.length - a >= 2 ? 2 : 4 - (n.length - a));
        for (let r = 0; r < 5; r++) {
            const i = r - e;
            t[r] = a + i;
        }
        for (let r = 0; r < this.customes.childrenCount; r++) {
            const lb = this.customes.children[r].getComponent(cc.Sprite);
            this.customes.children[r].getChildByName("level").getComponent(cc.Label).string = "" + t[r];
            if (t[r] === a) {
                lb.spriteFrame = this.customsSp[0];
            }
            else {
                const cFlag = n[t[r] - 1].boss1_num > 0;
                lb.spriteFrame = cFlag ? this.customsSp[2] : this.customsSp[1];
            }
        }
    }
    RemoveTeamer(t: any) {
        for (let e = 0; e < this.teamData.length; e++) {
            if (this.teamData[e] === t.id)
                this.teamData.splice(e);
        }
    }
}
