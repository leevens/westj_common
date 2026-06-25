/**
 * AIMonsterIdle - 怪物入场空闲状态
 * 怪物入场时的动画效果，完成后切换到移动状态
 */
import Monster from "Monster";
import AIState from "AIState";
export default class AIMonsterIdle extends AIState {
    /** 当前怪物组件 */
    public curMonster: any;
    /** 帧更新（空实现） */
    public Update(): void { }
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
    /** 进入状态，播放入场动画 */
    public EnterState(): void {
        super.EnterState();
        const self = this;
        cc.tween(this.curMonster.node).by(0.3, { x: -400 } as any).call(function () {
            self.curMonster.StartFight();
            self.curMonster.ChangeState(Monster.STATE_MOVE);
        }).start();
    }
}
