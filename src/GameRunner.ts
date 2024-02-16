import { GameInput } from "./GameInput.js";
import { GameUI } from "./GameUI.js";
import { Color } from "./enums/Color.js";
import { DataService } from "./main.js";
import { Enemy } from "./models/Enemy.js";
import { Hero } from "./models/Hero.js";
import { Level } from "./models/Level.js";

export class GameRunner {
    private static _instance: GameRunner;
    party: Hero[] = [];
    enemies: Enemy[] = []
    prevLevel: number = 0;
    currentLevel: number = 1;
    partyIsDead: boolean = false;
    enemiesAreDead: boolean = true;
    levels: Level[] = [];
    level: Level;
    isNewEncounter: boolean = true;

    constructor() {
    }

    public init() {
        this.party = DataService.get().getHeroes();
        for (let hero of this.party) {
            hero.setRandomName();
            GameUI.get().setCharacterInfo(hero)
        }
        this.initLevels();
        this.newEncounter();
        GameInput.get().appendInputField();
    }

    public initLevels() {
        for (var i = 0; i < 10; i++) {
            this.levels.push(new Level(i+1));
        }
    }

    public play() {
        if (this.checkIfEnemiesAreDead()) {
            this.newEncounter();
        }
        this.runEncounter();
    }

    public newEncounter() {
        this.isNewEncounter = true;
        this.enemies = [];
        const i = this.currentLevel - 1;
        this.level = this.levels[i];
        this.enemies = this.level.getCurrentEnemies();
        GameUI.get().log('&nbsp');
    }

    public randomEncounter() {
        const enemies = DataService.get().getEnemies();
        for (var n = 0; n < 4; n++) {
            const i = this.getRandomIndex(enemies);
            const enemy = DataService.get().getEnemy(enemies[i].name);
            enemy.setId(n);
            this.enemies.push(enemy);
        }

        // Number type enemies.
        const enemyTypes: string[] = [];
        for (let enemy of this.enemies) {
            if (!enemyTypes.some(x => x == enemy.name)) {
                enemyTypes.push(enemy.name)
            }
        }
        for (let type of enemyTypes) {
            const enemiesOfType = this.enemies.filter(x => x.name == type);
            // If then number enemies.
            if (enemiesOfType.length > 1) {
                let count = 1;
                for (let enemy of enemiesOfType) {
                    this.enemies.find(x => x.id == enemy.id).setNumber(count)
                    count++;
                }
            }
        }

        this.enemiesAreDead = false;
    }

    public runEncounter() {
        if (this.isNewLevel()) {
            this.newLevel();
        }

        if (this.isNewEncounter) {
            this.level.getEncounterText().forEach(x => {
                GameUI.get().log(x, null, 1);
            })
            this.isNewEncounter = false;
        }

        this.checkIfEnemiesAreDead();
        this.checkIfPartyIsDead();

        if (!this.partyIsDead && !this.enemiesAreDead) {
            GameUI.get().log('Party turn.', Color.green)
            GameUI.get().log('&nbsp;')
            const party = this.party.filter(x => !x.isDead)
            for (let hero of party) {
                if (!this.checkIfEnemiesAreDead()) {
                    this.partyTurn(hero);
                }
            }
            if (this.checkIfEnemiesAreDead()) {
                GameUI.get().log('Enemies have been defeated.')
                GameUI.get().log('&nbsp;')
                if (!this.level.nextEncounter()) {
                    this.currentLevel++;
                }
            }
        }

        if (!this.enemiesAreDead && !this.partyIsDead) {
            GameUI.get().log('Enemy turn.', Color.red)
            GameUI.get().log('&nbsp;')
            const enemies = this.enemies.filter(x => !x.isDead)
            for (let enemy of enemies) {
                this.enemyTurn(enemy)
            }
        }

        if (this.enemiesAreDead && this.currentLevel <= 10) {
            GameUI.get().log('Party is resting...', null, 3);
            GameUI.get().log('&nbsp;', null, 0);
            this.party.filter(x => !x.isDead).forEach(x => {
                x.heal(16)
                x.replenishAp(12);
            })
        }
        else if (!this.partyIsDead && this.currentLevel == 11) {
            GameUI.get().log('Victory!')
        }
        if (!this.checkIfEnemiesAreDead()) {
            GameUI.get().log('------ End of Turns ------')
        }
        GameUI.get().log('&nbsp;')
        GameUI.get().printLog();
    }

    private newLevel() {
        GameUI.get().log(`------ level: ${this.currentLevel} ------`)
        GameUI.get().log('&nbsp;');
        this.prevLevel = this.currentLevel;
    }

    private isNewLevel(): boolean {
        return this.currentLevel > this.prevLevel;
    }

    private partyTurn(hero: Hero) {
        GameUI.get().log(`------ ${hero.name} - HP: ${hero.hp} ------`)
        hero.performAction();
    }

    private enemyTurn(enemy: Enemy) {
        if (this.checkIfPartyIsDead()) {
            GameUI.get().log('Your party is dead.', 'darkgrey')
        }
        else {
            GameUI.get().log(`------ ${enemy.getNameAndNumber()} - HP: ${enemy.hp} ------`)
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

    public getTargets(isEnemy: boolean) {
        return isEnemy == false ? this.enemies : this.party;
    }

    public getRandomTarget(isEnemy: boolean) {
        const targets = isEnemy == false ? this.enemies.filter(x => !x.isDead) : this.party.filter(x => !x.isDead)
        if (targets.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * targets.length);
        return targets[i];
    }

    public checkIfEnemiesAreDead() {
        return this.enemiesAreDead = !this.enemies.some(x => !x.isDead);
    }

    public checkIfPartyIsDead() {
        return this.partyIsDead = !this.party.some(x => !x.isDead);
    }

    public getRandomIndex(items: any[]): number {
        return Math.floor(Math.random() * items.length);
    }
}