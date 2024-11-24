import { GameInput } from "./GameInput.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { HeroType } from "./enums/HeroType.js";
import { DataService } from "./main.js";
import { Enemy } from "./models/Enemy.js";
import { Hero } from "./models/Hero.js";
import { Item } from "./models/Item.js";
import { Level } from "./models/Level.js";

export class GameRunner {
    private static _instance: GameRunner;
    party: Hero[] = [];
    enemies: Enemy[] = []
    prevLevel: number = AppInfo.startingLevel - 1;
    currentLevel: number = AppInfo.startingLevel;
    partyIsDead: boolean = false;
    enemiesAreDead: boolean = true;
    levels: Level[] = [];
    level: Level;
    isNextEncounter: boolean = true;
    gameOver: boolean = true;
    newInstance: boolean = true;
    enemiesSlain: number = 0;
    inventory: Item[] = [];

    constructor() {
    }

    public init() {
        GameInput.get().appendInputField();
    }

    public newGame() {
        this.newInstance = false;
        this.party = [];
        this.enemies = []
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
        for (var i = 0; i < this.party.length; i++) {
            var data = DataService.get().getItems().find(x => x.name == 'Bandage').data;
            this.inventory.push(new Item(data));
        }
    }

    public newParty() {
        this.party = []

        const tankTypes = DataService.get().getHeroTraits(HeroType.tank)
        const dpsTypes = DataService.get().getHeroTraits(HeroType.dps)
        const supportTypes = DataService.get().getHeroTraits(HeroType.support)

        this.party.push(DataService.get().getHero(HeroType.tank))
        this.party.push(DataService.get().getHero(HeroType.dps))
        this.party.push(DataService.get().getHero(HeroType.dps))
        this.party.push(DataService.get().getHero(HeroType.support))

        for (let hero of this.party) {
            hero.setRandomName();
            GameUI.get().setCharacterInfo(hero)
        }
    }

    public initLevels() {
        for (var i = 0; i < AppInfo.numOfLevels; i++) {
            this.levels.push(new Level(i+1));
        }
    }

    public play() {
        this.gameOver = false;
        if (this.checkIfEnemiesAreDead()) {
            this.nextEncounter();
        }
        this.runEncounter();
    }

    public nextEncounter() {
        this.isNextEncounter = true;
        this.enemies = [];
        const i = this.currentLevel - 1;
        this.level = this.levels[i];
        this.enemies = this.level.getCurrentEnemies();
        this.enemiesAreDead = false;
        GameUI.get().log('&nbsp');
    }

    public runEncounter() {
        if (this.isNewLevel()) {
            this.newLevel();
        }

        if (this.isNextEncounter) {
            this.level.getEncounterText().forEach(x => {
                GameUI.get().log(x, null, 1);
            })
            GameUI.get().log('&nbsp;')
            this.isNextEncounter = false;
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
                this.rollForLoot();
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
            if (this.checkIfEnemiesAreDead()) {
                GameUI.get().log('Enemies have been defeated.')
                GameUI.get().log('&nbsp;')
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
                x.heal(16)
                x.replenishAp(12);
            })
        }
        else if (!this.partyIsDead && this.currentLevel == AppInfo.numOfLevels + 1) {
            GameUI.get().log('Victory!')
            this.gameOver = true;
        }
        if (!this.checkIfEnemiesAreDead()) {
            if (this.checkIfPartyIsDead() && !this.gameOver) {
                this.gameIsOver();
            }
            else if (!this.gameOver) {
                GameUI.get().log('------ End of Turns ------')
            }
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

    private gameIsOver() {
        GameUI.get().log('Your party is dead.', Color.gray)
        this.inventory = [];
        this.gameOver = true;
    }

    private partyTurn(hero: Hero) {
        GameUI.get().log(`------ ${hero.name} - HP: ${hero.hp} ------`)
        hero.performAction();
        hero.checkStatusEffects();
    }

    private enemyTurn(enemy: Enemy) {
        if (this.checkIfPartyIsDead()) {
            if (!this.gameOver) {
                this.gameIsOver();
            }
        }
        else {
            GameUI.get().log(`------ ${enemy.getNameAndNumber()} - HP: ${enemy.hp} ------`)
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
        return this.enemiesAreDead = this.enemies.filter(x => !x.isDead).length == 0;
    }

    public checkIfPartyIsDead() {
        return this.partyIsDead = this.party.filter(x => !x.isDead).length == 0;
    }

    public isGameOver() {
        return this.gameOver;
    }

    public getRandomIndex(items: any[]): number {
        return Math.floor(Math.random() * items.length);
    }

    private rollForLoot(): void {
        var loot: Item[] = [];
        DataService.get().getItems().forEach((item: Item) => {
            let roll = Math.random();
            if (item.rate >= roll) {
                loot.push(item);
            }
        })
        if (loot.length > 0) {
            GameUI.get().log('Enemies have dropped items:', null, 1)
            loot.forEach((item: Item) => {
                GameUI.get().log(`• You recieve ${item.name}`, Color.green, 0)
                this.inventory.push(new Item(item.data));
            })
            GameUI.get().log("Type 'inventory' to access your consumables.", Color.gray, 0)
            GameUI.get().log('&nbsp;', null, 1)
        }

    }

    public uniqueItems(): Item[] {
        var items: Item[] = [];
        this.inventory.forEach((item: Item) => {
            if (items.includes(item) == false) {
                items.push(item);
            }
        });
        return items;
    }
}