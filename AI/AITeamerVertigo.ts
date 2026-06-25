/**
 * AITeamerVertigo - 队友眩晕状态
 * 队友被眩晕时无法行动，持续一段时间后恢复
 */
import Teamer from "Teamer";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AITeamerVertigo extends AIState {
    /** 当前队友组件 */
    public curTeamer: any;
    /** 眩晕计时器 */
    public time: number = 0;
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 进入状态，显示眩晕提示 */
    public EnterState(): void {
        super.EnterState();
        this.time = 0;
        this.curTeamer.curpannel.setText(9, "眩晕中", this.curTeamer.node);
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
    /**
     * 帧更新，处理眩晕计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        this.time += dt * GameSystem.speed;
        if (this.time >= this.curTeamer.Vertigo) {
            if (this.curTeamer.isDie()) {
                this.curTeamer.ChangeState(Teamer.STATE_DIE);
            }
            else {
                this.curTeamer.ChangeStateToMove();
            }
        }
    }
}
