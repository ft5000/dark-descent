export class Skill {
    name;
    damage;
    heal;
    cost;
    damageType;
    aoe;
    constructor(data) {
        this.name = data.name;
        this.damage = data.damage;
        this.heal = data.heal;
        this.cost = data.cost;
        this.damageType = data.damageType;
        this.aoe = data.aoe;
    }
}
