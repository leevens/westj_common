/**
 * GuideMoveState - 引导角色移动状态
 * 寻找目标并移动到攻击范围内
 */

import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideMoveState extends AIState {
    /** 当前引导AI面板 */
    public curpanel: any;
    /**
     * 帧更新，处理移动逻辑
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
    /** 获取攻击目标 */
    public GetTarget(): void {
        this.curpanel.GetTarget();
    }
    /** 切换到攻击状态 */
    public ToFight(): void {

    }
    /** 进入状态，开始寻找目标 */
    public EnterState(): void {
        super.EnterState();
        this.GetTarget();
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
}
