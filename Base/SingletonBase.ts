const { ccclass } = cc._decorator;
@ccclass
export default class SingletonBase extends cc.Component {
    public get CurLocalData(): any {
        if (this.curLocalData == null)
            this.InitLocalDataValue();
        return this.curLocalData;
    }
    public set CurLocalData(value: any) {
        this.curLocalData = value;
    }
    public curLocalData: any = null;
    public isNeedUpdateLocal: boolean = false;
    public LOCAL_DATA_KEY: string = "Test";
    public UpdateCurData(data: any): void {
        this.CurLocalData = data;
    }
    public InitLocalDataValue(): void {
        if (this.LOCAL_DATA_KEY == "Test") {
            console.log("没有设置本地存档的key值！！！！！");
        }
        this.CurLocalData = {};
    }
    public GetLocalDataByKey(key: string, defaultVal?: any): any {
        const val = this.CurLocalData[key];
        return (val === undefined || val == null) ? defaultVal : val;
    }
    public SetLocalDataKeyValue(key: string, value: any, saveNow: boolean = true, _flag: boolean = true): void {
        this.CurLocalData[key] = value;
        if (saveNow) {
            this.SaveLocalData();
        }
        else {
            this.isNeedUpdateLocal = true;
        }
    }
    public SaveLocalData(): void {
        this.isNeedUpdateLocal = false;
    }
    public async Init(): Promise<void> { }
}
