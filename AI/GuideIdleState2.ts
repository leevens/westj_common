/**
 * GuideIdleState2 - 弟子空闲状态
 * 进入状态时播放idle动画
 */
import AIState from "AIState";
import DiscipleControl from "DiscipleControl";
export default class GuideIdleState2 extends AIState {
    /** 当前弟子控制器 */
    curDisciple: DiscipleControl = null;
    /**
     * 帧更新
     * @param e 时间增量
     */
    Update(e: any) {
        super.Update(e);
    }
    /**
     * 构造函数
     * @param base 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(base: any, stateId: any) {
        super(base, stateId);
        this.curDisciple = base.getComponent(DiscipleControl);
    }
    /** 退出状态 */
    ExitState() {
        super.ExitState();
    }
    /** 进入状态，播放空闲动画 */
    EnterState() {
        super.EnterState();

    }
}
