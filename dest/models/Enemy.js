import { Character } from "./Character.js";
export class Enemy extends Character {
    constructor() {
        super(...arguments);
        this.isEnemy = true;
        this.id = null;
    }
    setId(id) {
        this.id = id;
    }
}
