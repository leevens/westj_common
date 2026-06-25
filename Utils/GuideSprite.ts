
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideSprite extends cc.Component {
    @property(cc.Label)
    public label: cc.Label | null = null;
    @property
    public text: string = "hello";
    protected onLoad(): void {
        // no-op
    }
    protected start(): void {
        // no-op
    }
    protected onEnable(): void {
        this.node.stopAllActions();
        cc.tween(this.node)
            .delay(2)
            .call(() => { this.node.active = false; })
            .start();
    }
}
