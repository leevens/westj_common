/**
 * GuideAI - 引导（教程）AI控制器
 * 继承自AIBase，用于游戏教程中的角色控制
 */
import AIBase from "AIBase";
import SkillConst from "SkillConst";
import Teamer from "Teamer";
import CultivationDataManager from "CultivationDataManager";
import TeamSkillDataManager from "TeamSkillDataManager";
import GameTools from "GameTools";
import TipGroup from "TipGroup";
import GuideAttackState from "GuideAttackState";
import GuideDieState from "GuideDieState";
import GuideIdleState from "GuideIdleState";
import GuideMoveState from "GuideMoveState";
import GuideSkillState from "GuideSkillState";
import GuideVertigoState from "GuideVertigoState";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideAI extends AIBase {
    /** 技能冷却数组 */
    public SkillArray: number[] = [0, 0, 0];
    /** 怒气值 */
    public angre: number = 0;
    /** 技能状态 */
    public static STATE_SKILL: number = 5;
    /** 名称标签 */
    public Name!: cc.Label;
    /** 近程攻击特效骨骼 */
    @property(sp.Skeleton)
    public nearSp: sp.Skeleton = null;
    /** 眩晕持续时间 */
    public Vertigo: number = 0;
    /** 眩晕状态 */
    public static STATE_Vertigo: number = 4;
    /** 入场动画骨骼 */
    @property(sp.Skeleton)
    public Sp: sp.Skeleton | null = null;
    /** 计时器 */
    public time: number = 0;
    /** 技能冷却时间 */
    public SkillCd: number = 10;
    /** 移动速度 */
    public moveSpeed: number = 200;
    /** 当前目标 */
    public target: any = null;
    // 状态常量
    /** 空闲状态 */
    public static STATE_IDLE: number = 0;
    // 缓存的子节点引用（在onLoad中设置）
    /** 内容节点 */
    public Content!: cc.Node;
    /** 技能类型 */
    public skilltype: number = 0;
    /** 技能释放时间 */
    public releaseTime: number = 0.5;
    /** 攻击状态 */
    public static STATE_ATTACK: number = 2;
    /** 索引 */
    public index: number = 0;
    /** 境界标签 */
    public Realm!: cc.Label;
    /** 骨骼节点 */
    public Spine!: cc.Node;
    /** 死亡状态 */
    public static STATE_DIE: number = 3;
    /** 光标节点 */
    public Cursor!: cc.Node;
    /** 当前技能冷却 */
    public skillcd: number = 0;
    /** 蓝条精灵 */
    public MpSp!: cc.Sprite;
    /** 骨骼内容节点 */
    // public SpineContent!: cc.Node;
    /** 头像精灵 */
    public HeadSp!: cc.Sprite;
    /** 技能特效骨骼 */
    @property(sp.Skeleton)
    public doSp: sp.Skeleton = null;
    /** 冷却进度精灵 */
    public CdSp!: cc.Sprite;
    /** 血条精灵 */
    public HpSp!: cc.Sprite;
    /** 当前面板引用 */
    public curpannel: any = null;
    /** 角色数据 */
    public role: any = null;
    /** 移动状态 */
    public static STATE_MOVE: number = 1;
    /** 回调函数 */
    public callback: any = null;
    // 死亡/伤害处理
    /** 判断是否死亡 */
    public isDie(): boolean {
        return !(this.node.active && this.role.hp > 0);
    }
    protected start(): void { }
    /** 获取当前血量 */
    public GetHp(): number {
        return (this.node.active && this.role.hp > 0) ? this.role.hp : 0;
    }
    /**
     * 消耗怒气
     * @param amount 消耗数量
     */
    public SubMp(amount: number): void {
        this.angre -= amount;
        this.RefreshMp();
    }
    // 分身技能 - id==2的特殊死亡技能
    /** 释放分身技能（id==2专属） */
    public DoFS(): void {
        GameTools.getSdk().sendEvent("guide", { index: "2-1" });
        this.ChangeStateToSkill();
        this.skilltype = 1;
        this.callback = () => {
            this.curpannel.setText(7, "分身", this.node);
            setTimeout(() => {
                this.role.hp = 0;
                this.ToDie();
                this.callback = null;
            }, 800);
        };
    }
    // 状态转换
    /** 准备战斗，切换到移动状态 */
    public Ready(): void {
        this.ChangeState(GuideAI.STATE_MOVE);
    }
    // 帧更新
    /**
     * 帧更新
     * @param dt 时间增量
     */
    protected update(dt: number): void {
        super.update(dt);
        if (this.curStateId != 999999 && this.curStateId != GuideAI.STATE_DIE) {
            this.time += dt;
            if (this.time >= 1) {
                this.time = 0;
                this.oneTime();
            }
        }
    }
    // 减益/治疗
    /** 眩晕控制 */
    public Constraint(): void {
        this.Vertigo = 3;
        this.ChangeState(GuideAI.STATE_Vertigo);
    }
    /** 执行死亡 */
    public ToDie(): void {
        if (4 == this.role.id) {
            this.curpannel.setText(99, "", this.node);
        }
        else {
            this.curpannel.setText(8, "", this.node);
        }
        this.node.active = false;
        this.ChangeState(Teamer.STATE_DIE);
    }
    /**
     * 治疗恢复
     * @param amount 恢复量
     */
    public Cure(amount: number): void {
        if (this.role.hp <= 0)
            return;
        this.role.hp += amount;
        if (this.role.hp >= this.role.maxhp)
            this.role.hp = this.role.maxhp;
        this.curpannel.setText(2, "恢复+" + GameTools.refSetCoin(amount), this.node);
        this.RefreshHp();
    }
    // 引导技能：五庄灵墟
    /** 释放五庄灵墟技能 */
    public DoWZLX(): void {
        this.angre -= 100;
        this.RefreshMp();
        if (this.skillcd > 0) {
            TipGroup.instance.setText(-1, "技能冷却中");
            return;
        }
        this.skilltype = 1;
        GameTools.getSdk().sendEvent("guide", { index: "2-2" });
        this.ChangeState(GuideAI.STATE_SKILL);
        this.callback = () => {
            this.curpannel.setText(7, TeamSkillDataManager.Instance.GetSkill(1).skillName, this.node);
            this.skillcd = this.SkillCd;
            this.curpannel.DoWZLX();
            this.callback = null;
            this.ChangeState(Teamer.STATE_IDLE);
        };
    }
    /** 切换到移动状态（有状态检查） */
    public ChangeStateToMove(): void {
        if (this.curStateId != Teamer.STATE_DIE &&
            this.curStateId != Teamer.STATE_IDLE &&
            this.curStateId != Teamer.STATE_SKILL) {
            this.ChangeState(GuideAI.STATE_MOVE);
        }
    }
    // 怒气/攻击辅助
    /**
     * 添加怒气
     * @param type 类型（0-攻击获得，1-受伤获得）
     */
    public AddAngre(type: number): void {
        this.angre += (0 == type) ? this.role.Shot_anger : this.role.injured_anger;
        if (this.angre >= this.role.maxmp)
            this.angre = this.role.maxmp;
        this.RefreshMp();
    }
    /** 刷新蓝条显示 */
    public RefreshMp(): void {
        this.MpSp.fillRange = this.angre / this.role.maxmp;
        // id==1 或 (存活且不在技能状态且id==5) → 自动释放技能
        if (1 == this.role.id ||
            (this.role.hp > 0 && this.curStateId != GuideAI.STATE_SKILL && 5 == this.role.id)) {
            this.DoSkill();
        }
    }
    // 目标选择
    /**
     * 获取攻击目标
     * 根据角色ID决定目标类型：怪物(2/3/4)攻击队友，其他角色攻击怪物
     * @returns 目标对象
     */
    public GetTarget(): any {
        // 怪物(id 2/3/4)攻击队友
        if (2 == this.role.id || 3 == this.role.id || 4 == this.role.id) {
            const teamers = this.curpannel.GetTeamer();
            if (teamers.length > 0) {
                let minDist = 100000;
                let closest = 0;
                for (let i = 0; i < teamers.length; i++) {
                    const pos = teamers[i].node.getPosition();
                    const dist = this.node.getPosition().sub(pos).mag();
                    if (dist <= minDist) {
                        closest = i;
                        minDist = dist;
                    }
                }
                this.target = teamers[closest];
                return teamers[closest];
            }
            return null;
        }
        // 队友攻击怪物
        const monsters = this.curpannel.GetMontser();
        if (monsters.length > 0) {
            let minDist = 100000;
            let closest = 0;
            for (let i = 0; i < monsters.length; i++) {
                const pos = monsters[i].node.getPosition();
                const dist = this.node.getPosition().sub(pos).mag();
                if (dist <= minDist) {
                    closest = i;
                    minDist = dist;
                }
            }
            this.target = monsters[closest];
            return monsters[closest];
        }
        // 没有目标时结束战斗
        if (this.curStateId != 0) {
            this.ChangeState(Teamer.STATE_IDLE);
            this.curpannel.OverFight();
        }
        return null;
    }
    // AI状态机设置
    /** 初始化AI状态机，注册所有状态 */
    public InitAi(): void {
        this.aiStates = new Array();
        this.AddAiState(new GuideIdleState(this, GuideAI.STATE_IDLE));
        this.AddAiState(new GuideMoveState(this, GuideAI.STATE_MOVE));
        this.AddAiState(new GuideAttackState(this, GuideAI.STATE_ATTACK));
        this.AddAiState(new GuideDieState(this, GuideAI.STATE_DIE));
        this.AddAiState(new GuideVertigoState(this, GuideAI.STATE_Vertigo));
        this.AddAiState(new GuideSkillState(this, GuideAI.STATE_SKILL));
    }
    /** 停止战斗，切换到死亡状态 */
    public Stop(): void {
        this.ChangeState(GuideAI.STATE_DIE);
    }
    /**
     * 受到攻击
     * @param dmg 伤害值
     * @param hitRate 命中率
     * @param isCrit 是否暴击
     * @param showNear 是否显示近程攻击特效
     * @returns 是否死亡
     */
    public TheStrike(dmg: number, hitRate: number, isCrit: boolean, showNear: boolean): boolean {
        if (this.isDie())
            return true;
        const roll = Math.floor(100 * Math.random());
        // 闪避判定
        if (roll > hitRate) {
            this.curpannel.setText(5, "闪避", this.node);
            return false;
        }
        // 显示伤害文字
        if (isCrit) {
            this.curpannel.setText(0, "暴击-" + GameTools.refSetCoin(dmg), this.node);
        }
        else {
            this.curpannel.setText(1, "-" + GameTools.refSetCoin(dmg), this.node);
        }
        // 播放近程攻击特效
        if (showNear && this.nearSp) {
            this.nearSp.node.active = true;
            this.nearSp.setAnimation(0, "atkA_hit", false);
        }
        this.role.hp -= dmg;
        // 未死亡
        if (!(this.role.hp <= 0)) {
            this.AddAngre(1);
            this.RefreshHp();
            return false;
        }
        // id == 2: 特殊处理 - 复活1点血并释放"分身"技能
        if (2 == this.role.id) {
            this.role.hp = 1;
            this.DoFS();
            return false;
        }
        // id != 4: 正常死亡
        if (4 != this.role.id) {
            this.ToDie();
            return true;
        }
        // id == 4: Boss死亡 - 停止所有队友，延迟后恢复
        GameTools.getSdk().sendEvent("guide", { index: "4-1" });
        this.curpannel.setText(99, "", this.node);
        this.node.active = false;
        this.ChangeState(Teamer.STATE_DIE);
        const teamers = this.curpannel.GetTeamer();
        for (let i = 0; i < teamers.length; i++)
            teamers[i].Stop();
        setTimeout(() => {
            for (let i = 0; i < teamers.length; i++)
                teamers[i].ChangeState(GuideAI.STATE_MOVE);
        }, 2300);
        return true;
    }
    /** 每秒执行一次的逻辑 */
    public oneTime(): void {
        this.angre += this.role.time_anger;
        if (this.angre >= this.role.maxmp)
            this.angre = this.role.maxmp;
        this.RefreshMp();
        // 更新技能冷却
        for (let i = 0; i < this.SkillArray.length; i++) {
            if (this.SkillArray[i] > 0)
                this.SkillArray[i] -= 1;
        }
    }
    // 生命周期方法
    /** 加载时缓存子节点引用 */
    protected onLoad(): void {
        this.Content = this.node.getChildByName("Content");
        this.HeadSp = this.Content.getChildByName("head").getComponent(cc.Sprite);
        this.CdSp = this.Content.getChildByName("cd").getChildByName("pro").getComponent(cc.Sprite);
        this.Cursor = this.Content.getChildByName("cursor");
        this.Name = this.Content.getChildByName("name").getComponent(cc.Label);
        this.HpSp = this.Content.getChildByName("hp").getComponent(cc.Sprite);
        this.MpSp = this.Content.getChildByName("mp").getComponent(cc.Sprite);
        this.Realm = this.Content.getChildByName("realm").getComponent(cc.Label);
        this.Spine = this.Content.getChildByName("Spine");
        // this.SpineContent = this.node.getChildByName("SpineContent");
        // this.doSp = this.SpineContent.getChildByName("doskill").getComponent(sp.Skeleton);
        // this.nearSp = this.SpineContent.getChildByName("attackA_hit").getComponent(sp.Skeleton);
    }
    // 异步初始化
    /**
     * 异步初始化引导AI
     * @param role 角色数据
     * @param panel 战斗面板
     */
    public async init(role: any, panel: any): Promise<void> {
        // id == 3: 播放入场骨骼动画，收到"in"事件后显示Content
        if (3 == role.id) {
            this.Content.active = false;
            this.Sp.node.active = true;
            this.Sp.setAnimation(0, "ef15", false);
            this.Sp.setEventListener((entry: any, event: any) => {
                if ("in" == event.data.name) {
                    this.Content.active = true;
                    this.Sp.node.active = false;
                }
            });
        }
        else {
            this.Content.active = true;
            this.Sp.node.active = false;
        }
        this.role = role;
        this.curpannel = panel;
        this.angre = 0;
        this.RefreshMp();
        this.RefreshHp();
        // 根据角色ID获取头像路径
        let headPath = "";
        switch (role.id) {
            case 1:
                headPath = "TeamHead/hero_fight_avatar";
                break;
            case 2:
            case 3:
                headPath = "boss/tuzi";
                break;
            case 4:
                headPath = "boss/xiongshou";
                break;
            case 5:
                headPath = "TeamHead/hero_fight_avatar_1";
                break;
            case 6:
                headPath = "TeamHead/hero_fight_avatar_2";
                break;
            case 7:
                headPath = "TeamHead/hero_fight_avatar_3";
                break;
        }
        headPath = "fight/" + headPath;
        // 加载头像精灵（优先使用缓存）
        let sf: cc.SpriteFrame | null = GameTools.GetRes("ResBundle1", headPath, cc.SpriteFrame);
        if (!sf)
            sf = await GameTools.loadImage("ResBundle1", headPath);
        this.HeadSp.spriteFrame = sf;
        this.Name.string = role.name;
        this.Realm.string = role.realm;
        this.Realm.node.color = cc.color().fromHEX(CultivationDataManager.Instance.GetRealmColor(role.realm));
        this.InitAi();
    }
    // HP/MP刷新
    /** 刷新血条显示 */
    public RefreshHp(): void {
        this.HpSp.fillRange = this.role.hp / this.role.maxhp;
    }
    /** 切换到技能状态（有状态检查） */
    public ChangeStateToSkill(): void {
        if (this.curStateId != Teamer.STATE_DIE &&
            this.curStateId != Teamer.STATE_IDLE &&
            this.curStateId != Teamer.STATE_SKILL) {
            this.ChangeState(GuideAI.STATE_SKILL);
        }
    }
    /** 获取实际攻击力 */
    public GetPracticalAtk(): number {
        return this.role.atk;
    }
    // 自动技能 (id==5)
    /** 自动释放技能 */
    public DoSkill(): void {
        if (this.angre < 100)
            return;
        // 按优先级释放技能
        if (this.SkillArray[0] <= 0) {
            this.ChangeStateToSkill();
            this.callback = () => {
                this.curpannel.setText(7, "玄翼阵", this.node);
                this.SubMp(100);
                this.SkillArray[0] = 10;
                // TODO 会过早放，清完分身，先关了
                //SkillConst.instance.GuideBaneMatrix(9, this);
                this.callback = null;
                this.ChangeState(Teamer.STATE_MOVE);
            };
        }
        else if (this.SkillArray[1] <= 0) {
            this.ChangeStateToSkill();
            this.callback = () => {
                this.curpannel.setText(7, "追炎术", this.node);
                this.SubMp(100);
                this.SkillArray[1] = 5;
                SkillConst.instance.GuideFireBall(this);
                this.callback = null;
                this.ChangeState(Teamer.STATE_MOVE);
            };
        }
        else if (this.SkillArray[2] <= 0) {
            this.ChangeStateToSkill();
            this.callback = () => {
                this.curpannel.setText(7, "天劫", this.node);
                this.SubMp(100);
                this.SkillArray[2] = 5;
                SkillConst.instance.GuideThunder(this);
                this.callback = null;
                this.ChangeState(Teamer.STATE_MOVE);
            };
        }
    }
}
