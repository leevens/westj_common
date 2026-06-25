import GameSystem from "GameSystem";
/**
 * fightTxt - 战斗文字显示组件
 * 显示战斗中的各种飘字效果
 */
const { ccclass, property } = cc._decorator;
const l = ccclass;
const c = property;
@ccclass
export default class FightText extends cc.Component {
    /** 死亡节点 */
    @property(cc.Node)
    die: any = null;
    /** 动画组件 */
    @property(sp.Skeleton)
    Sp: any = null;
    /** 文字标签 */
    @property(cc.Label)
    txtlabel: any = null;
    /** 横幅节点 */
    @property(cc.Node)
    banner: any = null;
    /** 锁定节点 */
    @property(cc.Node)
    suo: any = null;
    /**
     * 设置战斗文字
     * @param t 类型（0-7不同效果）
     * @param e 文字内容
     * @param node 节点引用
     */
    setText(t: any, e: any, node: any) {
        var a = this;
        switch (this.Sp.node.active = false, this.suo.active = false, t) {
            case 0:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#DC3232");
                break;
            case 1:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#FFFFFF");
                break;
            case 2:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#77EC4F");
                break;
            case 3:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#BF69F6");
                break;
            case 4:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#FFE671");
                break;
            case 5:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#00fbff");
                break;
            case 6:
                this.banner.active = false;
                this.Sp.node.active = true;
                this.Sp.setAnimation(0, "eff_skill_di", false);
                this.txtlabel.node.color = cc.color().fromHEX("#FFFFFF");
                break;
            case 7:
                this.banner.active = false;
                this.Sp.node.active = true;
                this.Sp.setAnimation(0, "eff_Sskill_di", false);
                this.txtlabel.node.color = cc.color().fromHEX("#FFFFFF");
                break;
            case 8:
            case 99:
                this.banner.active = false;
                this.txtlabel.node.color = cc.color().fromHEX("#DC3232");
                break;
        }
        //8 == t || 99 == t ? (this.txtlabel.node.active = !1, this.banner.active = !1, this.die.active = 8 == t, this.suo.active = 8 != t, 
        this.node.setPosition(node.getPosition().x, node.getPosition().y);
        this.node.opacity = 0; //, 8 == t ? cc.tween(this.node).to(0, { opacity: 255 }).start() : null) : null;            
        this.txtlabel.string = e;
        this.Tween();
    }
    /**
     * 播放飘字动画
     */
    Tween() {
        var t = this;
        this.node.opacity = 0;
        // this.node.y = 0;
        cc.tween(this.node).to(.3, { opacity: 255 }).start();
        cc.tween(this.node).by(1.5, { y: 80 }).delay(.3).to(.3, { opacity: 0 }).call(function () {
            GameSystem.fightTxt.restor(t.node);
        }).start();
    }
}
