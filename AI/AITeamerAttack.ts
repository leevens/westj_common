/**
 * AITeamerAttack - 队友攻击状态
 * 处理队友的近战/远程攻击逻辑，支持暴击、吸血、被动技能等效果
 */
import AIState from "AIState";
export default abstract class AITeamerAttack extends AIState {
    /** 攻击冷却计时器 */
    public time: number = 0;
    /** 攻击是否结束 */
    public isover: boolean = false;
    /** 攻击状态（0-等待攻击，1-攻击中） */
    public state: number = 0;
    public target: any;
    /** 执行攻击伤害计算 */
    public abstract Attack(): void;
    /**
     * 帧更新，处理攻击冷却计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
    }
    /** 进入状态，初始化攻击参数 */
    public EnterState(): void {
        super.EnterState();
        this.isover = false;
        this.state = 0;
    }
    /** 执行攻击动作 */
    public DoAttack(): void {

    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
    }
    /** 执行技能 */
    public DoSkill(): void {
        this.state = 0;
        this.time = 0;
    }
    /** 重置攻击状态 */
    public initAtk(): void {
        this.state = 0;
    }
}
