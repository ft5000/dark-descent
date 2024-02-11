import { DataService } from "./main.js";
export class GameRunner {
    constructor() {
        this.party = [];
        this.enemies = [];
    }
    init() {
        this.party = DataService.get().getHeroes();
    }
    newEncounter() {
        this.enemies.push(DataService.get().getEnemies()[0]);
        var i = 1;
        this.enemies.forEach(enemy => {
            enemy.numberEnemy(i);
            i++;
        });
        this.runEncounter();
    }
    runEncounter() {
        var enemiesAreDead = false;
        this.party.forEach(hero => {
            hero.performAction();
            enemiesAreDead = this.enemiesAreDead();
        });
        if (!enemiesAreDead) {
            this.runEncounter();
        }
        console.log(this.enemies);
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameRunner();
        return this._instance;
    }
    getTargets(aoe) {
        return aoe ? this.enemies : this.getRandomTarget();
    }
    getRandomTarget() {
        const enemies = this.enemies.filter(x => !x.isDead);
        if (enemies.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * this.getTargets.length);
        return this.enemies[i];
    }
    partyIsDead() {
        return !this.party.some(x => !x.isDead);
    }
    enemiesAreDead() {
        return !this.enemies.some(x => !x.isDead);
    }
}
