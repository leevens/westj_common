/**
 * AIHangState - 弟子闲逛状态
 * 在宗门内随机行走，定期停下休息，然后继续行走
 * 用于弟子在宗门场景中的自由活动
 */
import PanelConst from "PanelConst";
import UIManager from "UIManager";
import DiscipleControl from "DiscipleControl";
import SectControl from "SectControl";
import AIMoveBase from "AIMoveBase";
export default class AIHangState extends AIMoveBase {
    /** 寻找目标的回调函数 */
    public findTargetHandler: () => void;
    /** 闲逛计时器，控制行走间隔 */
    public hangTimer: number = 0;
    /** 退出状态，取消定时器 */
    public ExitState(): void {
        super.ExitState();
        this.curAiBase.unschedule(this.findTargetHandler);
    }
    /**
     * 获取移动速度
     * @returns 弟子的移动速度
     */
    public GetMoveSpeed(): number {
        return this.curDisciple.moveSpeed;
    }
    /** 随机寻找闲逛目标点 */
    public FindTargetHang(): void {
        const path: any = UIManager.Instance
            .GetClass(PanelConst.Sect)
            .getComponent(SectControl)
            .pathArea.GetRandomPath(this.curAiBase.node);
        this.curDisciple.Spine.setAnimation(0, "move", true);
        this.SetPath(path);
        this.MoveLogic();
    }
    /**
     * 帧更新，处理闲逛计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        const wasActive: boolean = this.hangTimer > 0;
        this.hangTimer -= cc.director.getDeltaTime();
        if (this.hangTimer <= 0 && wasActive) {
            this.StopMove();
            this.curAiBase.scheduleOnce(this.findTargetHandler, 3);
        }
    }
    /** 进入状态，初始化闲逛计时器 */
    public EnterState(): void {
        super.EnterState();
        this.hangTimer = this.curDisciple.hangTime;
        this.OffTimeHang(1);
    }
    /**
     * 设置下次寻找目标的延迟
     * @param t 基础延迟时间（秒）
     */
    public OffTimeHang(t: number): void {
        t += Math.random();
        this.curAiBase.scheduleOnce(this.findTargetHandler, t);
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curDisciple = aiBase.getComponent(DiscipleControl);
        // console.log("###################AIHangState constructor curDisciple", this.curDisciple);
        const self = this;
        this.findTargetHandler = function () {
            self.FindTargetHang();
        };
    }
    /** 移动结束，切换到空闲状态 */
    public EndMove(): void {
        this.curDisciple.Spine.setAnimation(0, "idle", true);
        this.OffTimeHang(3);
    }
}
