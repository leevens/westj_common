/**
 * WestjStateMachine - 默认状态机实现类
 * 管理状态的切换、更新和消息处理
 */
export default class WestjStateMachine {
    /** 全局状态（始终执行） */
    public globalState: any = null;
    /** 上一个状态 */
    public previousState: any = null;
    /** 当前状态 */
    public currentState: any = null;
    /** 状态机所有者 */
    public owner: any;
    /**
     * 构造函数
     * @param owner 状态机所有者
     * @param initialState 初始状态
     * @param globalState 全局状态
     */
    constructor(owner: any, initialState: any, globalState: any) {
        this.owner = owner;
        this.setInitialState(initialState);
        this.setGlobalState(globalState);
    }
    /** 设置状态机所有者 */
    public setOwner(owner: any): void {
        this.owner = owner;
    }
    /** 设置全局状态 */
    public setGlobalState(state: any): void {
        this.globalState = state;
    }
    /** 更新状态机 */
    public update(): void {
        if (this.globalState)
            this.globalState.update(this.owner);
        if (this.currentState)
            this.currentState.update(this.owner);
    }
    /** 获取当前状态 */
    public getCurrentState(): any {
        return this.currentState;
    }
    /** 获取全局状态 */
    public getGlobalState(): any {
        return this.globalState;
    }
    /**
     * 恢复到上一个状态
     * @returns 是否成功恢复
     */
    public revertToPreviousState(): boolean {
        if (!this.previousState)
            return false;
        this.changeState(this.previousState);
        return true;
    }
    /** 设置初始状态 */
    public setInitialState(state: any): void {
        this.previousState = null;
        this.currentState = state;
    }
    /**
     * 处理消息
     * @param msg 消息
     * @returns 是否处理成功
     */
    public handleMessage(msg: any): boolean {
        if (this.currentState && this.currentState.onMessage(this.owner, msg))
            return true;
        if (this.globalState && this.globalState.onMessage(this.owner, msg))
            return true;
        return false;
    }
    /**
     * 判断是否处于指定状态
     * @param state 状态
     * @returns 是否处于该状态
     */
    public isInState(state: any): boolean {
        return this.currentState == state;
    }
    /** 获取状态机所有者 */
    public getOwner(): any {
        return this.owner;
    }
    /**
     * 切换到新状态
     * @param newState 新状态
     */
    public changeState(newState: any): void {
        this.previousState = this.currentState;
        if (this.currentState)
            this.currentState.exit(this.owner);
        this.currentState = newState;
        if (this.currentState)
            this.currentState.enter(this.owner);
    }
    /** 获取上一个状态 */
    public getPreviousState(): any {
        return this.previousState;
    }
}
