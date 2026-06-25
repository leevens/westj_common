import CoinOutputDataManager from "CoinOutputDataManager";
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import GameTools from "GameTools";
import TipGroup from "TipGroup";
import UIBase from "UIBase";
import UIManager from "UIManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SaveToDesktop extends UIBase {
    @property(cc.Label)
    Coin: any = null;
    async onEnable(): Promise<void> {
        super.onEnable();
        const e = 2400 * await CoinOutputDataManager.Instance.GetOutPut();
        this.Coin.string = "x" + GameTools.refSetCoin(e);
    }
    CloseThis(): void {
        super.CloseThis();
    }
    Clickoff(): void {
        SoundManager.instance.play(Sound.Click);
        this.CloseThis();
    }
    ClickGet(): void {
        SoundManager.instance.play(Sound.Click);
        this.CloseThis();
        if (GameSystem.getisAddToDesktop()) {
            TipGroup.instance.setText(-1, "奖励已领取");
        }
        else {
            GameTools.getSdk().addToFavorites(async () => {
                const t = 2400 * await CoinOutputDataManager.Instance.GetOutPut();
                UIManager.Instance.ChangeCoin(t);
                GameSystem.setisAddToDesktop();
            }, () => {
                TipGroup.instance.setText(-1, "收藏失败");
            });
        }
    }
    start(): void { }
}
