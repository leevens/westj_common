/**
 * GuideIdleState - 引导角色空闲状态
 * 角色处于空闲状态，等待下一步指令
 */
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideIdleState extends AIState {
    /** 当前引导AI面板 */
    public curpanel: any;
    /**
     * 帧更新
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
    /** 进入状态 */
    public EnterState(): void {
        super.EnterState();
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
}
