import { GameInput } from "./GameInput.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { HeroType } from "./enums/HeroType.js";
import { DataService } from "./main.js";
import { Item } from "./models/Item.js";
import { Level } from "./models/Level.js";
export class GameRunner {
    static _instance;
    party = [];
    enemies = [];
    prevLevel = AppInfo.startingLevel - 1;
    currentLevel = AppInfo.startingLevel;
    partyIsDead = false;
    enemiesAreDead = true;
    levels = [];
    level;
    isNextEncounter = true;
    gameOver = true;
    newInstance = true;
    enemiesSlain = 0;
    inventory = [];
    constructor() {
    }
    init() {
        GameInput.get().appendInputField();
    }
    newGame() {
        this.newInstance = false;
        this.party = [];
        this.enemies = [];
        this.prevLevel = AppInfo.startingLevel - 1;
        this.currentLevel = AppInfo.startingLevel;
        this.partyIsDead = false;
        this.enemiesAreDead = true;
        this.levels = [];
        this.level = null;
        this.isNextEncounter = true;
        GameUI.get().removeCharacterInfo();
        this.newParty();
        this.initLevels();
        this.nextEncounter();
        var data = DataService.get().getItems().find(x => x.name == 'Bandage').data;
        this.inventory.push(new Item(data));
        this.inventory.push(new Item(data));
    }
    newParty() {
        this.party = [];
        const tankTypes = DataService.get().getHeroTraits(HeroType.tank);
        const dpsTypes = DataService.get().getHeroTraits(HeroType.dps);
        const supportTypes = DataService.get().getHeroTraits(HeroType.support);
        this.party.push(DataService.get().getHero(HeroType.tank));
        this.party.push(DataService.get().getHero(HeroType.dps));
        this.party.push(DataService.get().getHero(HeroType.dps));
        this.party.push(DataService.get().getHero(HeroType.support));
        for (let hero of this.party) {
            hero.setRandomName();
            GameUI.get().setCharacterInfo(hero);
        }
    }
    initLevels() {
        for (var i = 0; i < AppInfo.numOfLevels; i++) {
            this.levels.push(new Level(i + 1));
        }
    }
    play() {
        this.gameOver = false;
        if (this.checkIfEnemiesAreDead()) {
            this.nextEncounter();
        }
        this.runEncounter();
    }
    nextEncounter() {
        this.isNextEncounter = true;
        this.enemies = [];
        const i = this.currentLevel - 1;
        this.level = this.levels[i];
        this.enemies = this.level.getCurrentEnemies();
        this.enemiesAreDead = false;
        GameUI.get().log('&nbsp');
    }
    runEncounter() {
        if (this.isNewLevel()) {
            this.newLevel();
        }
        if (this.isNextEncounter) {
            this.level.getEncounterText().forEach(x => {
                GameUI.get().log(x, null, 1);
            });
            GameUI.get().log('&nbsp;');
            this.isNextEncounter = false;
        }
        this.checkIfEnemiesAreDead();
        this.checkIfPartyIsDead();
        if (!this.partyIsDead && !this.enemiesAreDead) {
            GameUI.get().log('Party turn.', Color.green);
            GameUI.get().log('&nbsp;');
            const party = this.party.filter(x => !x.isDead);
            for (let hero of party) {
                if (!this.checkIfEnemiesAreDead()) {
                    this.partyTurn(hero);
                }
            }
            if (this.checkIfEnemiesAreDead()) {
                GameUI.get().log('Enemies have been defeated.');
                GameUI.get().log('&nbsp;');
                this.rollForLoot();
                if (!this.level.nextEncounter()) {
                    this.currentLevel++;
                }
            }
        }
        if (!this.enemiesAreDead && !this.partyIsDead) {
            GameUI.get().log('Enemy turn.', Color.red);
            GameUI.get().log('&nbsp;');
            const enemies = this.enemies.filter(x => !x.isDead);
            for (let enemy of enemies) {
                this.enemyTurn(enemy);
            }
            if (this.checkIfEnemiesAreDead()) {
                GameUI.get().log('Enemies have been defeated.');
                GameUI.get().log('&nbsp;');
                this.rollForLoot();
                if (!this.level.nextEncounter()) {
                    this.currentLevel++;
                }
            }
        }
        if (this.enemiesAreDead && this.currentLevel <= AppInfo.numOfLevels) {
            GameUI.get().log('Party is resting...', null, 3);
            GameUI.get().log('&nbsp;', null, 0);
            this.party.filter(x => !x.isDead).forEach(x => {
                x.heal(16);
                x.replenishAp(12);
            });
        }
        else if (!this.partyIsDead && this.currentLevel == AppInfo.numOfLevels + 1) {
            GameUI.get().log('Victory!');
            this.gameOver = true;
        }
        if (!this.checkIfEnemiesAreDead()) {
            if (this.checkIfPartyIsDead() && !this.gameOver) {
                this.gameIsOver();
            }
            else if (!this.gameOver) {
                GameUI.get().log('------ End of Turns ------');
            }
        }
        GameUI.get().log('&nbsp;');
        GameUI.get().printLog();
    }
    newLevel() {
        GameUI.get().log(`------ level: ${this.currentLevel} ------`);
        GameUI.get().log('&nbsp;');
        this.prevLevel = this.currentLevel;
    }
    isNewLevel() {
        return this.currentLevel > this.prevLevel;
    }
    gameIsOver() {
        GameUI.get().log('Your party is dead.', Color.gray);
        this.inventory = [];
        this.gameOver = true;
    }
    partyTurn(hero) {
        GameUI.get().log(`------ ${hero.name} - HP: ${hero.hp} ------`);
        hero.performAction();
        hero.checkStatusEffects();
    }
    enemyTurn(enemy) {
        if (this.checkIfPartyIsDead()) {
            if (!this.gameOver) {
                this.gameIsOver();
            }
        }
        else {
            GameUI.get().log(`------ ${enemy.getNameAndNumber()} - HP: ${enemy.hp} ------`);
            enemy.performAction();
            enemy.checkStatusEffects();
        }
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameRunner();
        return this._instance;
    }
    getTargets(isEnemy) {
        return isEnemy == false ? this.enemies : this.party;
    }
    getRandomTarget(isEnemy) {
        const targets = isEnemy == false ? this.enemies.filter(x => !x.isDead) : this.party.filter(x => !x.isDead);
        if (targets.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * targets.length);
        return targets[i];
    }
    checkIfEnemiesAreDead() {
        return this.enemiesAreDead = this.enemies.filter(x => !x.isDead).length == 0;
    }
    checkIfPartyIsDead() {
        return this.partyIsDead = this.party.filter(x => !x.isDead).length == 0;
    }
    isGameOver() {
        return this.gameOver;
    }
    getRandomIndex(items) {
        return Math.floor(Math.random() * items.length);
    }
    rollForLoot() {
        var loot = [];
        DataService.get().getItems().forEach((item) => {
            let roll = Math.random();
            if (item.rate >= roll) {
                loot.push(item);
            }
        });
        if (loot.length > 0) {
            GameUI.get().log('Enemies have dropped items:', null, 1);
            loot.forEach((item) => {
                GameUI.get().log(`• You recieve ${item.name}`, Color.green, 0);
                this.inventory.push(new Item(item.data));
            });
            GameUI.get().log("Type 'inventory' to access your consumables.", Color.gray, 0);
            GameUI.get().log('&nbsp;', null, 1);
        }
    }
    get uniqueItems() {
        // var items: Item[] = [];
        // this.inventory.forEach((item: Item) => {
        //     if (items.includes(item) == false) {
        //         items.push(item);
        //     }
        // });
        // return items;
        const uniqueItemsMap = new Map();
        this.inventory.forEach((item) => {
            if (!uniqueItemsMap.has(item.name)) {
                uniqueItemsMap.set(item.name, item);
            }
        });
        return Array.from(uniqueItemsMap.values());
    }
}
