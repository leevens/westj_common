
import SceneDataManager from "SceneDataManager";
import GameSystem from "GameSystem";
import { EventConst } from "EventConst";
import GameTools from "GameTools";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GameGroup extends cc.Component {
    @property([cc.Node])
    public backgroup3: cc.Node[] = [];
    @property([cc.Sprite])
    public map1: cc.Sprite[] = [];
    public Map2deviation: number[] = [150, 150, 150];
    public Map1deviation: number[] = [254, 205, 254];
    @property([cc.Node])
    public backgroup2: cc.Node[] = [];
    @property([cc.Node])
    public backgroup1: cc.Node[] = [];
    @property([cc.Sprite])
    public map3: cc.Sprite[] = [];
    @property([cc.Sprite])
    public map2: cc.Sprite[] = [];
    @property(cc.Label)
    public CoinLabel: cc.Label | null = null;
    @property(cc.Label)
    public GoldLabel: cc.Label | null = null;
    @property(cc.Node)
    public highest: cc.Node | null = null;
    @property(cc.Label)
    public JewelLabel: cc.Label | null = null;
    public initGold(): void {
        this.GoldLabel.string = GameTools.refSetCoin(GameSystem.getGold());
    }
    onGameStart(): void {
        this.highest.active = true;
        cc.systemEvent.on(EventConst.Coin, this.initCoin, this);
        cc.systemEvent.on(EventConst.Jewel, this.initJewel, this);
        cc.systemEvent.on(EventConst.Gold, this.initGold, this);
        cc.systemEvent.on(EventConst.Maps, this.initMaps, this);
    }
    // ---- lifecycle -----------------------------------------------------------
    protected onLoad(): void {
        this.highest.active = false;
        this.initCoin();
        this.initJewel();
        this.initGold();
        cc.systemEvent.on(EventConst.GameStart, this.onGameStart, this);
    }
    // ---- async map loading --------------------------------------------------
    public async initMaps(): Promise<void> {
        const role = await SceneDataManager.Instance.GetRole();
        let mapIdx = 0;
        switch (role.scene) {
            case "大唐境内":
                mapIdx = role.level1;
                break;
            case "西番诸国":
                mapIdx = 7;
                break;
            case "大河险域":
                mapIdx = 8;
                break;
            case "西牛贺洲":
                mapIdx = 9;
                break;
            case "域外蛮邦":
                mapIdx = 10;
                break;
            case "灵山圣地":
                mapIdx = 11;
                break;
        }
        const n = mapIdx < 10 ? "0" + mapIdx : "" + mapIdx;
        const basePath = "Maps/map" + n;
        // --- layer 1 -----------------------------------------------------------
        const path1 = basePath + "/map" + n + "_1";
        let sf1: cc.SpriteFrame | null = GameTools.GetRes("Bundle", path1, cc.SpriteFrame);
        if (!sf1)
            sf1 = await GameTools.loadImage("Bundle", path1);
        for (let i = 0; i < this.map1.length; i++)
            this.map1[i].spriteFrame = sf1;
        // --- layer 2 -----------------------------------------------------------
        const path2 = basePath + "/map" + n + "_2";
        let sf2: cc.SpriteFrame | null = GameTools.GetRes("Bundle", path2, cc.SpriteFrame);
        if (!sf2)
            sf2 = await GameTools.loadImage("Bundle", path2);
        for (let i = 0; i < this.map2.length; i++)
            this.map2[i].spriteFrame = sf2;
        // --- layer 3 (skipped for 秘境 / index 11) ----------------------------
        if (mapIdx == 11) {
            for (let i = 0; i < this.map3.length; i++)
                this.map3[i].node.active = false;
            return;
        }
        for (let i = 0; i < this.map3.length; i++)
            this.map3[i].node.active = true;
        const path3 = basePath + "/map" + n + "_3";
        let sf3: cc.SpriteFrame | null = GameTools.GetRes("Bundle", path3, cc.SpriteFrame);
        if (!sf3)
            sf3 = await GameTools.loadImage("Bundle", path3);
        for (let i = 0; i < this.map3.length; i++)
            this.map3[i].spriteFrame = sf3;
    }
    // ---- coin / jewel display -----------------------------------------------
    public initCoin(): void {
        this.CoinLabel.string = GameTools.refSetCoin(GameSystem.getCoin());
    }
    // ---- parallax background scrolling --------------------------------------
    protected update(dt: number): void {
        if (!GameSystem.doMove)
            return;
        // backgroup3 – fastest layer (speed 100)
        for (let i = 0; i < this.backgroup3.length; i++) {
            let x = this.backgroup3[i].x;
            x -= 100 * dt;
            this.backgroup3[i].setPosition(cc.v2(x, this.backgroup3[i].y));
            if (this.backgroup3[i].position.x <= -this.backgroup3[0].width) {
                const other = i + 1 >= 2 ? 0 : 1;
                const wrapX = this.backgroup3[other].position.x + this.backgroup3[other].width - 2;
                this.backgroup3[i].setPosition(wrapX, this.backgroup3[i].y);
            }
        }
        // backgroup2 – slower layer (speed 60)
        for (let i = 0; i < this.backgroup2.length; i++) {
            let x = this.backgroup2[i].x;
            x -= 60 * dt;
            this.backgroup2[i].setPosition(cc.v2(x, this.backgroup2[i].y));
            if (this.backgroup2[i].position.x <= -this.backgroup2[0].width) {
                const other = i + 1 >= 2 ? 0 : 1;
                const wrapX = this.backgroup2[other].position.x + this.backgroup2[other].width - 2;
                this.backgroup2[i].setPosition(wrapX, this.backgroup2[i].y);
            }
        }
    }
    public initJewel(): void {
        this.JewelLabel.string = GameTools.refSetCoin(GameSystem.getJewel());
    }
}
