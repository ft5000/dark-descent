import { Trait } from "./models/Trait.js";
import { Skill } from "./models/Skill.js";
let namesJson;
let racesJson;
let skillsJson;
let enemyTraitsJson;
let heroTraitsJson;
let encountersJson;
let statusEffects;
let items;
async function loadJsonData() {
    namesJson = await fetch('./data/names.json').then(response => response.json());
    racesJson = await fetch('./data/races.json').then(response => response.json());
    skillsJson = await fetch('./data/skills.json').then(response => response.json());
    enemyTraitsJson = await fetch('./data/enemyTraits.json').then(response => response.json());
    heroTraitsJson = await fetch('./data/heroTraits.json').then(response => response.json());
    encountersJson = await fetch('./data/encounters.json').then(response => response.json());
    statusEffects = await fetch('./data/statusEffects.json').then(response => response.json());
    items = await fetch('./data/items.json').then(response => response.json());
}
import { Enemy } from "./models/Enemy.js";
import { GameRunner } from "./GameRunner.js";
import { GameInput } from "./GameInput.js";
import { Encounter } from "./models/Encounter.js";
import { Hero } from "./models/Hero.js";
import { StatusEffect } from "./models/StatusEffect.js";
import { Item } from "./models/Item.js";
export class DataService {
    static _instance;
    names = [];
    races = [];
    statusEffects = [];
    skills = [];
    enemyTraits = [];
    heroTraits = [];
    encounters = [];
    items = [];
    loadJson() {
        namesJson.forEach((data) => {
            this.names.push(data);
            console.log("loading names...");
        });
        racesJson.forEach((data) => {
            this.races.push(data);
            console.log("loading races...");
        });
        statusEffects.forEach((data) => {
            this.statusEffects.push(new StatusEffect(data));
            console.log("loading status effects...");
        });
        skillsJson.forEach((data) => {
            this.skills.push(new Skill(data));
            console.log("loading skills...");
        });
        heroTraitsJson.forEach((data) => {
            this.heroTraits.push(new Trait(data, this.skills));
            console.log("loading hero traits...");
        });
        enemyTraitsJson.forEach((data) => {
            this.enemyTraits.push(new Trait(data, this.skills));
            console.log("loading enemy traits...");
        });
        encountersJson.forEach((data) => {
            const level = data.level;
            data.encounters.forEach((encounter) => {
                this.encounters.push(new Encounter(encounter, level));
            });
            console.log("loading encounters...");
        });
        items.forEach((data) => {
            this.items.push(new Item(data));
            console.log("loading items...");
        });
        return false;
    }
    getItems() {
        return this.items;
    }
    getRaces() {
        return this.races;
    }
    getNames() {
        return this.names;
    }
    getStatusEffect(name, amount, turns, chance) {
        var effect = new StatusEffect(this.statusEffects.find(x => x.name == name));
        effect.setSpecifics(amount, turns, chance);
        return effect;
    }
    getHero(type) {
        const heroes = this.heroTraits.filter(x => x.type == type);
        const i = GameRunner.get().getRandomIndex(heroes);
        return new Hero(heroes[i].data);
    }
    getEnemy(name) {
        const enemy = this.enemyTraits.find(x => x.name == name);
        return new Enemy(enemy.data);
    }
    getEncountersByLevel(level) {
        return this.encounters.filter(x => x.level == level);
    }
    getEnemyTrait(name) {
        return this.enemyTraits.find(x => x.name == name);
    }
    getHeroTrait(name) {
        return this.heroTraits.find(x => x.name == name);
    }
    getHeroTraits(type) {
        return this.heroTraits.filter(x => x.type == type);
    }
    getTraits(isEnemy) {
        var traits = [];
        if (isEnemy) {
            this.enemyTraits.forEach(trait => {
                traits.push(new Trait(trait.data, this.skills));
            });
        }
        else {
            this.heroTraits.forEach(trait => {
                traits.push(new Trait(trait.data, this.skills));
            });
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
export class App {
    app = this;
    loading = false;
    init() {
        this.loading = true;
        this.loading = DataService.get().loadJson();
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
