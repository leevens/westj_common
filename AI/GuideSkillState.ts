/**
 * GuideSkillState - 引导角色技能释放状态
 * 处理技能释放的倒计时和动画效果
 */
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import GuideAI from "GuideAI";
import AIState from "AIState";
export default class GuideSkillState extends AIState {
    /** 技能释放倒计时 */
    public time: number = 0;
    /** 当前引导AI面板 */
    public curpanel: any;
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curpanel = aiBase.getComponent(GuideAI);
    }
    /**
     * 帧更新，处理技能释放倒计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        const self = this;
        if (this.time > 0) {
            this.time -= dt * GameSystem.speed;
            this.curpanel.CdSp.fillRange = this.curpanel.releaseTime - this.time / this.curpanel.releaseTime;
            if (this.time <= 0 && this.curpanel.callback) {
                // 播放技能释放特效
                if (1 == this.curpanel.skilltype && this.curpanel.doSp) {
                    this.curpanel.doSp.setAnimation(0, "eff_Sskill_eff", false);
                    this.curpanel.doSp.setCompleteListener(function () {
                        if ("eff_Sskill_eff" == self.curpanel.doSp.animation) {
                            self.curpanel.doSp.node.active = false;
                        }
                    });
                }
                // 执行技能回调
                this.curpanel.callback();
            }
        }
    }
    /** 退出状态，清理技能效果 */
    public ExitState(): void {
        super.ExitState();
        if (this.curpanel.doSp)
            this.curpanel.doSp.node.active = false;
        if (this.curpanel.CdSp)
            this.curpanel.CdSp.node.active = false;
    }
    /** 进入状态，初始化技能释放 */
    public EnterState(): void {
        super.EnterState();
        this.curpanel.CdSp.node.active = true;
        this.time = this.curpanel.releaseTime;
        this.curpanel.CdSp.fillRange = 0;
        // 技能类型为1时播放加载动画和音效
        if (1 == this.curpanel.skilltype) {
            if (this.curpanel.doSp) {
                this.curpanel.doSp.node.active = true;
                this.curpanel.doSp.setAnimation(0, "eff_loading", true);
            }
            // 根据角色ID播放不同音效
            if (1 == this.curpanel.role.id || 6 == this.curpanel.role.id) {
                SoundManager.instance.play(Sound.Nv);
            }
            else if (5 == this.curpanel.index || 7 == this.curpanel.index) {
                SoundManager.instance.play(Sound.Nan);
            }
        }
    }
}
