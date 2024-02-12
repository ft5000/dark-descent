import { Character } from "./character.js";
export class Hero extends Character {
    constructor() {
        super(...arguments);
        this.isEnemy = false;
    }
    changeName(name) {
        var prevName = this.name;
        this.name = name;
        console.log(`${prevName} has become ${this.name}!`);
    }
}
