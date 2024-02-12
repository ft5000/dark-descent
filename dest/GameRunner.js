var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameUI } from "./GameUI.js";
import { DataService } from "./main.js";
export class GameRunner {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.level = 0;
        this.partyIsDead = false;
        this.enemiesAreDead = true;
        this.delay = 1;
    }
    init() {
        this.party = DataService.get().getHeroes();
    }
    newEncounter() {
        this.enemies = [];
        for (var i = 0; i < 2; i++) {
            var archer = DataService.get().getEnemies()[0];
            var demon = DataService.get().getEnemies()[3];
            var wizard = DataService.get().getEnemies()[2];
            var rogue = DataService.get().getEnemies()[2];
            archer.numberEnemy(i + 1);
            wizard.numberEnemy(i + 1);
            demon.numberEnemy(i + 1);
            rogue.numberEnemy(i + 1);
            this.enemies.push(archer);
            this.enemies.push(demon);
            this.enemies.push(wizard);
            this.enemies.push(rogue);
        }
        this.enemiesAreDead = false;
        this.runEncounter();
    }
    runEncounter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkIfEnemiesAreDead();
            this.checkIfPartyIsDead();
            if (!this.partyIsDead && !this.enemiesAreDead) {
                GameUI.get().drawString('Player turn.');
                const party = this.party.filter(x => !x.isDead);
                for (let hero of party) {
                    yield this.sleep(this.delay);
                    this.partyTurn(hero);
                }
            }
            if (!this.enemiesAreDead && !this.partyIsDead) {
                GameUI.get().drawString('Enemy turn.');
                const enemies = this.enemies.filter(x => !x.isDead);
                for (let enemy of enemies) {
                    yield this.sleep(this.delay);
                    this.enemyTurn(enemy);
                }
            }
            if (!this.enemiesAreDead && !this.partyIsDead) {
                this.runEncounter();
            }
            else if (this.enemiesAreDead && this.level < 11) {
                GameUI.get().drawString('Having a break...');
                this.party.filter(x => !x.isDead).forEach(x => {
                    x.heal(10);
                });
                GameUI.get().drawString(`------  level:', ${this.level}, '------`);
                this.level++;
                this.newEncounter();
            }
            else if (!this.partyIsDead && this.level == 11) {
                GameUI.get().drawString('Victory!');
            }
        });
    }
    partyTurn(hero) {
        if (this.checkIfEnemiesAreDead()) {
            GameUI.get().drawString('Enemies have been defeated.');
        }
        else {
            GameUI.get().drawString(`------ ${hero.name} - HP: ${hero.hp} ------`);
            hero.performAction();
            if (this.enemiesAreDead) {
                GameUI.get().drawString('Enemies have been defeated.');
            }
        }
    }
    enemyTurn(enemy) {
        if (this.checkIfPartyIsDead()) {
            GameUI.get().drawString('Your party is dead.');
        }
        else {
            GameUI.get().drawString(`------ ${enemy.name} - HP: ${enemy.hp} ------`);
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
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        });
    }
}
