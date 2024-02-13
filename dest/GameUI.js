var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GameUI {
    constructor() {
        this.textbox = document.getElementById('console');
        this.messLog = [];
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameUI();
        return this._instance;
    }
    log(mess) {
        this.messLog.push(mess);
    }
    printLog() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let mess of this.messLog) {
                yield this.sleep(100);
                this.drawText(mess);
            }
            this.messLog = [];
            return false;
        });
    }
    drawText(mess) {
        const element = document.createElement('div');
        element.className = "console-mess";
        element.innerHTML = mess;
        this.textbox.append(element);
        if (this.isOverflown()) {
            this.textbox.removeChild(this.textbox.firstChild);
        }
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }
    isOverflown() {
        return this.textbox.scrollHeight > this.textbox.offsetHeight;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
