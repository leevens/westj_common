import ChapterDataManager from "ChapterDataManager";
import SingletonBase from "SingletonBase";
import Singleton from "Singleton";
import GameSystem from "GameSystem";
import { EventConst } from "EventConst";
import CartoonPanel from "CartoonPanel";
import ForewordPanel from "ForewordPanel";
import PanelConst from "PanelConst";
import UIManager from "UIManager";
/**
 * GameEntry - 游戏入口
 * 管理游戏启动流程和单例初始化
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class GameEntry extends cc.Component {
    /** 当前所有单例基类数组 */
    static curAllSignleBases: any[] = [];
    /** 单例类名列表 */
    singleTons: string[] = [
        "CoinOutputDataManager", "HeroDataManager", "PetDataManager", "SceneDataManager",
        "MonsterDataManager", "SkillDataManager", "IntensifyDataManager", "CultivationDataManager",
        "TreasureDataManager", "TeamSkillDataManager", "CompanionDataManager", "DrugDataManager",
        "SystemDataManager", "StoryDataManager", "GuideDataManager", "DailyManager",
        "AwardDataManager", "BuildDataManager", "BuildLevelDataManager", "TrialsDataManager",
        "ReincarnationDataManager", "WeaponDataManager", "EquipDataManager", "PropDataManager",
        "ShopDataManager", "GiftDataManager", "RoamDataManager", "TalkDataManager",
        "StoryTalkManager", "GuideMonsterDataManager", "ChapterDataManager",
        "HeartDevilDataManager", "SignDataManager", "OnlineDataManager"
    ];
    /**
     * 初始化所有单例
     */
    async InitSingleTon(): Promise<void> {
        const t = GameEntry.curAllSignleBases.length;
        for (let e = 0; e < t; e++)
            GameEntry.curAllSignleBases[e].Init();
    }
    /**
     * 开始游戏主流程
     */
    async PlayGame(): Promise<void> {
        GameSystem.islogin = true;
        if (GameSystem.getIsFirst()) {
            GameSystem.setIsFirst();
            if (GameSystem.isjumpguide) {
                const t = ChapterDataManager.Instance.GetData(1);
                await UIManager.Instance.ShowUI(PanelConst.ForewordPanel);
                UIManager.Instance.GetClass(PanelConst.ForewordPanel).getComponent(ForewordPanel).init(() => {
                    // cc.systemEvent.emit(EventConst.GameStart);
                    cc.systemEvent.emit(EventConst.playChapter, t);
                });
            }
            else {
                await UIManager.Instance.ShowUI(PanelConst.CartoonPanel);
                await UIManager.Instance.GetClass(PanelConst.CartoonPanel).getComponent(CartoonPanel).init(0);
                cc.systemEvent.emit(EventConst.Maps);
            }
        }
        else {
            cc.systemEvent.emit(EventConst.GameStart);
            cc.systemEvent.emit(EventConst.Maps);
        }
    }
    /**
     * 启动游戏
     */
    async start(): Promise<void> {
        this.RegistSingleTon();
        await this.InitSingleTon();
        setTimeout(() => {
            this.PlayGame();
        }, 1000);
    }
    async StartGame(): Promise<void> {
    }
    /**
     * 注册所有单例
     */
    RegistSingleTon(): void {
        const t = this.singleTons.length;
        for (let e = 0; e < t; e++) {
            const a = Singleton.RegistSingleTon(this.singleTons[e]);
            if (!(a instanceof SingletonBase))
                console.error("!! SingletonBase not found", a);
            GameEntry.curAllSignleBases.push(a);
        }
    }
}
