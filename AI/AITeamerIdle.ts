/**
 * AITeamerIdle - 队友空闲状态
 * 队友返回到起始位置
 */

import AIState from "AIState";
export default class AITeamerIdle extends AIState {

    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
    }
    /** 进入状态，返回起始位置 */
    public EnterState(): void {
        super.EnterState();
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /**
     * 帧更新
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
    }
}
