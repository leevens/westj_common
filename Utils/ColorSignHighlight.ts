import CoinOutputDataManager from "CoinOutputDataManager";
import { SoundManager, Sound } from "SoundManager";
import GameSystem from "GameSystem";
import GameTools from "GameTools";
import TipGroup from "TipGroup";
import UIBase from "UIBase";
import UIManager from "UIManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ColorSignHighlight extends UIBase {
    @property(cc.Label)
    public Coin: cc.Label = null!;
    public Clickoff(): void {
        SoundManager.instance.play(Sound.Click);
        this.CloseThis();
    }
    public ClickGet(): void {
        SoundManager.instance.play(Sound.Click);
        this.CloseThis();
        if (GameSystem.getaddColorSign()) {
            TipGroup.instance.setText(-1, "奖励已领取");
        }
        else {
            GameTools.getSdk().addColorSign(async () => {
                const mul: number = await CoinOutputDataManager.Instance.GetOutPut();
                const coin = 2400 * mul;
                UIManager.Instance.ChangeCoin(coin);
                GameSystem.setaddColorSign();
            }, () => {
                TipGroup.instance.setText(-1, "添加失败");
            });
        }
    }
    public async onEnable(): Promise<void> {
        super.onEnable();
        GameSystem.addTime = 60;
        const mul: number = await CoinOutputDataManager.Instance.GetOutPut();
        const coin = 2400 * mul;
        this.Coin.string = "x" + GameTools.refSetCoin(coin);
    }
    public CloseThis(): void {
        super.CloseThis();
    }
    public start(): void { }
}
