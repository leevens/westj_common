export default class UIClass {
    public panelUI: any;
    public panelName: string;
    constructor(panelName: string, panelUI: any) {
        this.panelName = panelName;
        this.panelUI = panelUI;
    }
}
