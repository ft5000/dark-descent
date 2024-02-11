import { Character } from "./character.js";
export class Enemy extends Character {
    numberEnemy(num) {
        this.name += ` ${num}`;
    }
}
