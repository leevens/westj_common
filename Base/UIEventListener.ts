const { ccclass, property } = cc._decorator;
@ccclass
export default class UIEventListener extends cc.Component {
    touchSliderEvents: any = [];
    touchMoveEvents: any = [];
    touchLongEvents: any = [];
    touchCancelEvents: any = [];
    @property({
        type: cc.Component.EventHandler,
        displayName: "触摸回调"
    })
    touchEvents: any = [];
    touchStartEvents: any = [];
    @property({
        displayName: "触摸动画"
    })
    touchAnim: any = false;
    downTimer: any = 0;
    longDownEffTime: any = .3;
    initScale: any = 1;
    @property({
        type: cc.AudioClip,
        displayName: "触摸音"
    })
    touchAudio: any = null;
    isSliderY: any = false;
    sliderEffSpeed: any = 0;
    @property({
        type: cc.Float,
        displayName: "点击间隔"
    })
    clickInterval: any = .1;
    isSliderEffect: any = false;
    isDowning: any = false;
    rawScale: any = 0;
    clickTime: any = null;
    onLoad() {
        this.rawScale = this.node.scale,
            this.node.on("touchstart", this.touchStart.bind(this), this.node),
            this.node.on("touchend", this.touchEnd.bind(this), this.node),
            this.node.on("touchcancel", this.touchCancel.bind(this), this.node),
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this), this.node);
    }
    static Get(t: any, e: any) {
        void 0 === e && (e = false);
        var a = t.getComponent(UIEventListener);
        return a || (a = t.addComponent(UIEventListener)),
            a.touchAnim = e,
            a;
    }
    addTouchEvent(t: any) {
        this.touchEvents = [],
            this.touchEvents.push(t);
    }
    addTouchSliderEvent(t: any) {
        this.touchSliderEvents = [],
            this.touchSliderEvents.push(t);
    }
    touchStart() {
        !this.enabled || (this.initScale = this.node.scale, this.isSliderEffect = false, this.touchAnim && (this.node.scale = this.initScale - .05), this.isDowning = true, this.downTimer = 0, this.touchStartEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchStartEvents));
    }
    addTouchLongEvent(t: any) {
        this.touchLongEvents = [],
            this.touchLongEvents.push(t);
    }
    addTouchCancelEvent(t: any) {
        this.touchCancelEvents = [],
            this.touchCancelEvents.push(t);
    }
    addTouchStartEvent(t: any) {
        this.touchStartEvents = [],
            this.touchStartEvents.push(t);
    }
    addMoveEvent(t: any) {
        this.touchMoveEvents.push(t);
    }
    touchEnd() {
        if (this.isDowning = false, !this.enabled || (this.touchAnim && (this.node.scale = this.initScale), !this.isSliderEffect)) {
            var t = new Date, e = 1e3 * this.clickInterval;
            t.getTime() - this.clickTime < e || (this.clickTime = t.getTime(), this.touchEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchEvents, this.node));
        }
    }
    touchMove(t: any) {
        if (!this.enabled || (this.touchMoveEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchMoveEvents, this.node.name), !this.isSliderEffect)) {
            var e = t.getDelta();
            (this.isSliderY ? this.sliderEffSpeed > 0 ? e.y >= this.sliderEffSpeed : e.y <= this.sliderEffSpeed : this.sliderEffSpeed > 0 ? e.x >= this.sliderEffSpeed : e.x <= this.sliderEffSpeed) && this.touchSliderEvents.length > 0 && (this.isSliderEffect = true, cc.Component.EventHandler.emitEvents(this.touchSliderEvents, this.node.name));
        }
    }
    onDestroy() {
        this.node.targetOff(this.node);
    }
    touchCancel() {
        !this.enabled || (this.isDowning = false, this.touchAnim && (this.node.scale = this.initScale), this.touchCancelEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchCancelEvents));
    }
    update() {
        this.isDowning && (this.downTimer += cc.director.getDeltaTime(), this.downTimer >= this.longDownEffTime && (this.touchLongEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchLongEvents, this.node.name), this.isDowning = false));
    }
}
