export class GameUI {
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameUI();
        return this._instance;
    }
    drawString(mess) {
        const element = document.createElement('div');
        element.className = "console-mess";
        const content = document.createTextNode(mess);
        element.appendChild(content);
        document.body.appendChild(element);
        window.scrollTo(0, document.body.scrollHeight);
    }
}
