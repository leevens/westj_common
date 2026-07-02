/**
 * GuideSkillState - 引导角色技能释放状态
 * 处理技能释放的倒计时和动画效果
 */
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideSkillState extends AIState {
    /** 技能释放倒计时 */
    public time: number = 0;
    /** 当前引导AI面板 */
    public curpanel: any;
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
    /**
     * 帧更新，处理技能释放倒计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        const self = this;

    }
    /** 退出状态，清理技能效果 */
    public ExitState(): void {
        super.ExitState();
        if (this.curpanel.doSp)
            this.curpanel.doSp.node.active = false;
        if (this.curpanel.CdSp)
            this.curpanel.CdSp.node.active = false;
    }
    /** 进入状态，初始化技能释放 */
    public EnterState(): void {
        super.EnterState();
        this.curpanel.CdSp.node.active = true;
        this.time = this.curpanel.releaseTime;
    }
}
