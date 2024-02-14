export class Trait {
    constructor(data, skills) {
        this.name = "";
        this.skills = [];
        this.name = data.name;
        data.skills.forEach(skill => {
            this.skills.push(skills.find(x => x.name == skill.name));
        });
        this.data = data;
    }
    getSkills() {
        return this.skills;
    }
}
