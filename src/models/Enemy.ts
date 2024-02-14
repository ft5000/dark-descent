import { ICharacter } from "./ICharacter.js";
import { Character } from "./Character.js";

export class Enemy extends Character implements ICharacter {
    isEnemy: boolean = true;
    id: number = null;
    public setId(id: number) {
        this.id = id;
    }
}