import GameSystem from "GameSystem";
import GameTools from "GameTools";
/**
 * OutputCoin - 灵石产出显示组件
 * 显示灵石产出的飘字效果
 */
const { ccclass, property } = cc._decorator;
const c = ccclass;
const u = property;
@ccclass
export default class OutputCoin extends cc.Component {
    /** 数量标签 */
    @property(cc.Label)
    label: any = null;
    start() {
    }
    /**
     * 初始化产出显示
     * @param t 产出数量
     */
    init(t: any) {
        var e = this;
        this.node.setPosition(cc.v2(0, 0));
        this.label.string = "+" + GameTools.refSetCoin(t);
        this.node.opacity = 0;
        this.node.scale = 0;
        cc.tween(this.node).by(.5, { opacity: 255 }).start();
        cc.tween(this.node).by(2, { y: 100 }).start();
        cc.tween(this.node).to(.3, { scale: 1 }, { easing: cc.easing.backOut }).delay(1).to(.3, { opacity: 0 }).call(function () {
            GameSystem.OutputCoin.restor(e.node);
        }).start();
    }
}
