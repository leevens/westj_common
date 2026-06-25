const { ccclass, property } = cc._decorator;
@ccclass
export default class UIBase extends cc.Component {
    public closeAnimHandler: (() => void) | null = null;
    @property({ displayName: "是否是大小变化动画" })
    public isScaleAnim: boolean = false;
    public openAnimHandler: (() => void) | null = null;
    @property({ type: cc.Node, displayName: "最上层遮罩" })
    public foreMask: cc.Node = null!;
    @property({ type: cc.Node, displayName: "底层遮罩" })
    public mask: cc.Node = null!;
    @property({ displayName: "是否销毁" })
    public isdestoy: boolean = false;
    public isAnim: boolean = false;
    @property({ type: cc.Node, displayName: "动画节点" })
    public animRoot: cc.Node = null!;
    public CloseWithScaleAnim(): void {
        if (this.foreMask)
            this.foreMask.active = true;
        this.animRoot.stopAllActions();
        cc.tween(this.animRoot)
            .to(0.3, { scale: 0 } as any, { easing: "backIn" } as any)
            .call(() => {
            this.closeAnimHandler && this.closeAnimHandler();
            this.Destroy();
        })
            .start();
    }
    protected onEnable(): void {
        this.isAnim = false;
        if (this.isScaleAnim && this.animRoot) {
            this.OpenWithScaleAnim();
        }
    }
    public Destroy(): void {
        if (this.isdestoy)
            this.node.destroy();
        else
            this.node.active = false;
    }
    public OpenWithScaleAnim(): void {
        this.animRoot.scale = 0;
        cc.tween(this.animRoot)
            .to(0.3, { scale: 1 } as any, { easing: "backOut" } as any)
            .call(() => {
            this.openAnimHandler && this.openAnimHandler();
        })
            .start();
    }
    public CloseThis(): void {
        if (this.isAnim)
            return;
        if (this.isScaleAnim && this.animRoot) {
            this.isAnim = true;
            this.CloseWithScaleAnim();
        }
        else {
            this.Destroy();
        }
    }
}
