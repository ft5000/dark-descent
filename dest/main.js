import { Hero } from "./models/hero.js";
import { Trait } from "./models/trait.js";
import { Skill } from "./models/Skill.js";
import skillsJson from '../data/skills.json' assert { type: 'json' };
import traitsJson from '../data/traits.json' assert { type: 'json' };
import heroesJson from '../data/heroes.json' assert { type: 'json' };
export class DataService {
    constructor() {
        this.skills = [];
        this.traits = [];
        this.heroes = [];
    }
    loadJson() {
        skillsJson.forEach((data) => {
            this.skills.push(new Skill(data));
            console.log("loading skills...");
        });
        traitsJson.forEach((data) => {
            this.traits.push(new Trait(data, this.skills));
            console.log("loading traits...");
        });
        heroesJson.forEach((data) => {
            this.heroes.push(new Hero(data, this.traits));
            console.log("loading heroes...");
        });
        console.log(this.skills, this.traits, this.heroes);
        // this.heroes[0].changeName("Johnny The Barbarian")
        // this.heroes[0].takeDamage(4);
        // this.heroes[0].heal(2);
        // this.heroes[0].takeDamage(200);
        // this.heroes[0].heal(22);
        // this.heroes[0].changeName("Johnny The Dead Barbarian")
        return false;
    }
    getTrait(name) {
        return this.traits.find(x => x.name == name);
    }
}
export class App {
    constructor() {
        this.app = this;
        this.loading = false;
        this.dataService = new DataService();
    }
    init() {
        this.loading = true;
        this.loading = this.dataService.loadJson();
    }
    getDataService() {
        return this.dataService;
    }
}
const app = new App();
app.init();
