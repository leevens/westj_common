/**
 * AITeamerSkill - 队友技能释放状态
 * 处理队友技能释放的倒计时、动画效果和音效播放
 */
import Teamer from "Teamer";
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AITeamerSkill extends AIState {
    /** 技能释放倒计时 */
    public time: number = 0;
    /** 当前队友组件 */
    public curTeamer: any;
    /**
     * 构造函数
     * @param aiBase 所属的AI控制器
     * @param stateId 状态ID
     */
    constructor(aiBase: any, stateId: number) {
        super(aiBase, stateId);
        this.curTeamer = aiBase.getComponent(Teamer);
    }
    /** 退出状态，清理技能效果 */
    public ExitState(): void {
        super.ExitState();
        this.curTeamer.release = false;
        this.curTeamer.do.active = false;
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
            this.curTeamer.dopro.fillRange = this.curTeamer.releaseTime - this.time / this.curTeamer.releaseTime;
            if (this.time <= 0) {
                if (this.curTeamer.callback) {
                    // 播放技能特效
                    if (1 == this.curTeamer.skilltype) {
                        this.curTeamer.doSkillSp.setAnimation(0, "eff_Sskill_eff", false);
                        this.curTeamer.doSkillSp.setCompleteListener(function () {
                            if ("eff_Sskill_eff" == self.curTeamer.doSkillSp.animation) {
                                self.curTeamer.doSkillSp.node.active = false;
                            }
                        });
                    }
                    this.curTeamer.callback();
                }
                else {
                    this.curTeamer.DoSkill();
                }
            }
        }
    }
    /** 进入状态，初始化技能释放 */
    public EnterState(): void {
        super.EnterState();
        this.time = this.curTeamer.releaseTime;
        this.curTeamer.release = true;
        this.curTeamer.do.active = true;
        this.curTeamer.dopro.fillRange = 0;
        // 技能类型为1时播放加载动画和音效
        if (1 == this.curTeamer.skilltype) {
            this.curTeamer.doSkillSp.node.active = true;
            this.curTeamer.doSkillSp.setAnimation(0, "eff_loading", true);
            // 根据队友索引和弟子ID选择音效
            if (0 == this.curTeamer.index) {
                // console.log("大威天龙SkillEffectBase",this.curTeamer);
                SoundManager.instance.play(Sound.SkillEffectBase);
            }
            else if (2 == this.curTeamer.index) {
                //SoundManager.instance.play(Sound.Nv);
                // console.log("老孙一棒",this.curTeamer);
                SoundManager.instance.play(Sound.Teamer1Skill1);
            }
            else {
                if (Math.random() > 0.5) {
                    SoundManager.instance.play(Sound.Nan);
                }
                else {
                    SoundManager.instance.play(Sound.Nan);
                }
                // if (0 == this.curTeamer.discipleid || 2 == this.curTeamer.discipleid) {
                //     SoundManager.instance.play(Sound.Nan);
                // } else {
                //     SoundManager.instance.play(Sound.Nv);
                // }
            }
        }
        else {
            if (Math.random() > 0.5) {
                SoundManager.instance.play(Sound.Nan);
            }
            else {
                SoundManager.instance.play(Sound.Nan);
            }
        }
    }
}
