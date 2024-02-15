import { GameInput } from "./GameInput.js";
import { GameRunner } from "./GameRunner.js";
import { Color } from "./enums/Color.js";
import { Hero } from "./models/Hero.js";

export class LogItem {
    mess: string;
    color: string;
    delay: number;

    constructor(mess: string, color?: string, delay?: number) {
        this.mess = mess; 
        this.color = color ? color : Color.white; 
        this.delay = delay ? delay * 1000 : 60;
    }
}

export class GameUI {
    private static _instance: GameUI;
    private textbox: HTMLElement = document.getElementById('console');
    private messLog: LogItem[] = [];
    private _isPrinting: boolean = false;

    static get() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new GameUI();
        return this._instance;
    }

    public isPrinting(): boolean {
        return this._isPrinting;
    }

    public log(mess: string, color?: string, seconds?: number): void {
        this.messLog.push(new LogItem(mess, color, seconds))
    }

    public async printLog() {
        this._isPrinting = true;
        for (let item of this.messLog) {
            this.drawText(item);
            await this.sleep(item.delay);
        }
        this.messLog = [];
        this.updateCharacterInfo();
        this._isPrinting = false;
        GameInput.get().appendInputField();
        return false;
    }

    private drawText(item: LogItem) {
        const element = document.createElement('div');
        element.className = "console-mess";
        element.innerHTML = `<b>${item.mess}</b>`
        element.style.color = item.color;
        this.textbox.append(element);
        if (this.isOverflown()) {
            this.textbox.removeChild(this.textbox.firstChild);
        }
        this.scrollToBottom();
    }

    public scrollToBottom() {
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }

    public listCommands() {
        this.log("List of commands: ", null, 0.1);
        this.log("'play' - Run next encounter", null, 0.1);
        this.log("'help' - List valid commands", null, 0.1);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }

    public setCharacterInfo(hero: Hero)  {
        const element = document.createElement('div');
        element.id = `${hero.name}`

        const name = document.createElement('p');
        name.id = 'name';
        name.style.color = Color.white;
        name.innerHTML = `Name:&nbsp;${hero.name}`

        const race = document.createElement('p');
        race.id = 'race';
        race.style.color = Color.white;
        race.innerHTML = `Race:&nbsp;${hero.race}`

        const trait = document.createElement('p');
        trait.id = 'trait';
        trait.style.color = Color.white;
        trait.innerHTML = `Trait:&nbsp;${hero.trait.name}`

        const hp = document.createElement('p');
        hp.id = 'hp';
        hp.style.color = Color.green;
        hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}hp`

        const ap = document.createElement('p');
        ap.id = 'ap';
        ap.style.color = Color.blue;
        ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`

        const hr = document.createElement('hr');

        element.append(name, race, trait, hp, ap, hr)
        document.getElementById('characters').append(element);
    }

    public updateCharacterInfo() {
        const party = GameRunner.get().party
        for (let hero of party) {
            const element = document.getElementById(hero.name);
            
            const hp = element.children.namedItem('hp') as HTMLElement;
            hp.style.color = hero.hp > hero.hpMax / 2 ? Color.green : Color.red;
            hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}hp`

            const ap = element.children.namedItem('ap') as HTMLElement;
            ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`
        }
    }

    private isOverflown() {
        return this.textbox.scrollHeight > this.textbox.offsetHeight;
    }

    public sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}