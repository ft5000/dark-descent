import { GameInput } from "./GameInput.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { HeroType } from "./enums/HeroType.js";
import { DataService } from "./main.js";
import { Level } from "./models/Level.js";
export class GameRunner {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.prevLevel = AppInfo.startingLevel - 1;
        this.currentLevel = AppInfo.startingLevel;
        this.partyIsDead = false;
        this.enemiesAreDead = true;
        this.levels = [];
        this.isnextEncounter = true;
        this.gameOver = true;
    }
    init() {
        GameInput.get().appendInputField();
    }
    newGame() {
        this.party = [];
        this.enemies = [];
        this.prevLevel = AppInfo.startingLevel - 1;
        this.currentLevel = AppInfo.startingLevel;
        this.partyIsDead = false;
        this.enemiesAreDead = true;
        this.levels = [];
        this.level = null;
        this.isnextEncounter = true;
        GameUI.get().removeCharacterInfo();
        this.newParty();
        this.initLevels();
        this.nextEncounter();
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
        this.isnextEncounter = true;
        this.enemies = [];
        const i = this.currentLevel - 1;
        this.level = this.levels[i];
        this.enemies = this.level.getCurrentEnemies();
        GameUI.get().log('&nbsp');
    }
    runEncounter() {
        if (this.isNewLevel()) {
            this.newLevel();
        }
        if (this.isnextEncounter) {
            this.level.getEncounterText().forEach(x => {
                GameUI.get().log(x, null, 1);
            });
            GameUI.get().log('&nbsp;');
            this.isnextEncounter = false;
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
            console.log(this.gameOver);
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
        GameUI.get().log('Your party is dead.', 'darkgrey');
        this.gameOver = true;
    }
    partyTurn(hero) {
        GameUI.get().log(`------ ${hero.name} - HP: ${hero.hp} ------`);
        hero.performAction();
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
        return this.enemiesAreDead = !this.enemies.some(x => !x.isDead);
    }
    checkIfPartyIsDead() {
        return this.partyIsDead = !this.party.some(x => !x.isDead);
    }
    isGameOver() {
        return this.gameOver;
    }
    getRandomIndex(items) {
        return Math.floor(Math.random() * items.length);
    }
}
