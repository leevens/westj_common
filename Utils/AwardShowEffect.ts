const { ccclass, property } = cc._decorator;
@ccclass
export default class AwardShowEffect extends cc.Component {
    @property({ displayName: "原始坐标" })
    public startpos: cc.Vec2 = new cc.Vec2();
    protected onEnable(): void {
        this.node.scale = 0;
        this.node.stopAllActions();
        if (!(this.startpos.x == 0 && this.startpos.y == 0)) {
            this.node.setPosition(this.startpos);
        }
        cc.tween(this.node)
            .call(() => {
            this.node.scale = 0;
            this.node.opacity = 0;
        })
            .to(0.3, { scale: 1.5, opacity: 255 })
            .by(0.3, { y: -100, scale: -0.5 }, { easing: "backOut" } as any)
            .start();
    }
}
