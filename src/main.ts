import { Hero } from "./models/Hero.js";
import { Trait } from "./models/Trait.js";
import { Skill } from "./models/Skill.js";

import skillsJson from '../data/skills.json' assert { type: 'json' };
import traitsJson from '../data/traits.json' assert { type: 'json' };
import heroesJson from '../data/heroes.json' assert { type: 'json' };
import enemiesJson from '../data/enemies.json' assert { type: 'json' };
import { Enemy } from "./models/Enemy.js";
import { GameRunner } from "./GameRunner.js";
import { GameInput } from "./GameInput.js";

export class DataService {
    private static _instance: DataService;
    private skills: Skill[] = [];
    private traits: Trait[] = [];
    private heroes: Hero[] = [];
    private enemies: Enemy[] = [];

    public loadJson() {
        skillsJson.forEach((data: any) => {
            this.skills.push(new Skill(data))
            console.log("loading skills...")
        });

        traitsJson.forEach((data: any) => {
            this.traits.push(new Trait(data, this.skills))
            console.log("loading traits...")
        });
        
        heroesJson.forEach((data: any) => {
            this.heroes.push(new Hero(data, this.traits))
            console.log("loading heroes...")
        });

        enemiesJson.forEach((data: any) => {
            this.enemies.push(new Enemy(data, this.traits))
            console.log("loading enemies...")
        });

        return false;
    }

    public getHeroes(): Hero[] {
        var heroes: Hero[] = []
        this.heroes.forEach(hero => {
            heroes.push(new Hero(hero.data, this.traits))
        })
        return heroes;
    }

    public getEnemies(): Enemy[] {
        var enemies: Enemy[] = []
        this.enemies.forEach(enemy => {
            enemies.push(new Enemy(enemy.data, this.traits))
        })
        return enemies;
    }

    public getEnemy(name: string) {
        const enemy = this.enemies.find(x => x.name == name)
        return new Enemy(enemy.data, this.traits)
    }

    public getTrait(name: string) {
        return this.traits.find(x => x.name == name)
    }

    public getTraits(): Trait[] {
        var traits: Trait[] = []
        this.traits.forEach(trait => {
            traits.push(new Trait(trait.data, this.skills))
        })
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
    public app: App = this;
    public loading: boolean = false;

    public init() {
        this.loading = true;
        this.loading =  DataService.get().loadJson();
        GameInput.get().init();
        GameRunner.get().init();
    }
}

const app = new App();
app.init();

