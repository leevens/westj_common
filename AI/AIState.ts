/**
 * AIState - AI状态机状态基类
 * 定义了状态的基本接口：进入、退出和更新
 * 所有具体AI状态都应继承此类
 */
/**
 * IAiStateOwner - AIState的拥有者类型
 * 通常是AIBase的子类（cc.Component）
 */
export type IAiStateOwner = any;
export default class AIState {
    /** 状态ID，用于在状态机中标识此状态 */
    public stateId: number;
    /** 所属的AI控制器实例 */
    public curAiBase: any;
    /**
     * 退出状态时调用
     * 默认停止所有节点动作
     */
    public ExitState(): void {
        this.curAiBase.node.stopAllActions();
    }
    /**
     * 进入状态时调用
     * @param args 可变参数，用于传递额外数据
     */
    public EnterState(...args: any[]): void {
        // 子类重写此方法实现进入状态的逻辑
    }
    /**
     * 帧更新方法
     * @param dt 时间增量（秒）
     */
    public Update(dt?: number): void {
        // 子类重写此方法实现状态的帧更新逻辑
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        this.curAiBase = aiBase;
        this.stateId = stateId;
    }
}
