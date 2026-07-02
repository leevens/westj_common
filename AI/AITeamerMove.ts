/**
 * AITeamerMove - 队友移动状态
 * 寻找怪物目标并移动到攻击范围内
 */
import GameSystem from "GameSystem";
import AIState from "AIState";
export default abstract class AITeamerMove extends AIState {

    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
    }
    /**
     * 帧更新，处理移动逻辑
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
       
        this.GetTarget();

    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 切换到攻击状态 */
    public abstract  ToFight(): void;
    /** 进入状态，开始寻找目标 */
    public EnterState(): void {
        super.EnterState();
        this.GetTarget();
    }
    /** 获取攻击目标（怪物） */
    public abstract GetTarget(): void;
}
