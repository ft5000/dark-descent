import { Skill } from "./Skill.js";

export class Trait {
    name: string = "";
    skills: Skill[] = [];
    data: any;

    constructor(data: Trait, skills: Skill[]) {
        this.name = data.name;
        data.skills.forEach(skill => {
            this.skills.push(skills.find(x => x.name == skill.name) as Skill);
        })
        this.data = data;
    }

    public getSkills(): Skill[] {
        return this.skills;
    }
}