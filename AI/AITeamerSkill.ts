/**
 * AITeamerSkill - 队友技能释放状态
 * 处理队友技能释放的倒计时、动画效果和音效播放
 */
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default abstract class AITeamerSkill extends AIState {
    /** 技能释放倒计时 */
    public time: number = 0;
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
    }
    /** 退出状态，清理技能效果 */
    public ExitState(): void {
        super.ExitState();
    }
    /**
     * 帧更新，处理技能释放倒计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        const self = this;
        if (this.time > 0) {
            this.time -= dt * GameSystem.speed;
        }
    }
    /** 进入状态，初始化技能释放 */
    public EnterState(): void {
        super.EnterState();
    }
}
