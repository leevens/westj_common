/**
 * AITeamerAttack - 队友攻击状态
 * 处理队友的近战/远程攻击逻辑，支持暴击、吸血、被动技能等效果
 */
import BulletEffect from "BulletEffect";
import Teamer from "Teamer";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AITeamerAttack extends AIState {
    /** 当前队友组件 */
    public curTeamer: any;
    /** 攻击冷却计时器 */
    public time: number = 0;
    /** 攻击是否结束 */
    public isover: boolean = false;
    /** 攻击状态（0-等待攻击，1-攻击中） */
    public state: number = 0;
    /** 执行攻击伤害计算 */
    public Attack(): void {
        if (this.curTeamer.target) {
            let atk: number = 0;
            // 处理攻击力加成
            if (this.curTeamer.Upatk > 1) {
                atk = this.curTeamer.GetPracticalAtk() * this.curTeamer.Upatk;
                this.curTeamer.Upatk = 1;
            }
            else {
                atk = this.curTeamer.GetPracticalAtk();
            }
            // 暴击判定（包含额外暴击率）
            let crit: boolean = false;
            if (Math.floor(100 * Math.random()) < this.curTeamer.role.crit + this.curTeamer.crit.value) {
                atk *= 2;
                crit = true;
            }
            // 吸血效果
            if (this.curTeamer.Suck > 0) {
                this.curTeamer.Cure(atk * this.curTeamer.Suck);
                this.curTeamer.Suck = 0;
            }
            // 被动技能：第一个队友攻击回血
            if (1 == this.curTeamer.index) {
                this.curTeamer.Cure(atk * this.curTeamer.role.passivity);
            }
            // 特殊弟子被动：暴击清零暴击率，非暴击增加暴击率
            if (2 == this.curTeamer.discipleid) {
                if (crit) {
                    this.curTeamer.crit.value = 0;
                }
                else {
                    this.curTeamer.crit.value += 10;
                }
            }
            // 执行攻击
            const killed: boolean = this.curTeamer.target.TheStrike(atk, this.curTeamer.role.hit, crit, "近战" == this.curTeamer.role.type);
            this.curTeamer.AddAngre(0);
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
        if (this.curTeamer.target.isDie() && this.curAiBase.curStateId != Teamer.STATE_SKILL) {
            this.curTeamer.ChangeStateToMove();
            this.state = 0;
            this.time = 0;
            return;
        }
        if (this.time < this.curTeamer.role.atkSpeed) {
            this.time += dt * GameSystem.speed;
        }
        if (this.time >= this.curTeamer.role.atkSpeed && 0 == this.state) {
            this.DoAttack();
        }
    }
    /** 进入状态，初始化攻击参数 */
    public EnterState(): void {
        super.EnterState();
        this.isover = false;
        this.state = 0;
        this.curTeamer.index;
    }
    /** 执行攻击动作 */
    public DoAttack(): void {
        const self = this;
        if (this.curTeamer.target.isDie()) {
            this.curTeamer.ChangeStateToMove();
            this.state = 0;
            this.time = 0;
            return;
        }
        this.state = 1;
        // 近战攻击
        if ("近战" == this.curTeamer.role.type) {
            const dur: number = 0.1 / GameSystem.speed;
            const diff: any = this.curTeamer.node.position.sub(this.curTeamer.target.node.position);
            cc.tween(this.curTeamer.Content)
                .by(dur, { position: cc.v3(-diff.x / 5, -diff.y / 5, 0) } as any)
                .call(function () {
                self.time = 0;
                self.Attack();
            })
                .by(dur, { position: cc.v3(diff.x / 5, diff.y / 5, 0) } as any)
                .start();
        }
        else {
            // 远程攻击
            const dur: number = 0.1 / GameSystem.speed;
            const diff: any = this.curTeamer.node.position.sub(this.curTeamer.target.node.position);
            cc.tween(this.curTeamer.Content)
                .call(function () {
                if (2 != self.stateId)
                    self.curTeamer.node.stopAllActions();
            })
                .by(dur, { position: cc.v3(-diff.x / 8, -diff.y / 8, 0) } as any)
                .call(function () {
                if (2 == self.stateId) {
                    self.time = 0;
                    const bulletNode: any = self.curTeamer.curpannel.Createbuttet();
                    const worldPos: any = self.curTeamer.node.convertToWorldSpaceAR(self.curTeamer.Content.getPosition());
                    const localPos: any = self.curTeamer.node.parent.convertToNodeSpaceAR(worldPos);
                    bulletNode.setPosition(localPos);
                    const bulletType: number = 1 == self.curTeamer.discipleid ? 1 : 3;
                    const bulletData = bulletNode.getComponent(BulletEffect);
                    if (bulletData) {
                        bulletData.init(0, bulletType, self.curTeamer, self.curTeamer.target, function () {
                            self.Attack();
                        });
                    }
                    else {
                        console.error("bulletData is null");
                    }
                }
                else {
                    self.curTeamer.node.stopAllActions();
                }
            })
                .by(dur, { position: cc.v3(diff.x / 8, diff.y / 8, 0) } as any)
                .start();
        }
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curTeamer = aiBase.getComponent(Teamer);
    }
    /** 执行技能 */
    public DoSkill(): void {
        this.curTeamer.DoSkill();
        this.state = 0;
        this.time = 0;
    }
    /** 重置攻击状态 */
    public initAtk(): void {
        this.state = 0;
        const curPos: any = this.curTeamer.node.getPosition();
        const worldPos: any = this.curTeamer.target.node.parent.convertToWorldSpaceAR(this.curTeamer.target.node.getPosition());
        const localPos: any = this.curTeamer.node.parent.convertToNodeSpaceAR(worldPos);
        // 如果超出攻击范围，切换到移动状态
        if (curPos.sub(localPos).mag() > 200 || this.curAiBase.curStateId != Teamer.STATE_SKILL) {
            this.curTeamer.ChangeStateToMove();
        }
    }
}
