/**
 * Singleton - 单例管理器工具类
 * 用于将管理器组件挂载到名为"Manager"的共享节点上
 */
const { ccclass } = cc._decorator;
@ccclass
export default class Singleton {
    /** 管理器根节点缓存 */
    public static rootNode: cc.Node | null = null;
    /**
     * 将指定组件注册为单例并挂载到管理器根节点
     * @param compClass 组件类或组件名称
     * @returns 组件实例
     */
    public static RegistSingleTon<T extends cc.Component>(compClass: {
        new (): T;
    } | string): T | undefined {
        const root = this.GetManagerRoot();
        let inst: T | undefined;
        try {
            inst = root.addComponent(compClass as any) as T;
        }
        catch (err) {
            console.log("manager名字错误 不存在对应的脚本" + compClass);
        }
        return inst;
    }
    /**
     * 懒加载获取管理器根节点
     * @returns 管理器根节点
     */
    public static GetManagerRoot(): cc.Node {
        if (!this.rootNode) {
            this.rootNode = cc.find("Manager");
        }
        return this.rootNode as cc.Node;
    }
}
