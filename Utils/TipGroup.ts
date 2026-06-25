import CombatBoost from "CombatBoost";
import GameSystem from "GameSystem";
import PoolManager from "PoolManager";
import TipText from "TipText";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TipGroup extends cc.Component {
    public static instance: TipGroup | null = null;
    @property(cc.Prefab)
    public txt: cc.Prefab = null!;
    @property(cc.Prefab)
    public CombatBoost: cc.Prefab = null!;
    prev_node: cc.Node = null;
    protected onLoad(): void {
        TipGroup.instance = this;
        GameSystem._tipTxt = new PoolManager(this.txt, 10, 200);
        GameSystem.CombatBoost = new PoolManager(this.CombatBoost, 10, 200);
    }
    public setFightNum(type: number, num: number): void {
        const node: cc.Node = GameSystem.CombatBoost.get();
        node.setParent(this.node);
        node.setPosition(cc.v2(0, -220));
        const fightUpComp = node.getComponent(CombatBoost);
        if (fightUpComp)
            fightUpComp.init(type, num);
    }
    public setText(type: number, txt: string): void {
        const node: cc.Node = GameSystem._tipTxt.get();
        node.setParent(this.node);
        const tiptxt = node.getComponent(TipText);
        if (tiptxt)
            tiptxt.setText(type, txt);
        // this.prev_node=node;
    }
}
