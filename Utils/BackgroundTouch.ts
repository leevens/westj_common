import { EventConst } from "EventConst";
const { ccclass } = cc._decorator;
const l = ccclass;
@ccclass
export default class BackgroundTouch extends cc.Component {
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
            cc.systemEvent.emit(EventConst.GAME_BG_TOUCH_START, t);
        }, this),
            this.node.on(cc.Node.EventType.TOUCH_END, function (t) {
                cc.systemEvent.emit(EventConst.GAME_BG_TOUCH_END, t);
            }, this),        
            this.node.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
                cc.systemEvent.emit(EventConst.GAME_BG_TOUCH_MOVE, t);
            }, this),


            this.node.on(cc.Node.EventType.MOUSE_WHEEL, function (t) {
                cc.systemEvent.emit(EventConst.GAME_BG_TOUCH_WHEEL, t);
            }, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
                cc.systemEvent.emit(EventConst.GAME_BG_TOUCH_CANCEL, t);
            }, this),            
    }
}
