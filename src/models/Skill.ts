import { DamageType } from "../enums/DamageType";

export class Skill {
    name: string;
    damage: number;
    heal: number;
    cost: number;
    damageType: number;
    aoe: boolean;

    constructor(data: any) {
        this.name = data.name;
        this.damage = data.damage;
        this.heal = data.heal;
        this.cost = data.cost;
        this.damageType = data.damageType;
        this.aoe = data.aoe;
    }
}