import { ICharacter } from "./ICharacter";
import { Character } from "./Character";

export class Enemy extends Character implements ICharacter {
    isEnemy: boolean = true;
    id: number = null;
    public setId(id: number) {
        this.id = id;
    }
}