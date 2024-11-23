import { Attribute } from "../enums/Attribute";
import { GameRunner } from "../GameRunner";
import { Hero } from "./Hero";

export class Item {
    id: string;
    name: string;
    amount: number;
    description: string;
    attribute: Attribute;

    constructor(id: string, name: string, description: string, attribute: Attribute) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.attribute = attribute;
    }

    public use(item: Item, hero: Hero): void {
        switch (item.attribute) {
            case Attribute.Healing: {
                this.heal(hero);
                break;
            }
            case Attribute.Cure: {
                
                break;
            }
        }
    }

    private heal(hero: Hero): void {
        hero.hp += this.amount;
    }

    private healAll(): void {
        GameRunner.get().party.forEach((hero: Hero) => {
        this.heal(hero);
        });
    }

    private cure(hero: Hero): void {
        for (let effect of hero.statusEffects) {
            if (!effect.isBuff) {
                hero.statusEffects.splice(hero.statusEffects.indexOf(effect), 1);
            }
        }
    }

    private cureAll(): void {
        GameRunner.get().party.forEach((hero: Hero) => {
            this.cure(hero);
        });
    }
}