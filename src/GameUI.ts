import { GameInput } from "./GameInput.js";
import { GameRunner } from "./GameRunner.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { Character } from "./models/Character.js";
import { Enemy } from "./models/Enemy.js";
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

    public async printLog(helpText?: string) {
        this._isPrinting = true;
        for (let item of this.messLog) {
            this.drawText(item);
            // item.delay
            await this.sleep(item.delay);
        }
        this.messLog = [];
        this.updateCharacterInfo();
        this._isPrinting = false;
        if (helpText != null) {
            GameInput.get().appendInputField(helpText);
        }
        else {
            GameInput.get().appendInputField();
        }
        return false;
    }

    private drawText(item: LogItem) {
        const element = document.createElement('div');
        element.className = "console-mess";
        element.innerHTML = `<span>${item.mess}</span>`
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
        this.log("List of commands: ", null, 0);
        this.log("• new game - Start new game or reset previous.", null, 0);
        this.log("• play - Run next encounter.", null, 0);
        this.log("• party stats - View stats and skills of your party.", null, 0);
        this.log("• enemy stats - View stats and skills of your enemies.", null, 0);
        this.log("• theme 'theme' - Set color palette.", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;Available themes:", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• dark", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• msdos", null, 0);
        this.log("• clear - Clear all log items.", null, 0);
        this.log("• help - List valid commands.", null, 0);
        this.log("• about - App information.", null, 0);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }

    public about() {
        this.log("Dark Descent", null, 0.1);
        this.log(`Version ${AppInfo.version}`, null, 0.1);
        this.log("Made By Fabian Tjernström", null, 0.1);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }

    public intro() {
        GameUI.get().log("The dungeon door groans open, revealing an abyss of oppressive darkness.", null, 3)
        GameUI.get().log("A stale, damp odor hangs in the air, a foreboding reminder of the many who have met their doom within these lightless catacombs.", null, 3)
        GameUI.get().log("As you breach the threshold, a weighty shadow encases your senses, wrapping you in a stifling embrace.", null, 3)
        GameUI.get().log("You begin your descent into the darkness.", null, 3)
        GameUI.get().log("&nbsp;")
    }

    public title() {
        this.log("<pre> ▄▀▀█▄▄   ▄▀▀█▄   ▄▀▀▄▀▀▀▄  ▄▀▀▄ █      ▄▀▀█▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▀▀▄  ▄▀▄▄▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▄ ▀▄  ▄▀▀▀█▀▀▄ </pre>")
        this.log("<pre>█ ▄▀   █ ▐ ▄▀ ▀▄ █   █   █ █  █ ▄▀     █ ▄▀   █ ▐  ▄▀   ▐ █ █   ▐ █ █    ▌ ▐  ▄▀   ▐ █  █ █ █ █    █  ▐ </pre>")
        this.log("<pre>▐ █    █   █▄▄▄█ ▐  █▀▀█▀  ▐  █▀▄      ▐ █    █   █▄▄▄▄▄     ▀▄   ▐ █        █▄▄▄▄▄  ▐  █  ▀█ ▐   █     </pre>")
        this.log("<pre>  █    █  ▄▀   █  ▄▀    █    █   █       █    █   █    ▌  ▀▄   █    █        █    ▌    █   █     █      </pre>")
        this.log("<pre> ▄▀▄▄▄▄▀ █   ▄▀  █     █   ▄▀   █       ▄▀▄▄▄▄▀  ▄▀▄▄▄▄    █▀▀▀    ▄▀▄▄▄▄▀  ▄▀▄▄▄▄   ▄▀   █    ▄▀       </pre>")
        this.log("<pre>█     ▐  ▐   ▐   ▐     ▐   █    ▐      █     ▐   █    ▐    ▐      █     ▐   █    ▐   █    ▐   █         </pre>")
        this.log("<pre>▐                          ▐           ▐         ▐                ▐         ▐        ▐        ▐         </pre>")
        this.log("&nbsp;", null, 3)
    }

    public setCharacterInfo(hero: Hero)  {
        document.getElementById('characters').style.display = 'flex'

        const element = document.createElement('div');
        element.id = `${hero.name}`
        element.className = 'char-info';

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
        hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`

        const ap = document.createElement('p');
        ap.id = 'ap';
        ap.style.color = Color.blue;
        ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`

        element.append(name, race, trait, hp, ap)
        document.getElementById('characters').append(element);
    }

    public stats(party: boolean) {

        const characters: Character[] = party ? GameRunner.get().party.filter(x => x) :  GameRunner.get().enemies.filter(x => x);
        if (!characters.some(x => !x.isDead)) {
            if (party) {
                this.log("Your party is dead.");
            } else {
                this.log("All enemies are dead.");
            }
        }
        else {
            for (let character of characters) {
                this.log(`${character.getNameAndNumber()}`);
                this.log(`Health: ${character.hp}/${character.hpMax}`);
                this.log(`Action Ponts: ${character.ap}/${character.apMax}`);
                this.log("Skills:");
                const trait = character.trait;
                trait.skills.forEach(skill => {
                    this.log(`&nbsp;• ${skill.name}`);
                })
                this.log("&nbsp;")
            }

        }
        this.printLog();
    }

    public setMSDosTheme() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'blue');
        root.style.setProperty('--white', 'white');

        this.log("Setting msdos theme.", null, 0);
        this.printLog();
    }

    public setDarkTheme() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'white');

        this.log("Setting dark theme.", null, 0);
        this.printLog();
    }

    public async clearLog() {
        this.log("Clearing log...", null, 0);
        this.printLog();
        await this.sleep(1000)
        this.textbox.innerHTML = "";
        GameInput.get().appendInputField();
    }

    public removeCharacterInfo() {
        const charInfo = document.getElementById('characters');
        charInfo.innerHTML = "";
    }

    public updateCharacterInfo() {
        const party = GameRunner.get().party
        for (let hero of party) {
            const element = document.getElementById(hero.name);
            
            if (!hero.isDead) {
                const hp = element.children.namedItem('hp') as HTMLElement;
                hp.style.color = hero.hp > (hero.hpMax / 2) ? Color.green : Color.red;
                if (hero.hp > (hero.hpMax / 2) && hero.hp < (hero.hpMax / 1.5)) {
                    hp.style.color = Color.orange;
                }
                hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`

                const ap = element.children.namedItem('ap') as HTMLElement;
                ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`
            }
            else {
                for (let child of element.children) {
                    if (child.id) {
                        const stat = element.children.namedItem(child.id) as HTMLElement;
                        stat.style.color = Color.gray;
                    }
                }
            }
        }
    }

    private isOverflown() {
        return this.textbox.scrollHeight > this.textbox.offsetHeight;
    }

    public sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}