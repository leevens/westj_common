/**
 * GuideMoveState - 引导角色移动状态
 * 寻找目标并移动到攻击范围内
 */
import GameSystem from "GameSystem";
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideMoveState extends AIState {
    /** 当前引导AI面板 */
    public curpanel: any;
    /**
     * 帧更新，处理移动逻辑
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        if (this.curpanel.target) {
            // 检查自身是否死亡
            if (this.curpanel.isDie()) {
                this.curAiBase.ChangeState(GuideAI.STATE_DIE);
            }
            // 检查目标是否死亡
            if (this.curpanel.target.isDie()) {
                this.GetTarget();
            }
            else {
                const curPos: any = this.curpanel.node.getPosition();
                const worldTarget: any = this.curpanel.target.node.parent.convertToWorldSpaceAR(this.curpanel.target.node.getPosition());
                const localTarget: any = this.curpanel.node.parent.convertToNodeSpaceAR(worldTarget);
                const dist: number = curPos.sub(localTarget).mag();
                const radians: number = cc.v2(curPos.sub(localTarget)).signAngle(cc.v2(1, 0));
                const degrees: number = radians / Math.PI * 180 + 180;
                this.curpanel.Cursor.angle = -degrees;
                // 根据角色类型设置攻击距离阈值
                const threshold: number = "近战" == this.curpanel.role.type ? 200 : 400;
                if (dist <= threshold) {
                    this.ToFight();
                }
                else {
                    // 向目标移动
                    const dir: any = cc.v2(-Math.cos(radians), Math.sin(radians));
                    dir.normalizeSelf();
                    this.curpanel.node.x += dt * dir.x * GameSystem.speed * this.curpanel.moveSpeed;
                    this.curpanel.node.y += dt * dir.y * GameSystem.speed * this.curpanel.moveSpeed;
                }
            }
        }
        else {
            this.GetTarget();
        }
    }
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
    /** 获取攻击目标 */
    public GetTarget(): void {
        this.curpanel.GetTarget();
    }
    /** 切换到攻击状态 */
    public ToFight(): void {
        if (this.curAiBase.curStateId != GuideAI.STATE_DIE
            && this.curAiBase.curStateId != GuideAI.STATE_IDLE) {
            this.curAiBase.ChangeState(GuideAI.STATE_ATTACK);
        }
    }
    /** 进入状态，开始寻找目标 */
    public EnterState(): void {
        super.EnterState();
        this.GetTarget();
    }
    /** 退出状态 */
    public ExitState(): void {
        super.ExitState();
    }
}
