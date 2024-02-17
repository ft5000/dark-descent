export class Trait {
    constructor(data, skills) {
        this.name = "";
        this.skills = [];
        this.name = data.name;
        this.hp = data.hp;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.critDmg = data.critDmg;
        this.critChance = data.critChance;
        this.isEnemy = data.isEnemy;
        this.type = data.type;
        data.skills.forEach(skill => {
            this.skills.push(skills.find(x => x.name == skill.name));
        });
        this.data = data;
    }
    getSkills() {
        return this.skills;
    }
}
