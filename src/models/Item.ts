import { Attribute } from "../enums/Attribute.js";
import { Color } from "../enums/Color.js";
import { GameRunner } from "../GameRunner.js";
import { GameUI } from "../GameUI.js";
import { Hero } from "./Hero.js";

export class Item {
    name: string;
    amount: number;
    description: string;
    attribute: Attribute;
    rate: number;
    data: any;

    constructor(data: any) {
        this.name = data.name;
        this.amount = data.amount;
        this.description = data.description;
        this.attribute = data.attribute;
        this.rate = data.rate;
        this.data = data;
    }

    public heal(hero: Hero): void {
        hero.heal(this.amount);
    }

    public healAll(): void {
        GameRunner.get().party.forEach((hero: Hero) => {
            this.heal(hero);
        });
    }

    public cure(hero: Hero): void {
        for (let effect of hero.statusEffects) {
            if (!effect.isBuff) {
                hero.statusEffects.splice(hero.statusEffects.indexOf(effect), 1);
            }
        }
        GameUI.get().log(`☻ ${hero.name} has been cured!`, Color.green);
    }

    public cureAll(): void {
        GameRunner.get().party.forEach((hero: Hero) => {
            this.cure(hero);
        });
    }
}