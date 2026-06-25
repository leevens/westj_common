import { SoundManager, Sound } from "SoundManager";
import GameTools from "GameTools";
const { ccclass } = cc._decorator;
@ccclass
export default class ShareButton extends cc.Component {

    public ClickShare(): void {
        SoundManager.instance.play(Sound.Click);
        GameTools.getSdk().share();
    }
    protected onLoad(): void {
        this.node.active = GameTools.getSdk().isHaveShare();
    }
}
