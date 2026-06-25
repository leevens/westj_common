import GameTools from "GameTools";
const { ccclass } = cc._decorator;
const l = ccclass;
@ccclass
export default class CustomTouchArea extends cc.Component {
    onEnable() {
        this.updateArea(),
            cc.view.on("canvas-resize", this.updateArea, this);
    }
    updateArea() {
        var t = this.node.getComponent(cc.Widget);
        if (t) {
            t.updateAlignment();
            var e = this.node.position, n = this.node.getAnchorPoint();
            t.isAlignTop = t.isAlignBottom = t.isAlignLeft = t.isAlignRight = true;
            var a = cc.winSize.width, o = cc.winSize.height, i = GameTools.getSdk().getMenuButtonBottom(), s = cc.rect(0, 0, a, o - i);
            t.top = o - s.y - s.height,
                t.bottom = s.y,
                t.left = s.x,
                t.right = a - s.x - s.width,
                t.updateAlignment();
            var l = this.node.position, c = n.x - (l.x - e.x) / this.node.width, u = n.y - (l.y - e.y) / this.node.height;
            this.node.setAnchorPoint(c, u);
        }
    }
    onDisable() {
        cc.view.off("canvas-resize", this.updateArea, this);
    }
}
