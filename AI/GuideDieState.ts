/**
 * GuideDieState - 引导角色死亡状态
 * 处理角色死亡时的清理工作
 */
import GameSystem from "GameSystem";
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideDieState extends AIState {
    /** 当前引导AI面板 */
    public curpanel: any;
    protected start(): void { }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 进入状态，停止所有动作并重置位置 */
    public EnterState(): void {
        super.EnterState();
        this.curpanel.Content.stopAllActions();
        this.curpanel.Content.setPosition(cc.v2(0, 0));
        // 特殊处理：索引为99时恢复怪物
        if (99 == this.curpanel.index) {
            GameSystem.GuideMonster.restor(this.curpanel.node);
        }
    }
}
