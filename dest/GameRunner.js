import { DataService } from "./main.js";
export class GameRunner {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.level = 0;
    }
    init() {
        this.party = DataService.get().getHeroes();
    }
    newEncounter() {
        this.enemies = [];
        for (var i = 0; i < 2; i++) {
            var archer = DataService.get().getEnemies()[0];
            var wizard = DataService.get().getEnemies()[1];
            archer.numberEnemy(i + 1);
            wizard.numberEnemy(i + 1);
            this.enemies.push(archer);
            this.enemies.push(wizard);
        }
        // this.enemies.forEach(enemy => {
        //     var archers = this.enemies.filter(x => x.trait.name == "Archer");
        //     enemy.numberEnemy(i)
        //     i++;
        // })
        this.runEncounter();
    }
    runEncounter() {
        var enemiesAreDead = this.enemiesAreDead();
        var partyIsDead = this.partyIsDead();
        if (!partyIsDead && !enemiesAreDead) {
            console.log('Player turn.');
            this.party.forEach(hero => {
                enemiesAreDead = this.enemiesAreDead();
                if (enemiesAreDead) {
                    console.log('Enemies have been defeated.');
                    this.level++;
                }
                if (!enemiesAreDead) {
                    hero.performAction();
                }
                console.log('--------------------');
            });
        }
        if (!enemiesAreDead && !partyIsDead) {
            console.log('Enemy turn.');
            this.enemies.forEach(enemy => {
                partyIsDead = this.partyIsDead();
                if (partyIsDead) {
                    console.log('Your party is dead.');
                }
                if (!partyIsDead) {
                    enemy.performAction();
                }
                console.log('--------------------');
            });
        }
        if (!enemiesAreDead && !partyIsDead) {
            this.runEncounter();
        }
        else if (enemiesAreDead && this.level < 10) {
            console.log('level: ', this.level);
            this.newEncounter();
        }
        else {
            console.log('Victory!');
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
    enemiesAreDead() {
        return !this.enemies.some(x => !x.isDead);
    }
    partyIsDead() {
        return !this.party.some(x => !x.isDead);
    }
    wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }
}
