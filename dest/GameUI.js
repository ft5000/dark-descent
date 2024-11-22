import { GameInput } from "./GameInput.js";
import { GameRunner } from "./GameRunner.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
export class LogItem {
    mess;
    color;
    delay;
    constructor(mess, color, delay) {
        this.mess = mess;
        this.color = color ? color : Color.white;
        this.delay = delay ? delay * 1000 : 60;
    }
}
export class GameUI {
    static _instance;
    textbox = document.getElementById('console');
    messLog = [];
    _isPrinting = false;
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
    async printLog(helpText) {
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
    drawText(item) {
        const element = document.createElement('div');
        element.className = "console-mess";
        element.innerHTML = `<span>${item.mess}</span>`;
        element.style.color = item.color;
        this.textbox.append(element);
        if (this.textbox.childElementCount > 100) {
            this.textbox.removeChild(this.textbox.firstChild);
        }
        this.scrollToBottom();
    }
    scrollToBottom() {
        this.textbox.scrollTo(0, this.textbox.scrollHeight);
    }
    printGameStats() {
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
    listCommands() {
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
    about() {
        this.log("Dark Descent", null, 0.1);
        this.log(`Version ${AppInfo.version}`, null, 0.1);
        this.log("Made By Fabian Tjernström", null, 0.1);
        this.log("&nbsp;", null, 0);
        this.printLog();
    }
    intro() {
        GameUI.get().log("The dungeon door groans open, revealing an abyss of oppressive darkness.");
        GameUI.get().log("A stale, damp odor hangs in the air, a foreboding reminder of the many who have met their doom within these lightless catacombs.");
        GameUI.get().log("As you breach the threshold, a weighty shadow encases your senses, wrapping you in a stifling embrace.");
        GameUI.get().log("You begin your descent into the darkness.");
        GameUI.get().log("&nbsp;", null, 4);
    }
    title() {
        this.log("<pre> ▄▀▀█▄▄   ▄▀▀█▄   ▄▀▀▄▀▀▀▄  ▄▀▀▄ █      ▄▀▀█▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▀▀▄  ▄▀▄▄▄▄   ▄▀▀█▄▄▄▄  ▄▀▀▄ ▀▄  ▄▀▀▀█▀▀▄ </pre>");
        this.log("<pre>█ ▄▀   █ ▐ ▄▀ ▀▄ █   █   █ █  █ ▄▀     █ ▄▀   █ ▐  ▄▀   ▐ █ █   ▐ █ █    ▌ ▐  ▄▀   ▐ █  █ █ █ █    █  ▐ </pre>");
        this.log("<pre>▐ █    █   █▄▄▄█ ▐  █▀▀█▀  ▐  █▀▄      ▐ █    █   █▄▄▄▄▄     ▀▄   ▐ █        █▄▄▄▄▄  ▐  █  ▀█ ▐   █     </pre>");
        this.log("<pre>  █    █  ▄▀   █  ▄▀    █    █   █       █    █   █    ▌  ▀▄   █    █        █    ▌    █   █     █      </pre>");
        this.log("<pre> ▄▀▄▄▄▄▀ █   ▄▀  █     █   ▄▀   █       ▄▀▄▄▄▄▀  ▄▀▄▄▄▄    █▀▀▀    ▄▀▄▄▄▄▀  ▄▀▄▄▄▄   ▄▀   █    ▄▀       </pre>");
        this.log("<pre>█     ▐  ▐   ▐   ▐     ▐   █    ▐      █     ▐   █    ▐    ▐      █     ▐   █    ▐   █    ▐   █         </pre>");
        this.log("<pre>▐                          ▐           ▐         ▐                ▐         ▐        ▐        ▐         </pre>");
        this.log("&nbsp;", null, 2);
    }
    setCharacterInfo(hero) {
        document.getElementById('characters').style.display = 'flex';
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
    stats(party) {
        if (GameRunner.get().party.length == 0) {
            this.log("Type 'new game' to start a new game.", null, 0);
            this.log("&nbsp;", null, 0);
            this.printLog();
            return;
        }
        const characters = party ? GameRunner.get().party.filter(x => x) : GameRunner.get().enemies.filter(x => x);
        if (!characters.some(x => !x.isDead)) {
            if (party) {
                this.log("Your party is dead.");
            }
            else {
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
                });
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
                this.log("&nbsp;");
            }
        }
        this.printLog();
    }
    setMSDosTheme() {
        this.setDefaultStyle();
        const root = document.documentElement;
        root.style.setProperty('--black', 'blue');
        root.style.setProperty('--white', 'white');
        this.log("Setting msdos theme.", null, 0);
        this.printLog();
    }
    setDarkTheme() {
        this.setDefaultStyle();
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'white');
        this.log("Setting dark theme.", null, 0);
        this.printLog();
    }
    setMatrixTheme() {
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
    setBloodTheme() {
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
    setDefaultStyle() {
        const root = document.documentElement;
        root.style.setProperty('--black', 'black');
        root.style.setProperty('--white', 'white');
        root.style.setProperty('--green', 'limegreen');
        root.style.setProperty('--blue', 'skyblue');
        root.style.setProperty('--red', 'red');
        root.style.setProperty('--orange', 'orange');
        root.style.setProperty('--gray', 'dimgray');
    }
    async clearLog() {
        this.log("Clearing log...", null, 0);
        this.printLog();
        await this.sleep(1000);
        this.textbox.innerHTML = "";
        GameInput.get().appendInputField();
    }
    removeCharacterInfo() {
        const charInfo = document.getElementById('characters');
        charInfo.innerHTML = "";
    }
    updateCharacterInfo() {
        const party = GameRunner.get().party;
        for (let hero of party) {
            const element = document.getElementById(hero.name);
            const hp = element.children.namedItem('hp');
            hp.style.color = hero.hp > (hero.hpMax / 2) ? Color.green : Color.red;
            if (hero.hp > (hero.hpMax / 2) && hero.hp < (hero.hpMax / 1.5)) {
                hp.style.color = Color.orange;
            }
            hp.innerHTML = `Health:&nbsp;${hero.hp}/${hero.hpMax}`;
            const ap = element.children.namedItem('ap');
            ap.innerHTML = `Action Points:&nbsp;${hero.ap}/${hero.apMax}`;
            if (hero.isDead) {
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
