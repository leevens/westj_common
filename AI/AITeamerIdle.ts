/**
 * AITeamerIdle - 队友空闲状态
 * 队友返回到起始位置
 */
import Teamer from "Teamer";
import AIState from "AIState";
export default class AITeamerIdle extends AIState {
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
    /** 进入状态，返回起始位置 */
    public EnterState(): void {
        super.EnterState();
        this.curTeamer.ToStartpos();
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
