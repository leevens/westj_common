// StartGame - 开始游戏面板（带骨骼动画和章节介绍）
import ChapterDataManager from "ChapterDataManager";
import { SoundManager, Sound } from "SoundManager";
import { EventConst } from "EventConst";
import GameTools from "GameTools";
import ForewordPanel from "ForewordPanel";
import PanelConst from "PanelConst";
import UIBase from "UIBase";
import UIManager from "UIManager";
/**
 * StartGame - 开始游戏面板
 * 显示游戏启动界面和章节介绍
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class StartGame extends UIBase {
    /** 动画组件 */
    @property(sp.Skeleton)
    public Sp: sp.Skeleton | null = null;
    /** 内容节点 */
    @property(cc.Node)
    public Content: cc.Node | null = null;
    // ---- 生命周期 -----------------------------------------------------------
    protected start(): void { }
    /**
     * 面板启用时
     */
    protected onEnable(): void {
        super.onEnable();
        GameTools.getSdk().sendEvent("guide", { index: "5-1" });
        this.Sp.node.active = false;
        this.Content.active = true;
    }
    // ---- 点击开始 ---------------------------------------------------------
    /**
     * 点击开始游戏
     */
    public ClickStart(): void {
        SoundManager.instance.play(Sound.Click);
        GameTools.getSdk().sendEvent("guide", { index: "5-2" });
        this.Content.active = false;
        this.Sp.node.active = true;
        this.Sp.setAnimation(0, "lunhui", false);
        this.Sp.setCompleteListener(async () => {
            this.CloseThis();
            const chapterData = ChapterDataManager.Instance.GetData(1);
            await UIManager.Instance.ShowUI(PanelConst.ForewordPanel);
            UIManager.Instance.GetClass(PanelConst.ForewordPanel).getComponent(ForewordPanel).init((data: any) => {
                cc.systemEvent.emit(EventConst.GameStart);
                cc.systemEvent.emit(EventConst.playChapter, chapterData);
            });
        });
    }
}
