import { GameFight } from "GameFight";
import UIBase from "UIBase";
const { ccclass } = cc._decorator;
const c = ccclass;
@ccclass
export default class ReincarnationSprite extends UIBase {
    Sp: any = null;
    onLoad() {
        this.Sp = this.node.getChildByName("Sp").getComponent(sp.Skeleton);
    }
    start() {
    }
    onEnable() {
        var t = this;
        this.Sp.setAnimation(0, "lunhui", false),
            this.Sp.setCompleteListener(function () {
                GameFight.instance.StartFight(),
                    t.CloseThis();
            });
    }
}
