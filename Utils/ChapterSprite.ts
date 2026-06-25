import SceneDataManager from "SceneDataManager";
import { EventConst } from "EventConst";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ChapterSprite extends cc.Component {
    @property(cc.Label)
    public chapterNum: cc.Label | null = null;
    @property(cc.Label)
    public placeName: cc.Label | null = null;
    @property(cc.Node)
    public chapter: cc.Node | null = null;
    @property(sp.Skeleton)
    public Sp: sp.Skeleton | null = null;
    @property(cc.Label)
    public chapterName: cc.Label | null = null;
    public async playPlace(callback?: () => void): Promise<void> {
        this.Sp.node.active = true;
        this.Sp.setAnimation(0, "changjing", false);
        const role = await SceneDataManager.Instance.GetRole();
        this.placeName.string = "" + role.name;
        this.placeName.node.active = true;
        this.placeName.node.opacity = 0;
        this.placeName.node.x = 600;
        cc.tween(this.placeName.node).to(0.1, { x: 0 }).start();
        cc.tween(this.placeName.node).to(0.1, { opacity: 255 }).start();
        cc.tween(this.placeName.node).delay(1.7).to(0.3, { x: -600, opacity: 0 }).call(() => {
            this.placeName.node.active = false;
            this.Sp.node.active = false;
            if (callback)
                callback();
        }).start();
    }
    // ---- chapter animation (synchronous tween) --------------------------------
    public playChapter(data: any): void {
        this.Sp.node.active = true;
        this.Sp.setAnimation(0, "zhangjie", false);
        this.chapter.active = true;
        this.chapter.opacity = 0;
        this.chapter.x = 600;
        if (data) {
            this.chapterNum.string = "第" + this.numberToChinese(data.id) + "章";
            this.chapterName.string = "" + data.chapter;
        }
        cc.tween(this.chapter).to(0.1, { x: 0 }).start();
        cc.tween(this.chapter).to(0.1, { opacity: 255 }).start();
        cc.tween(this.chapter).delay(1.65).to(0.3, { x: -600 }).call(() => {
            this.Sp.node.active = false;
            this.chapter.active = false;
        }).start();
    }
    /**
     * 阿拉伯数字 转 中文数字串
     * @param {number|string} num - 要转换的数字（整数）
     * @returns {string} 中文数字字符串
     */
    public numberToChinese(num) {
        // 1. 基础定义
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆'];
        // 2. 处理输入与边界
        if (num === '' || num === null || num === undefined)
            return '零';
        num = Number(num);
        if (isNaN(num))
            return '零';
        if (num === 0)
            return '零';
        // 3. 处理负数
        let isNegative = false;
        if (num < 0) {
            isNegative = true;
            num = Math.abs(num);
        }
        // 4. 数字转数组并反转（从低位往高位处理）
        const numArr = num.toString().split('').map(Number).reverse();
        // 5. 逐位转换
        let result = '';
        let lastIsZero = true; // 标记上一位是否为0，用于合并连续零
        for (let i = 0; i < numArr.length; i++) {
            const n = numArr[i];
            const unit = units[i];
            if (n === 0) {
                // 当前位是0：只加一个零，且不重复
                if (!lastIsZero) {
                    result = '零' + result;
                    lastIsZero = true;
                }
            }
            else {
                // 当前位非0：拼接数字 + 单位
                result = digits[n] + unit + result;
                lastIsZero = false;
            }
        }
        // 6. 特殊规则：10 → 十，不是 一十
        result = result.replace(/^一十/, '十');
        // 7. 加负号
        if (isNegative)
            result = '负' + result;
        return result;
    }
    // public str: string[] = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    // ---- lifecycle -----------------------------------------------------------
    protected onLoad(): void {
        cc.systemEvent.on(EventConst.playChapter, this.playChapter, this);
        cc.systemEvent.on(EventConst.playPlace, this.playPlace, this);
        this.chapter.active = false;
        this.placeName.node.active = false;
        this.Sp.node.active = false;
    }
    protected start(): void { }
    getChapterNum() {
        // str 转换1234数字为中文一二三四
    }
}
