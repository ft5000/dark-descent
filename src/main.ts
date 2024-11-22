import { Trait } from "./models/Trait.js";
import { Skill } from "./models/Skill.js";

let namesJson: any;
let racesJson: any;
let skillsJson: any;
let enemyTraitsJson: any;
let heroTraitsJson: any;
let encountersJson: any;
let statusEffects: any;

async function loadJsonData() {
    namesJson = await fetch('./data/names.json').then(response => response.json());
    racesJson = await fetch('./data/races.json').then(response => response.json());
    skillsJson = await fetch('./data/skills.json').then(response => response.json());
    enemyTraitsJson = await fetch('./data/enemyTraits.json').then(response => response.json());
    heroTraitsJson = await fetch('./data/heroTraits.json').then(response => response.json());
    encountersJson = await fetch('./data/encounters.json').then(response => response.json());
    statusEffects = await fetch('./data/statusEffects.json').then(response => response.json());
}

import { Enemy } from "./models/Enemy.js";
import { GameRunner } from "./GameRunner.js";
import { GameInput } from "./GameInput.js";
import { Encounter } from "./models/Encounter.js";
import { Hero } from "./models/Hero.js";
import { HeroType } from "./enums/HeroType.js";
import { StatusEffect } from "./models/StatusEffect.js";

export class DataService {
    private static _instance: DataService;
    private names: string[] = []
    private races: string[] = [];
    private statusEffects: StatusEffect[] = [];
    private skills: Skill[] = [];
    private enemyTraits: Trait[] = [];
    private heroTraits: Trait[] = [];
    private encounters: Encounter[] = [];

    public loadJson() {
        namesJson.forEach((data: string) => {
            this.names.push(data)
            console.log("loading names...")
        });

        racesJson.forEach((data: string) => {
            this.races.push(data)
            console.log("loading races...")
        });

        statusEffects.forEach((data: any) => {
            this.statusEffects.push(new StatusEffect(data))
            console.log("loading status effects...")
        });

        skillsJson.forEach((data: any) => {
            this.skills.push(new Skill(data))
            console.log("loading skills...")
        });

        heroTraitsJson.forEach((data: any) => {
            this.heroTraits.push(new Trait(data, this.skills))
            console.log("loading hero traits...")
        });

        enemyTraitsJson.forEach((data: any) => {
            this.enemyTraits.push(new Trait(data, this.skills))
            console.log("loading enemy traits...")
        })

        encountersJson.forEach((data: any) => {
            const level = data.level;
            data.encounters.forEach((encounter: any) => {
                this.encounters.push(new Encounter(encounter, level))
            })

            console.log("loading encounters...")
        });

        return false;
    }

    public getRaces(): string[] {
        return this.races;
    }

    public getNames(): string[] {
        return this.names;
    }

    public getStatusEffect(name: string, amount: number, turns: number, chance: number) {
        var effect = new StatusEffect(this.statusEffects.find(x => x.name == name))
        effect.setSpecifics(amount, turns, chance)
        return effect;
    }

    public getHero(type: HeroType) {
        const heroes = this.heroTraits.filter(x => x.type == type)
        const i = GameRunner.get().getRandomIndex(heroes);
        return new Hero(heroes[i].data)
    }

    public getEnemy(name: string) {
        const enemy = this.enemyTraits.find(x => x.name == name)
        return new Enemy(enemy.data)
    }

    public getEncountersByLevel(level: number) {
        return this.encounters.filter(x => x.level == level);
    }

    public getEnemyTrait(name: string) {
        return this.enemyTraits.find(x => x.name == name)
    }

    public getHeroTrait(name: string) {
        return this.heroTraits.find(x => x.name == name)
    }

    public getHeroTraits(type: number) {
        return this.heroTraits.filter(x => x.type == type)
    }

    public getTraits(isEnemy: boolean): Trait[] {
        var traits: Trait[] = []
        if (isEnemy) {
            this.enemyTraits.forEach(trait => {
                traits.push(new Trait(trait.data, this.skills))
            })
        }
        else {
            this.heroTraits.forEach(trait => {
                traits.push(new Trait(trait.data, this.skills))
            })
        }
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

await loadJsonData();
DataService.get().loadJson();

export class App {
    public app: App = this;
    public loading: boolean = false;

    public init() {
        this.loading = true;
        this.loading =  DataService.get().loadJson();
        addEventListener("resize", (event) => {
            var console = document.getElementById('console');
            console.scrollTo(0, console.scrollHeight);
        });
        GameInput.get().init();
        GameRunner.get().init();
    }
}

const app = new App();
app.init();

