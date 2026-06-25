/**
 * AITeamerMove - 队友移动状态
 * 寻找怪物目标并移动到攻击范围内
 */
import Teamer from "Teamer";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AITeamerMove extends AIState {
    /** 当前队友组件 */
    public curTeamer: any;
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curTeamer = aiBase.getComponent(Teamer);
    }
    /**
     * 帧更新，处理移动逻辑
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        if (this.curTeamer.target) {
            // 检查自身是否死亡
            if (this.curTeamer.isDie()) {
                this.curAiBase.ChangeState(Teamer.STATE_DIE);
            }
            // 检查目标是否死亡
            if (this.curTeamer.target.isDie()) {
                this.GetTarget();
            }
            else {
                const curPos: any = this.curTeamer.node.getPosition();
                const worldTarget: any = this.curTeamer.target.node.parent.convertToWorldSpaceAR(this.curTeamer.target.node.getPosition());
                const localTarget: any = this.curTeamer.node.parent.convertToNodeSpaceAR(worldTarget);
                const dist: number = curPos.sub(localTarget).mag();
                const radians: number = cc.v2(curPos.sub(localTarget) as any).signAngle(cc.v2(1, 0));
                const degrees: number = radians / Math.PI * 180 + 180;
                this.curTeamer.cursor.angle = -degrees;
                // 根据角色类型设置攻击距离阈值
                const threshold: number = "近战" == this.curTeamer.role.type ? 200 : 400;
                if (dist <= threshold) {
                    this.ToFight();
                }
                else {
                    // 向目标移动
                    const dir: any = cc.v2(-Math.cos(radians), Math.sin(radians));
                    dir.normalizeSelf();
                    this.curTeamer.node.x += dt * dir.x * GameSystem.speed * this.curTeamer.moveSpeed;
                    this.curTeamer.node.y += dt * dir.y * GameSystem.speed * this.curTeamer.moveSpeed;
                }
            }
        }
        else {
            this.GetTarget();
        }
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 切换到攻击状态 */
    public ToFight(): void {
        if (this.curAiBase.curStateId != Teamer.STATE_DIE
            && this.curAiBase.curStateId != Teamer.STATE_IDLE) {
            this.curAiBase.ChangeState(Teamer.STATE_ATTACK);
        }
    }
    /** 进入状态，开始寻找目标 */
    public EnterState(): void {
        super.EnterState();
        this.GetTarget();
    }
    /** 获取攻击目标（怪物） */
    public GetTarget(): void {
        this.curTeamer.GetMonster();
    }
}
