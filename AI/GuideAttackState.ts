/**
 * GuideAttackState - 引导角色攻击状态
 * 处理近战/远程攻击的计时和执行逻辑
 * 支持暴击判定和攻击动画
 */
import BulletEffect from "BulletEffect";
import GameSystem from "GameSystem";
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideAttackState extends AIState {
    /** 攻击状态（0-等待攻击，1-攻击中） */
    public state: number = 0;
    /** 攻击冷却计时器 */
    public time: number = 0;
    /** 当前引导AI面板 */
    public curpanel: any;
    /** 攻击是否结束 */
    public isover: boolean = false;
    /**
     * 群体攻击（Boss使用）
     * @param target 目标对象
     */
    public AllAttack(target: any): void {
        if (target) {
            let atk: number = this.curpanel.GetPracticalAtk();
            let crit: boolean = false;
            // 暴击判定
            if (Math.floor(100 * Math.random()) < this.curpanel.role.crit) {
                atk *= 2;
                crit = true;
            }
            const killed: boolean = target.TheStrike(atk, this.curpanel.role.hit, crit, "近战" == this.curpanel.role.type);
            this.curpanel.AddAngre(0);
            if (killed) {
                this.isover = true;
            }
            else {
                this.initAtk();
            }
        }
    }
    /** 重置攻击状态 */
    public initAtk(): void {
        this.state = 0;
        const curPos: any = this.curpanel.node.getPosition();
        const worldPos: any = this.curpanel.target.node.parent.convertToWorldSpaceAR(this.curpanel.target.node.getPosition());
        const localPos: any = this.curpanel.node.parent.convertToNodeSpaceAR(worldPos);
        // 如果距离过远，切换到移动状态
        if (curPos.sub(localPos).mag() > 200 || this.curAiBase.curStateId != GuideAI.STATE_SKILL) {
            this.curpanel.ChangeStateToMove();
        }
    }
    /** 单体攻击 */
    public Attack(): void {
        if (this.curpanel.target) {
            let atk: number = this.curpanel.GetPracticalAtk();
            let crit: boolean = false;
            // 暴击判定
            if (Math.floor(100 * Math.random()) < this.curpanel.role.crit) {
                atk *= 2;
                crit = true;
            }
            const killed: boolean = this.curpanel.target.TheStrike(atk, this.curpanel.role.hit, crit, "近战" == this.curpanel.role.type);
            this.curpanel.AddAngre(0);
            if (killed) {
                this.isover = true;
            }
            else {
                this.initAtk();
            }
        }
    }
    /**
     * 帧更新，处理攻击冷却计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        if (this.curpanel.target.isDie() && this.curAiBase.curStateId != GuideAI.STATE_SKILL) {
            this.curpanel.ChangeStateToMove();
            this.state = 0;
            this.time = 0;
            return;
        }
        if (this.time < this.curpanel.role.atkSpeed) {
            this.time += dt * GameSystem.speed;
        }
        if (this.time >= this.curpanel.role.atkSpeed && 0 == this.state) {
            this.DoAttack();
        }
    }
    /** 进入状态，初始化攻击参数 */
    public EnterState(): void {
        super.EnterState();
        this.isover = false;
        this.state = 0;
        this.curpanel.index;
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 执行攻击动作 */
    public DoAttack(): void {
        const self = this;
        if (this.curpanel.target.isDie()) {
            this.curpanel.ChangeStateToMove();
            this.state = 0;
            this.time = 0;
            return;
        }
        this.state = 1;
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
}
