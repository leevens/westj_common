/**
 * AIMonsterWait - 怪物等待状态
 * 战斗开始前的等待状态
 */
import Monster from "Monster";
import AIState from "AIState";
export default class AIMonsterWait extends AIState {
    /** 当前怪物组件 */
    public curMonster: any;
    protected start(): void { }
    /** 进入状态 */
    public EnterState(): void {
        super.EnterState();
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
        this.curMonster = aiBase.getComponent(Monster);
    }
}
