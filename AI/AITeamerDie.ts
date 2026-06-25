/**
 * AITeamerDie - 队友死亡状态
 * 处理队友死亡时的清理工作
 */
import Teamer from "Teamer";
import AIState from "AIState";
export default class AITeamerDie extends AIState {
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
     * 帧更新
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
    }
    /** 进入状态，停止所有动作 */
    public EnterState(): void {
        super.EnterState();
        this.curTeamer.node.stopAllActions();
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
}
