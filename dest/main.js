import { Hero } from "./models/Hero.js";
import { Trait } from "./models/Trait.js";
import { Skill } from "./models/Skill.js";
import namesJson from '../data/names.json' assert { type: 'json' };
import racesJson from '../data/races.json' assert { type: 'json' };
import skillsJson from '../data/skills.json' assert { type: 'json' };
import traitsJson from '../data/traits.json' assert { type: 'json' };
import heroesJson from '../data/heroes.json' assert { type: 'json' };
import enemiesJson from '../data/enemies.json' assert { type: 'json' };
import { Enemy } from "./models/Enemy.js";
import { GameRunner } from "./GameRunner.js";
import { GameInput } from "./GameInput.js";
export class DataService {
    constructor() {
        this.names = [];
        this.races = [];
        this.skills = [];
        this.traits = [];
        this.heroes = [];
        this.enemies = [];
    }
    loadJson() {
        namesJson.forEach((data) => {
            this.names.push(data);
            console.log("loading names...");
        });
        racesJson.forEach((data) => {
            this.races.push(data);
            console.log("loading races...");
        });
        skillsJson.forEach((data) => {
            this.skills.push(new Skill(data));
            console.log("loading skills...");
        });
        traitsJson.forEach((data) => {
            this.traits.push(new Trait(data, this.skills));
            console.log("loading traits...");
        });
        heroesJson.forEach((data) => {
            this.heroes.push(new Hero(data));
            console.log("loading heroes...");
        });
        enemiesJson.forEach((data) => {
            this.enemies.push(new Enemy(data));
            console.log("loading enemies...");
        });
        return false;
    }
    getRaces() {
        return this.races;
    }
    getNames() {
        return this.names;
    }
    getHeroes() {
        var heroes = [];
        this.heroes.forEach(hero => {
            heroes.push(new Hero(hero.data));
        });
        return heroes;
    }
    getEnemies() {
        var enemies = [];
        this.enemies.forEach(enemy => {
            enemies.push(new Enemy(enemy.data));
        });
        return enemies;
    }
    getEnemy(name) {
        const enemy = this.enemies.find(x => x.name == name);
        return new Enemy(enemy.data);
    }
    getTrait(name) {
        return this.traits.find(x => x.name == name);
    }
    getTraits() {
        var traits = [];
        this.traits.forEach(trait => {
            traits.push(new Trait(trait.data, this.skills));
        });
        return traits;
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new DataService();
        return this._instance;
    }
}
export class App {
    constructor() {
        this.app = this;
        this.loading = false;
    }
    init() {
        this.loading = true;
        this.loading = DataService.get().loadJson();
        GameInput.get().init();
        GameRunner.get().init();
    }
}
const app = new App();
app.init();
