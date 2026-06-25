/**
 * AIMonsterMove - 怪物移动状态
 * 寻找队友目标并移动到攻击范围内
 */
import Monster from "Monster";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AIMonsterMove extends AIState {
    /** 当前怪物组件 */
    public curMonster: any;
    /**
     * 帧更新，处理移动逻辑
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        if (this.curMonster.target) {
            // 检查目标是否死亡
            if (this.curMonster.target.isDie()) {
                this.GetTarget();
            }
            else {
                const curPos: any = this.curMonster.node.getPosition();
                const worldTarget: any = this.curMonster.target.node.parent.convertToWorldSpaceAR(this.curMonster.target.node.getPosition());
                const localTarget: any = this.curMonster.node.parent.convertToNodeSpaceAR(worldTarget);
                const dist: number = curPos.sub(localTarget).mag();
                const radians: number = cc.v2(curPos.sub(localTarget) as any).signAngle(cc.v2(1, 0));
                const degrees: number = radians / Math.PI * 180;
                this.curMonster.cursor.angle = -degrees;
                const dir: any = cc.v2(-Math.cos(radians), Math.sin(radians));
                dir.normalizeSelf();
                // 根据攻击距离判断是否进入攻击状态
                if (dist <= this.curMonster.role.range) {
                    this.ToFight();
                }
                else {
                    // 向目标移动
                    this.curMonster.node.x += dt * dir.x * GameSystem.speed * this.curMonster.moveSpeed;
                    this.curMonster.node.y += dt * dir.y * GameSystem.speed * this.curMonster.moveSpeed;
                }
            }
        }
        else {
            this.GetTarget();
        }
    }
    /** 获取攻击目标（队友） */
    public GetTarget(): void {
        this.curMonster.GetTeamer();
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
        this.curMonster = aiBase.getComponent(Monster);
    }
    /** 切换到攻击状态 */
    public ToFight(): void {
        if (this.curAiBase.curStateId != Monster.STATE_DIE
            && this.curAiBase.curStateId != Monster.STATE_IDLE) {
            this.curAiBase.ChangeState(Monster.STATE_ATTACK);
        }
    }
    /** 进入状态，开始寻找目标 */
    public EnterState(): void {
        super.EnterState();
        this.curMonster.target = null;
        this.GetTarget();
    }
}
