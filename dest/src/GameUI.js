var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameInput } from "./GameInput.js";
import { GameRunner } from "./GameRunner.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
export class LogItem {
    constructor(mess, color, delay) {
        this.mess = mess;
        this.color = color ? color : Color.white;
        this.delay = delay ? delay * 1000 : 60;
    }
}
export class GameUI {
    constructor() {
        this.textbox = document.getElementById('console');
        this.messLog = [];
        this._isPrinting = false;
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameUI();
        return this._instance;
    }
    isPrinting() {
        return this._isPrinting;
    }
    log(mess, color, seconds) {
        this.messLog.push(new LogItem(mess, color, seconds));
    }
    printLog() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isPrinting = true;
            for (let item of this.messLog) {
                this.drawText(item);
                yield this.sleep(item.delay);
            }
            this.messLog = [];
            this.updateCharacterInfo();
            this._isPrinting = false;
            GameInput.get().appendInputField();
            return false;
        });
    }
    drawText(item) {
        const element = document.createElement('div');
        element.className = "console-mess";
        element.innerHTML = `<b>${item.mess}</b>`;
        element.style.color = item.color;
        this.textbox.append(element);
        if (this.isOverflown()) {
            this.textbox.removeChild(this.textbox.firstChild);
        }
        this.scrollToBottom();
    }
    scrollToBottom() {
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }
    listCommands() {
        this.log("List of commands: ", null, 0.1);
        this.log("'play' - Run next encounter", null, 0.1);
        this.log("'help' - List valid commands", null, 0.1);
        this.log("'about' - App information", null, 0.1);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }
    about() {
        this.log("Dark Descent", null, 0.1);
        this.log(`Version ${AppInfo.version}`, null, 0.1);
        this.log("Made By Fabian Tjernström", null, 0.1);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }
    setCharacterInfo(hero) {
        const element = document.createElement('div');
        element.id = `${hero.name}`;
        element.className = 'char-info';
        const name = document.createElement('p');
        name.id = 'name';
        name.style.color = Color.white;
        name.innerHTML = `Name:&nbsp;${hero.name}`;
        const race = document.createElement('p');
        race.id = 'race';
        race.style.color = Color.white;
        race.innerHTML = `Race:&nbsp;${hero.race}`;
        const trait = document.createElement('p');
        trait.id = 'trait';
        trait.style.color = Color.white;
        trait.innerHTML = `Trait:&nbsp;${hero.trait.name}`;
        const hp = document.createElement('p');
        hp.id = 'hp';
        hp.style.color = Color.green;
        hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`;
        const ap = document.createElement('p');
        ap.id = 'ap';
        ap.style.color = Color.blue;
        ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`;
        element.append(name, race, trait, hp, ap);
        document.getElementById('characters').append(element);
    }
    updateCharacterInfo() {
        const party = GameRunner.get().party;
        for (let hero of party) {
            const element = document.getElementById(hero.name);
            if (!hero.isDead) {
                const hp = element.children.namedItem('hp');
                hp.style.color = hero.hp > (hero.hpMax / 2) ? Color.green : Color.red;
                if (hero.hp > (hero.hpMax / 2) && hero.hp < (hero.hpMax / 1.5)) {
                    hp.style.color = Color.orange;
                }
                hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`;
                const ap = element.children.namedItem('ap');
                ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`;
            }
            else {
                for (let child of element.children) {
                    if (child.id) {
                        const stat = element.children.namedItem(child.id);
                        stat.style.color = Color.gray;
                    }
                }
            }
        }
    }
    isOverflown() {
        return this.textbox.scrollHeight > this.textbox.offsetHeight;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
