/**
 * AIMonsterVertigo - 怪物眩晕状态
 * 怪物被眩晕时无法行动，持续一段时间后恢复
 */
import Monster from "Monster";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AIMonsterVertigo extends AIState {
    /** 眩晕计时器 */
    public time: number = 0;
    /** 当前怪物组件 */
    public curMonster: any;
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
    /**
     * 帧更新，处理眩晕计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        this.time += dt * GameSystem.speed;
        if (this.time >= this.curMonster.Vertigo) {
            this.curMonster.ChangeStateToMove();
        }
    }
    /** 进入状态，显示眩晕提示 */
    public EnterState(): void {
        super.EnterState();
        this.time = 0;
        this.curMonster.curpannel.setText(9, "眩晕中", this.curMonster.node);
    }
}
