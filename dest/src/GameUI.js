var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameRunner } from "./GameRunner.js";
import { Color } from "./enums/Color.js";
export class LogItem {
    constructor(mess, color, delay) {
        this.mess = mess;
        this.color = color ? color : Color.white;
        this.delay = delay ? delay * 1000 : 100;
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
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }
    setCharacterInfo(hero) {
        const element = document.createElement('div');
        element.id = `${hero.name}`;
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
        hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}hp`;
        const ap = document.createElement('p');
        ap.id = 'ap';
        ap.style.color = Color.blue;
        ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`;
        const hr = document.createElement('hr');
        element.append(name, race, trait, hp, ap, hr);
        document.getElementById('characters').append(element);
    }
    updateCharacterInfo() {
        const party = GameRunner.get().party;
        for (let hero of party) {
            const element = document.getElementById(hero.name);
            const hp = element.children.namedItem('hp');
            hp.style.color = hero.hp > hero.hpMax / 2 ? Color.green : Color.red;
            hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}hp`;
            const ap = element.children.namedItem('ap');
            ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`;
        }
    }
    isOverflown() {
        return this.textbox.scrollHeight > this.textbox.offsetHeight;
    }
    updateInput(text) {
        document.getElementById('input').innerHTML = text;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
