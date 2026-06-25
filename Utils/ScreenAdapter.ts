const { ccclass, property } = cc._decorator;
@ccclass
export default class ScreenAdapter extends cc.Component {
    @property({ type: cc.Integer})
    public maxpos: number = 0;
    @property({ type: cc.Integer})
    public minpos: number = 0;
    protected onLoad(): void {
        const w = cc.winSize.width;
        const h = cc.winSize.height;
        // console.log("机型：" + w, h, this.minpos, this.maxpos);
        // NOTE: the decompiled JS branched on `h <= 1334` but used the same value in both branches.
        const widget = this.node.getComponent(cc.Widget);
        if (widget) {
            widget.top = h <= 1334 ? this.minpos + 10 : this.minpos + 10;
        }
    }
    protected start(): void {
        // no-op
    }
}
