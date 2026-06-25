/**
 * AIBase - AI状态机基类控制器
 * 管理一组AIState实例，通过stateId索引进行状态切换
 * 作为所有AI控制器的基类，提供状态管理的核心逻辑
 */
import AIState from "AIState";
const { ccclass } = cc._decorator;
@ccclass
export default class AIBase extends cc.Component {
    /** AI状态数组，通过stateId作为索引访问 */
    public aiStates: AIState[] = new Array();
    /** 当前状态ID，初始值为999999表示未激活状态 */
    public curStateId: number = 999999;
    /**
     * 获取怪物组件（子类重写）
     * @returns 怪物组件实例
     */
    public GetMonster(): any {
        return null;
    }
    /**
     * 切换到指定状态
     * @param id 目标状态ID
     */
    public ChangeState(id: number): void {
        if (this.curStateId != id) {
            const oldState: AIState = this.GetAiStateById(this.curStateId);
            const newState: AIState = this.GetAiStateById(id);
            if (oldState != null)
                oldState.ExitState();
            this.curStateId = id;
            if (newState != null)
                newState.EnterState();
        }
    }
    /**
     * 获取队友组件（子类重写）
     * @returns 队友组件实例
     */
    public GetTeamer(): any {
        return null;
    }
    /**
     * 获取技能组件（子类重写）
     * @returns 技能组件实例
     */
    public GetSkill(): any {
        return null;
    }
    /**
     * 添加一个AI状态到状态数组
     * @param state 要添加的AIState实例
     */
    public AddAiState(state: AIState): void {
        if (this.aiStates.length != state.stateId) {
            console.log("###################添加动ai狀態出错，请检查添加动画顺序", [state.stateId, this.aiStates.length]);
        }
        this.aiStates.push(state);
    }
    /**
     * 根据状态ID获取对应的AIState实例
     * @param id 状态ID
     * @returns AIState实例，如果不存在返回null
     */
    public GetAiStateById(id: number): AIState {
        if (id < this.aiStates.length) {
            return this.aiStates[id];
        }
        return null;
    }
    /**
     * 帧更新方法，调用当前状态的Update方法
     * @param dt 时间增量（秒）
     */
    protected update(dt: number): void {
        const state: any = this.GetAiStateById(this.curStateId);
        if (state)
            state.Update(dt);
    }
}
