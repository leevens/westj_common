import GameSystem from "GameSystem";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TipText extends cc.Component {
    list: any = [];
    static prev_node: cc.Node = null;
    @property(cc.Sprite)
    txt: any = null;
    @property(cc.Label)
    tiptxt: any = null;
    start() {
    }
    setText(t: any, e: any) {
        this.txt.node.active = false,
            this.tiptxt.node.active = false,
            0 == t || 1 == t || 2 == t || 3 == t || 4 == t ?
                (this.node.width = 650, this.txt.node.active = true,
                    this.txt.spriteFrame = this.list[t]) :
                -1 == t
                    && (this.tiptxt.node.active = true,
                        this.tiptxt.string = e),
            this.Tween();
    }
    Tween() {
        var t = this;
        let start_offset = 100;
        let nodeheight = 40;
        if (TipText.prev_node && TipText.prev_node.y < start_offset + nodeheight) {
            start_offset = TipText.prev_node.y - nodeheight;
        }
        t.node.y = start_offset;
        cc.tween(this.node).call(function () {
            t.node.opacity = 0;
        }).by(2, {
            y: 300
        }).call(function () {
            t.restore();
        }).start();
        cc.tween(this.node).to(.3, {
            opacity: 255
        }).start(),
            cc.tween(this.node).delay(1.7).to(.3, {
                opacity: 0
            }).start();
        TipText.prev_node = this.node;
    }
    restore() {
        if (TipText.prev_node == this.node) {
            TipText.prev_node = null;
        }
        GameSystem._tipTxt.restor(this.node);
    }
}
