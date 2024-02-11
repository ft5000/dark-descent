import { Hero } from "./models/hero.js";
import { Trait } from "./models/trait.js";
import { Skill } from "./models/Skill.js";

import skillsJson from '../data/skills.json' assert { type: 'json' };
import traitsJson from '../data/traits.json' assert { type: 'json' };
import heroesJson from '../data/heroes.json' assert { type: 'json' };

export class DataService {
    private skills: Skill[] = [];
    private traits: Trait[] = [];
    private heroes: Hero[] = [];

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

        console.log(this.skills, this.traits, this.heroes);

        // this.heroes[0].changeName("Johnny The Barbarian")
        // this.heroes[0].takeDamage(4);
        // this.heroes[0].heal(2);
        // this.heroes[0].takeDamage(200);
        // this.heroes[0].heal(22);
        // this.heroes[0].changeName("Johnny The Dead Barbarian")

        return false;
    }

    public getTrait(name: string) {
        return this.traits.find(x => x.name == name)
    }
}

export class App {
    public dataService: DataService;
    public app: App = this;
    public loading: boolean = false;

    constructor() {
        this.dataService = new DataService();
    }

    public init() {
        this.loading = true;
        this.loading = this.dataService.loadJson();
    }

    public getDataService() {
        return this.dataService;
    }
}

const app = new App();
app.init();

