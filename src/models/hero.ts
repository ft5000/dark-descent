import { Character } from "./Character.js";

export class Hero extends Character  {
    isEnemy: boolean = false;
    public changeName(name: string): void {
        var prevName = this.name;
        this.name = name;
        console.log(`${prevName} has become ${this.name}!`)
    }
}