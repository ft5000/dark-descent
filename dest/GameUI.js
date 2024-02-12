export class GameUI {
    constructor() {
        this.console = document.getElementById('console');
        this.messages = [];
    }
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
        this.messages.push(element);
        element.appendChild(content);
        if (this.isOverflown()) {
            this.console.removeChild(this.console.firstChild);
        }
        // if (this.console.childNodes?.length > 128) {
        //     this.console.removeChild(this.console.firstChild);
        // }
        this.console.append(element);
        this.console.scrollTo(0, this.console.scrollHeight);
    }
    isOverflown() {
        return this.console.scrollHeight > this.console.offsetHeight;
    }
}
