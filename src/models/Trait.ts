import { Skill } from "./Skill";

export class Trait {
    name: string = "";
    hp: number;
    physDmg: number;
    magDmg: number;
    critDmg: number
    critChance: number;
    isEnemy: boolean;
    type: number;
    skills: Skill[] = [];
    data: any;

    constructor(data: Trait, skills: Skill[]) {
        this.name = data.name;
        this.hp = data.hp;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.critDmg = data.critDmg;
        this.critChance = data.critChance;
        this.isEnemy = data.isEnemy;
        this.type = data.type;
        data.skills.forEach(skill => {
            this.skills.push(skills.find(x => x.name == skill.name) as Skill);
        })
        this.data = data;
    }

    public getSkills(): Skill[] {
        return this.skills;
    }
}