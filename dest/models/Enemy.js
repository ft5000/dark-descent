import { Character } from "./Character.js";
export class Enemy extends Character {
    constructor() {
        super(...arguments);
        this.isEnemy = true;
    }
    numberEnemy(num) {
        this.name += ` ${num}`;
    }
}
