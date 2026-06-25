import GameTools from "GameTools";
import PathFind from "PathFind";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PathAreaDiagonal extends cc.Component {
    public mapData: number[][] = [];
    public pointSize: cc.Size = new cc.Size(30, 15);
    public curTileMap: cc.TiledMap | null = null;
    public pointBord: number = 0;
    @property({ type: cc.Camera, displayName: "相机" })
    public curCamera: cc.Camera | null = null;
    protected onLoad(): void {
        this.curTileMap = this.node.getComponentInChildren(cc.TiledMap);
        this.InitArea();
        this.pointBord = (Math.sqrt(5) * this.pointSize.height) / 2;
    }
    public GetPathPointByLocalPos(t: cc.Vec2): cc.Vec2 {
        const ratio = this.pointSize.height / this.pointSize.width;
        const nx = t.x;
        const ny = t.y;
        const p1 = new cc.Vec2((ratio * nx - ny) / (2 * ratio), (ny - ratio * nx) / 2);
        if (p1.y > 0)
            return cc.v2(99999, 99999);
        const d1 = Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
        const p2 = new cc.Vec2((ratio * nx + ny) / (2 * ratio), (ratio * nx + ny) / 2);
        if (p2.y > 0)
            return cc.v2(99999, 99999);
        const d2 = Math.sqrt(Math.pow(p2.x, 2) + Math.pow(p2.y, 2));
        let col = d1 / this.pointBord;
        col = col == this.mapData[0].length ? col - 1 : Math.floor(col);
        let row = d2 / this.pointBord;
        row = row == this.mapData.length ? row - 1 : Math.floor(row);
        if (row >= this.mapData.length || col >= this.mapData[0].length)
            return cc.v2(99999, 99999);
        return new cc.Vec2(col, row);
    }
    public GetPathPointByNode(node: cc.Node): cc.Vec2 {
        const localPos: cc.Vec2 = GameTools.ConvertTargetToCurLocal(node, this.node);
        return this.GetPathPointByLocalPos(localPos);
    }
    public GetPathPointByStartEndNode(startNode: cc.Node, endNode: cc.Node, parent: cc.Node | null = null): cc.Vec2[] {
        const startPos = this.GetPathPointByNode(startNode);
        const endPos = this.GetPathPointByNode(endNode);
        const result: cc.Vec2[] = [];
        const path = PathFind.search(this.mapData, startPos, endPos);
        const p = parent == null ? startNode.parent : parent;
        if (path) {
            const count = path.length;
            for (let i = 1; i < count - 1; i++) {
                const pt = path[i];
                const local = this.GetLocalPosByIndex(pt.y, pt.x);
                const world = this.node.convertToWorldSpaceAR(local);
                const nodePos = p.convertToNodeSpaceAR(world);
                result.push(nodePos);
            }
        }
        else {
            console.log("寻路没有找到路径 可能没有可走的路径 有可能是起点终点位置一样了 或者位置不在地图上 这里逻辑是会直接走向目标点");
            console.log("startPos : ", startPos);
            console.log("endPos : ", endPos);
        }
        const finalPos: cc.Vec2 = GameTools.ConvertTargetToCurLocal(endNode, p);
        result.push(finalPos);
        return result;
    }
    public IsPathAtPoint(layer: any, x: number, y: number): boolean {
        let isPath = false;
        try {
            const props = this.curTileMap!.getPropertiesForGID(layer.getTileGIDAt(x, y)) as any;
            if (props && props.path_bool) {
                isPath = true;
            }
        }
        catch (e) { /* ignore */ }
        return isPath;
    }
    public InitArea(): void {
        const tileMap = this.curTileMap!;
        const layer = tileMap.getLayer("path");
        const size = tileMap.getMapSize();
        this.mapData = GameTools.GetTwoArray(size.height, size.width, 0);
        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                if (this.IsPathAtPoint(layer, x, y)) {
                    this.mapData[y][x] = 1;
                }
            }
        }
        // console.log("mapData:", this.mapData);
        tileMap.node.active = false;
    }
    
    // GetPathPointByStartNodeEndScreen
    public GetPathDDDDDDDDDDDDD(startNode: cc.Node, screenPos: cc.Vec2, parent: cc.Node | null = null): cc.Vec2[] {
        const startPos = this.GetPathPointByNode(startNode);
        const localEnd: cc.Vec2 = GameTools.Screen2CoordPos(screenPos, this.node, this.curCamera);
        const endIdx = this.GetPathPointByLocalPos(localEnd);
        const result: cc.Vec2[] = [];
        const path = PathFind.search(this.mapData, startPos, endIdx);
        const p = parent == null ? startNode.parent : parent;
        if (path) {
            const count = path.length;
            for (let i = 1; i < count - 1; i++) {
                const pt = path[i];
                const local = this.GetLocalPosByIndex(pt.y, pt.x);
                const world = this.node.convertToWorldSpaceAR(local);
                const nodePos = p.convertToNodeSpaceAR(world);
                result.push(nodePos);
            }
            const endPos: cc.Vec2 = GameTools.ConvertTargetPointToCoor(localEnd, this.node, p);
            result.push(endPos);
        }
        else {
            console.log("寻路没有找到路径 可能没有可走的路径 或者起点终点位置一样了 或者位置不在地图上 这里逻辑是在原地");
            console.log("startPos : ", startPos);
            console.log("endPos : ", endIdx);
            result.push(GameTools.ConvertTargetToCurLocal(startNode, p));
        }
        return result;
    }
    public GetPathPointByStartTilPos(startNode: cc.Node, endIdx: cc.Vec2, parent: cc.Node | null = null): cc.Vec2[] {
        const startPos = this.GetPathPointByNode(startNode);
        const result: cc.Vec2[] = [];
        const path = PathFind.search(this.mapData, startPos, endIdx);
        const p = parent == null ? startNode.parent : parent;
        if (path) {
            const count = path.length;
            for (let i = 1; i < count - 1; i++) {
                const pt = path[i];
                const local = this.GetLocalPosByIndex(pt.y, pt.x);
                const world = this.node.convertToWorldSpaceAR(local);
                const nodePos = p.convertToNodeSpaceAR(world);
                result.push(nodePos);
            }
        }
        else {
            // console.log("寻路没有找到路径 可能没有可走的路径 有可能是起点终点位置一样了 或者位置不在地图上 这里逻辑是会直接走向目标点");
            // console.log("startPos : ", startPos);
            // console.log("endPos : ", endIdx);
        }
        const endLocal = this.GetLocalPosByIndex(endIdx.y, endIdx.x);
        const endWorld: cc.Vec2 = GameTools.ConvertTargetPointToCoor(endLocal, this.node, p);
        result.push(endWorld);
        return result;
    }
    public GetLocalPosByIndex(row: number, col: number): cc.Vec2 {
        const x = ((col - row) * this.pointSize.width) / 2;
        const y = -((row + col + 1) * this.pointSize.height) / 2;
        return cc.v2(x, y);
    }
    public GetRandomPath(startNode: cc.Node, parent: cc.Node | null = null): cc.Vec2[] {
        const rows = this.mapData.length;
        const cols = this.mapData[0].length;
        const valid: {
            x: number;
            y: number;
        }[] = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.mapData[i][j] != 0)
                    valid.push({ x: i, y: j });
            }
        }
        const len = valid.length;
        if (len > 0) {
            const pick = valid[Math.floor(Math.random() * len)];
            return this.GetPathPointByStartTilPos(startNode, cc.v2(pick.y, pick.x), parent);
        }
        return [GameTools.ConvertTargetToCurLocal(startNode, parent)];
    }
    public GetIsObstacleByPosNode(pos: cc.Vec2, parent: cc.Node): boolean {
        const local: cc.Vec2 = GameTools.ConvertTargetPointToCoor(pos, parent, this.node);
        const idx = this.GetPathPointByLocalPos(local);
        if (idx.y >= this.mapData.length || idx.x >= this.mapData[0].length) {
            console.log("该点不在地图上！！！！：", pos, parent);
            return true;
        }
        return this.mapData[idx.y][idx.x] == 0;
    }
}
