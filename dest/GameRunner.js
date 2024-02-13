import { GameUI } from "./GameUI.js";
import { DataService } from "./main.js";
export class GameRunner {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.level = 0;
        this.partyIsDead = false;
        this.enemiesAreDead = true;
    }
    init() {
        this.party = DataService.get().getHeroes();
        this.newEncounter();
    }
    play() {
        if (this.checkIfEnemiesAreDead()) {
            this.newEncounter();
        }
        this.runEncounter();
    }
    newEncounter() {
        this.enemies = [];
        this.randomEncounter();
    }
    randomEncounter() {
        const enemies = DataService.get().getEnemies();
        for (var n = 0; n < 4; n++) {
            const i = this.getRandomIndex(enemies);
            this.enemies.push(enemies[i]);
        }
        this.enemiesAreDead = false;
    }
    runEncounter() {
        this.checkIfEnemiesAreDead();
        this.checkIfPartyIsDead();
        if (!this.partyIsDead && !this.enemiesAreDead) {
            GameUI.get().log('Player turn.');
            const party = this.party.filter(x => !x.isDead);
            for (let hero of party) {
                this.partyTurn(hero);
            }
        }
        if (!this.enemiesAreDead && !this.partyIsDead) {
            GameUI.get().log('Enemy turn.');
            const enemies = this.enemies.filter(x => !x.isDead);
            for (let enemy of enemies) {
                this.enemyTurn(enemy);
            }
        }
        // if (!this.enemiesAreDead && !this.partyIsDead) {
        //     this.runEncounter();
        // }
        if (this.enemiesAreDead && this.level < 11) {
            GameUI.get().log('Having a break...');
            this.party.filter(x => !x.isDead).forEach(x => {
                x.heal(10);
            });
            GameUI.get().log(`------ <b style="color: red">level:' ${this.level}</b> '------`);
            this.level++;
        }
        else if (!this.partyIsDead && this.level == 11) {
            GameUI.get().log('Victory!');
        }
        GameUI.get().printLog();
    }
    partyTurn(hero) {
        if (this.checkIfEnemiesAreDead()) {
            GameUI.get().log('Enemies have been defeated.');
        }
        else {
            GameUI.get().log(`------ ${hero.name} - HP: ${hero.hp} ------`);
            hero.performAction();
            if (this.enemiesAreDead) {
                GameUI.get().log('Enemies have been defeated.');
            }
        }
    }
    enemyTurn(enemy) {
        if (this.checkIfPartyIsDead()) {
            GameUI.get().log('Your party is dead.');
        }
        else {
            GameUI.get().log(`------ ${enemy.name} - HP: ${enemy.hp} ------`);
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
    getRandomIndex(items) {
        return Math.floor(Math.random() * items.length);
    }
}
