import { GameInput } from "./GameInput.js";
import { GameRunner } from "./GameRunner.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { Character } from "./models/Character.js";
import { Enemy } from "./models/Enemy.js";
import { Hero } from "./models/Hero.js";
import { Item } from "./models/Item.js";

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
            var delay = Number(AppInfo.noDelay) == 1 ? 0 : item.delay;
            await this.sleep(delay);
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
        if (this.textbox.childElementCount > 100) {
            this.textbox.removeChild(this.textbox.firstChild);
        }
        this.scrollToBottom();
    }

    public scrollToBottom() {
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }

    public printGameStats() {
        if (GameRunner.get().party.length == 0) {
            this.log("Type 'new game' to start a new game.", null, 0);
            this.log("&nbsp;", null, 0);
            this.printLog();
            return;
        }
        this.log('Current game', null, 0);
        this.log(`• Level: ${GameRunner.get().currentLevel}`, null, 0);
        this.log(`• Enemies slain: ${GameRunner.get().enemiesSlain}`, null, 0);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }

    public listCommands() {
        this.log("List of commands: ", null, 0);
        this.log("• new game - Start new game or reset previous.", null, 0);
        this.log("• play - Run next encounter.", null, 0);
        this.log("• party stats - View stats and skills of your party.", null, 0);
        this.log("• enemy stats - View stats and skills of your enemies.", null, 0);
        this.log("• game stats - View information about your current game.", null, 0);
        this.log("• theme 'theme' - Set color palette.", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;Available themes:", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• dark", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• msdos", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• matrix", null, 0);
        this.log("&nbsp;&nbsp;&nbsp;• blood", null, 0);
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
        GameUI.get().log("The dungeon door groans open, revealing an abyss of oppressive darkness.")
        GameUI.get().log("A stale, damp odor hangs in the air, a foreboding reminder of the many who have met their doom within these lightless catacombs.")
        GameUI.get().log("As you breach the threshold, a weighty shadow encases your senses, wrapping you in a stifling embrace.")
        GameUI.get().log("You begin your descent into the darkness.")
        GameUI.get().log("&nbsp;", null, 4)
    }

    public title() {
        this.log("<pre> ▄▀▀█▄▄   ▄▀▀█▄   ▄▀▀▄▀▀▀▄  ▄▀▀▄ █      ▄▀▀█▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▀▀▄  ▄▀▄▄▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▄ ▀▄  ▄▀▀▀█▀▀▄ </pre>")
        this.log("<pre>█ ▄▀   █ ▐ ▄▀ ▀▄ █   █   █ █  █ ▄▀     █ ▄▀   █ ▐  ▄▀   ▐ █ █   ▐ █ █    ▌ ▐  ▄▀   ▐ █  █ █ █ █    █  ▐ </pre>")
        this.log("<pre>▐ █    █   █▄▄▄█ ▐  █▀▀█▀  ▐  █▀▄      ▐ █    █   █▄▄▄▄▄     ▀▄   ▐ █        █▄▄▄▄▄  ▐  █  ▀█ ▐   █     </pre>")
        this.log("<pre>  █    █  ▄▀   █  ▄▀    █    █   █       █    █   █    ▌  ▀▄   █    █        █    ▌    █   █     █      </pre>")
        this.log("<pre> ▄▀▄▄▄▄▀ █   ▄▀  █     █   ▄▀   █       ▄▀▄▄▄▄▀  ▄▀▄▄▄▄    █▀▀▀    ▄▀▄▄▄▄▀  ▄▀▄▄▄▄   ▄▀   █    ▄▀       </pre>")
        this.log("<pre>█     ▐  ▐   ▐   ▐     ▐   █    ▐      █     ▐   █    ▐    ▐      █     ▐   █    ▐   █    ▐   █         </pre>")
        this.log("<pre>▐                          ▐           ▐         ▐                ▐         ▐        ▐        ▐         </pre>")
        this.log("&nbsp;", null, 2)
    }

    public inventory() {
        if (GameRunner.get().inventory.length == 0) {
            this.log("You have no items in your inventory.", null, 0);
            this.log("&nbsp;", null, 0);
            this.printLog();
            return;
        }
        this.log("Your Inventory:", null, 0);
        var printedItems: string[] = [];
        GameRunner.get().inventory.forEach((item: Item) => {
            if (printedItems.includes(item.name)) {
                return;
            }
            let num = GameRunner.get().inventory.filter(i => i.name == item.name).length;
            this.log(`• ${item.name} - ${item.description} ${num}x`, null, 0);
            printedItems.push(item.name);
        })
        this.log("Type 'use [item name]' to use an item.", Color.gray, 0);
        this.log("&nbsp;", null, 0);
        this.printLog();
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
        if (GameRunner.get().party.length == 0) {
            this.log("Type 'new game' to start a new game.", null, 0);
            this.log("&nbsp;", null, 0);
            this.printLog();
            return;
        }

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
                this.log(`Action Points: ${character.ap}/${character.apMax}`);
                this.log("Skills:");
                const trait = character.trait;
                trait.skills.forEach(skill => {
                    this.log(`&nbsp;• ${skill.name}`);
                })
                this.log("Status Effects:");
                if (character.statusEffects.length == 0) {
                    this.log(`&nbsp;• None`);
                }
                else {
                    for (let effect of character.statusEffects) {
                        if (effect.isBuff) {
                            this.log(`&nbsp;▲ ${effect.name}, +${effect.amount}hp for ${effect.turnsLeft}/${effect.turns} turns.`, Color.green);
                        }
                        else {
                            this.log(`&nbsp;▼ ${effect.name}, -${effect.amount}hp for ${effect.turnsLeft}/${effect.turns} turns.`, Color.red);
                        }
                        
                    }
                }
                this.log("&nbsp;")
            }

        }
        this.printLog();
    }

    public setMSDosTheme() {
        this.setDefaultStyle();
        const root = document.documentElement;
        root.style.setProperty('--black', 'blue');
        root.style.setProperty('--white', 'white');

        this.log("Setting msdos theme.", null, 0);
        this.printLog();
    }

    public setDarkTheme() {
        this.setDefaultStyle();
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'white');

        this.log("Setting dark theme.", null, 0);
        this.printLog();
    }

    public setMatrixTheme() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'lime');
        root.style.setProperty('--green', 'lime');
        root.style.setProperty('--blue', 'lime');
        root.style.setProperty('--red', 'lime');
        root.style.setProperty('--orange', 'lime');
        root.style.setProperty('--gray', 'green');

        this.log("Setting matrix theme.", null, 0);
        this.printLog();
    }

    public setBloodTheme() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'red');
        root.style.setProperty('--green', 'red');
        root.style.setProperty('--blue', 'red');
        root.style.setProperty('--red', 'red');
        root.style.setProperty('--orange', 'red');
        root.style.setProperty('--gray', 'maroon');

        this.log("Setting blood theme.", null, 0);
        this.printLog();
    }

    public setDefaultStyle() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'white');
        root.style.setProperty('--green', 'limegreen');
        root.style.setProperty('--blue', 'skyblue');
        root.style.setProperty('--red', 'red');
        root.style.setProperty('--orange', 'orange');
        root.style.setProperty('--gray', 'dimgray');
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
            
            const hp = element.children.namedItem('hp') as HTMLElement;
            hp.style.color = hero.hp > (hero.hpMax / 2) ? Color.green : Color.red;
            if (hero.hp > (hero.hpMax / 2) && hero.hp < (hero.hpMax / 1.5)) {
                hp.style.color = Color.orange;
            }
            hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`

            const ap = element.children.namedItem('ap') as HTMLElement;
            ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`

            if (hero.isDead) {
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