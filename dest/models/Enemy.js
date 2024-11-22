import { Character } from "./Character.js";
export class Enemy extends Character {
    isEnemy = true;
    id = null;
    setId(id) {
        this.id = id;
    }
}
