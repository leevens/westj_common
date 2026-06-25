/**
 * AIMonsterAttack - 怪物攻击状态
 * 处理怪物的近战/远程攻击逻辑，支持暴击、吸血等效果
 */
import BulletEffect from "BulletEffect";
import Monster from "Monster";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AIMonsterAttack extends AIState {
    /** 攻击冷却计时器 */
    public time: number = 0;
    /** 攻击是否结束 */
    public isover: boolean = false;
    /** 攻击状态（0-等待攻击，1-攻击中） */
    public state: number = 0;
    /** 当前怪物组件 */
    public curMonster: any;
    /** 执行攻击伤害计算 */
    public Attack(): void {
        if (this.curMonster.target) {
            let atk: number = 0;
            // 处理攻击力加成
            if (this.curMonster.Upatk > 1) {
                atk = this.curMonster.GetPracticalAtk() * this.curMonster.Upatk;
                this.curMonster.Upatk = 1;
            }
            else {
                atk = this.curMonster.GetPracticalAtk();
            }
            // 暴击判定
            let crit: boolean = false;
            if (Math.floor(100 * Math.random()) < this.curMonster.role.crit) {
                atk *= 2;
                crit = true;
            }
            // 吸血效果
            if (this.curMonster.Suck > 0) {
                this.curMonster.Cure(atk * this.curMonster.Suck);
                this.curMonster.Suck = 0;
            }
            // 执行攻击
            const killed: boolean = this.curMonster.target.TheStrike(atk, this.curMonster.role.hit, crit, "近战" == this.curMonster.role.atkType);
            // 反击处理（弟子ID为2时）
            if (2 == this.curMonster.target.discipleid) {
                this.curMonster.target.Counter(this.curMonster);
            }
            // 处理攻击结果
            if (killed) {
                this.isover = true;
            }
            else if (this.curMonster.role.hp > 0) {
                this.initAtk();
            }
            else {
                this.curMonster.ChangeState(Monster.STATE_DIE);
            }
        }
    }
    /** 执行攻击动作 */
    public DoAttack(): void {
        const self = this;
        if (this.curMonster.target.isDie() && this.curAiBase.curStateId != Monster.STATE_SKILL) {
            this.curMonster.ChangeStateToMove();
            this.state = 0;
            this.time = 0;
            return;
        }
        this.state = 1;
        // 近战攻击
        if ("近战" == this.curMonster.role.atkType) {
            const dur: number = 0.1 / GameSystem.speed;
            const diff: any = this.curMonster.node.position.sub(this.curMonster.target.node.position);
            cc.tween(this.curMonster.Content)
                .call(function () {
                if (2 != self.stateId)
                    self.curMonster.node.stopAllActions();
            })
                .by(dur, { position: cc.v3(-diff.x / 5, -diff.y / 5, 0) } as any)
                .call(function () {
                if (2 == self.stateId) {
                    self.time = 0;
                    self.Attack();
                }
                else {
                    self.curMonster.node.stopAllActions();
                }
            })
                .by(dur, { position: cc.v3(diff.x / 5, diff.y / 5, 0) } as any)
                .call(function () {
                if (self.isover) {
                    if (self.curMonster.role.hp > 0) {
                        self.curMonster.ChangeStateToMove();
                    }
                    else {
                        self.curMonster.ChangeState(Monster.STATE_DIE);
                    }
                    self.state = 0;
                    self.time = 0;
                }
            })
                .start();
        }
        else {
            // 远程攻击
            const dur: number = 0.1 / GameSystem.speed;
            const diff: any = this.curMonster.node.position.sub(this.curMonster.target.node.position);
            cc.tween(this.curMonster.Content)
                .call(function () {
                if (2 != self.stateId)
                    self.curMonster.node.stopAllActions();
            })
                .by(dur, { position: cc.v3(-diff.x / 8, -diff.y / 8, 0) } as any)
                .call(function () {
                if (2 == self.stateId) {
                    self.time = 0;
                    const bulletNode: any = self.curMonster.curpannel.Createbuttet();
                    const worldPos: any = self.curMonster.node.convertToWorldSpaceAR(self.curMonster.Content.getPosition());
                    const localPos: any = self.curMonster.node.parent.convertToNodeSpaceAR(worldPos);
                    bulletNode.setPosition(localPos);
                    bulletNode.getComponent(BulletEffect).init(0, 2, self.curMonster, self.curMonster.target, function () {
                        self.Attack();
                        if (self.isover) {
                            if (self.curMonster.role.hp > 0) {
                                self.curMonster.ChangeStateToMove();
                            }
                            else {
                                self.curMonster.ChangeState(Monster.STATE_DIE);
                            }
                            self.state = 0;
                            self.time = 0;
                        }
                    });
                }
                else {
                    self.curMonster.node.stopAllActions();
                }
            })
                .by(dur, { position: cc.v3(diff.x / 8, diff.y / 8, 0) } as any)
                .call(function () {
                if (self.isover) {
                    if (self.curMonster.role.hp > 0) {
                        self.curMonster.ChangeStateToMove();
                    }
                    else {
                        self.curMonster.ChangeState(Monster.STATE_DIE);
                    }
                    self.state = 0;
                    self.time = 0;
                }
            })
                .start();
        }
    }
    /** 进入状态，初始化攻击参数 */
    public EnterState(): void {
        super.EnterState();
        this.state = 0;
        this.isover = false;
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.isover = false;
        this.curMonster = aiBase.getComponent(Monster);
    }
    /** 重置攻击状态 */
    public initAtk(): void {
        this.state = 0;
        const curPos: any = this.curMonster.node.getPosition();
        const worldPos: any = this.curMonster.target.node.parent.convertToWorldSpaceAR(this.curMonster.target.node.getPosition());
        const localPos: any = this.curMonster.node.parent.convertToNodeSpaceAR(worldPos);
        // 如果超出攻击范围，切换到移动状态
        if (curPos.sub(localPos).mag() > this.curMonster.role.range) {
            this.curMonster.ChangeStateToMove();
        }
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /**
     * 帧更新，处理攻击冷却计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        if (this.time < this.curMonster.role.atkSpeed && 0 == this.state) {
            this.time += dt * GameSystem.speed;
        }
        if (this.time >= this.curMonster.role.atkSpeed && 0 == this.state) {
            this.DoAttack();
        }
    }
}
