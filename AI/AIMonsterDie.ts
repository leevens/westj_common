/**
 * AIMonsterDie - 怪物死亡状态
 * 处理怪物死亡时的清理工作
 */
import Monster from "Monster";
import AIState from "AIState";
export default class AIMonsterDie extends AIState {
    /** 当前怪物组件 */
    public curMonster: any;
    protected start(): void { }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curMonster = aiBase.getComponent(Monster);
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
    /** 进入状态，停止所有动作并隐藏节点 */
    public EnterState(): void {
        super.EnterState();
        this.curMonster.Content.stopAllActions();
        this.curMonster.Content.setPosition(cc.v2(0, 0));
        this.curMonster.node.active = false;
    }
}
