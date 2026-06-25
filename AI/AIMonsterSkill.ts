/**
 * AIMonsterSkill - 怪物技能释放状态
 * 处理怪物技能释放的倒计时和动画效果
 */
import Monster from "Monster";
import GameSystem from "GameSystem";
import AIState from "AIState";
export default class AIMonsterSkill extends AIState {
    /** 技能释放最大时间 */
    public maxtime: number = 0;
    /** 当前怪物组件 */
    public curMonster: any;
    /** 技能释放倒计时 */
    public time: number = 0;
    /**
     * 帧更新，处理技能释放倒计时
     * @param dt 时间增量
     */
    public Update(dt: number): void {
        super.Update(dt);
        const self = this;
        if (this.time > 0) {
            this.time -= dt * GameSystem.speed;
            this.curMonster.dopro.fillRange = this.maxtime - this.time / this.maxtime;
            if (this.time <= 0) {
                // 播放技能特效
                if (1 == this.curMonster.skilltype) {
                    this.curMonster.doSkillSp.setAnimation(0, "eff_Sskill_eff", true);
                    this.curMonster.doSkillSp.setCompleteListener(function () {
                        if ("eff_Sskill_eff" == self.curMonster.doSkillSp.animation) {
                            self.curMonster.doSkillSp.node.active = false;
                        }
                    });
                }
                // 执行技能
                this.curMonster.DoSkill();
            }
        }
    }
    /** 退出状态，清理技能效果 */
    public ExitState(): void {
        super.ExitState();
        // 重置冷却时间
        if (1 == this.curMonster.skilltype) {
            this.curMonster.skillcd = 0;
        }
        else {
            this.curMonster.fatalitycd = 0;
        }
        this.curMonster.release = false;
        this.curMonster.do.active = false;
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
    /** 进入状态，初始化技能释放 */
    public EnterState(): void {
        super.EnterState();
        // 根据技能类型获取释放时间
        this.time = 1 == this.curMonster.skilltype ? this.curMonster.skill.release : this.curMonster.fatality.release;
        this.maxtime = this.time;
        this.curMonster.do.active = true;
        this.curMonster.dopro.fillRange = 0;
        // 技能类型为1时播放加载动画
        if (1 == this.curMonster.skilltype) {
            this.curMonster.doSkillSp.node.active = true;
            this.curMonster.doSkillSp.setAnimation(0, "eff_loading", true);
        }
    }
}
