/**
 * AIMoveBase - 基于移动的AI状态基类
 * 提供寻路和移动的基础逻辑，处理路径点序列的移动
 * 自动处理移动动画（walk/run）和方向翻转
 */
import DiscipleControl from "DiscipleControl";
import AIState from "AIState";
export default class AIMoveBase extends AIState {
    /** 路径点数组 */
    public pathPoses: any[] = new Array();
    /** 下一个要移动到的路径点索引 */
    public nextMoveIndex: number = 0;
    /** 当前弟子控制器 */
    public curDisciple: any;
    /** 当前正在执行的移动动画 */
    public curTween: any;
    /**
     * 移动逻辑主循环
     * 沿着路径点依次移动，自动切换移动动画
     */
    public MoveLogic(): void {
        if (this.nextMoveIndex >= this.pathPoses.length) {
            this.EndMove();
        }
        else {
            const target: any = this.pathPoses[this.nextMoveIndex];
            const cur: any = this.curAiBase.node.getPosition();
            // 根据移动方向翻转角色朝向
            if (cur.x > target.x) {
                this.curAiBase.node.getChildByName("Sp").scaleX = 1;
            }
            else if (cur.x < target.x) {
                this.curAiBase.node.getChildByName("Sp").scaleX = -1;
            }
            // 计算移动时间
            const dur: number = cc.Vec2.distance(this.curAiBase.node.getPosition(), target) / this.GetMoveSpeed();
            // 根据速度设置动画（走/跑）
            if (1 == this.curDisciple.speed) {
                if ("move" != this.curDisciple.Spine.animation) {
                    this.curDisciple.Spine.setAnimation(0, "move", true);
                }
            }
            else {
                if ("run" != this.curDisciple.Spine.animation) {
                    this.curDisciple.Spine.setAnimation(0, "run", true);
                }
            }
            // 执行移动动画
            const self = this;
            this.curTween = cc.tween(this.curAiBase.node).to(dur, {
                position: cc.v3(target.x, target.y, 0) as any
            }).call(function () {
                self.MoveLogic();
            }).start();
            this.nextMoveIndex += 1;
        }
    }
    /** 进入状态 */
    public EnterState(): void {
        super.EnterState();
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curDisciple = aiBase.getComponent(DiscipleControl);
        // console.log("AIMoveBase constructor curDisciple", this.curDisciple)
    }
    /** 停止当前移动 */
    public StopMove(): void {
        if (this.curTween) {
            this.curTween.stop();
            if ("idle" != this.curDisciple.Spine.animation) {
                this.curDisciple.Spine.setAnimation(0, "idle", true);
            }
        }
    }
    /**
     * 设置移动路径
     * @param path 路径点数组
     */
    public SetPath(path: any[]): void {
        this.nextMoveIndex = 0;
        this.pathPoses = new Array();
        this.pathPoses = path;
    }
    /** 退出状态，停止移动 */
    public ExitState(): void {
        super.ExitState();
        this.StopMove();
    }
    /**
     * 获取移动速度（子类重写）
     * @returns 移动速度值
     */
    public GetMoveSpeed(): number {
        return 0;
    }
    /** 移动结束时调用（子类重写） */
    public EndMove(): void { }
}
