/**
 * AITeamerDie - 队友死亡状态
 * 处理队友死亡时的清理工作
 */

import AIState from "AIState";
export default class AITeamerDie extends AIState {

    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
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
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
}
