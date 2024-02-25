import { Character } from "./Character";

export class StatusEffect {
    name: string;
    amount: number = 0;
    turnsLeft: number = 0;
    turns: number = 0;
    isBuff: boolean;
    data: any;

    constructor(data: any) {
        this.data = data;
        this.name = data.name;
        this.isBuff = data.isBuff;
    }

    public setSpecifics(amount: number, turns: number) {
        this.amount = amount;
        this.turns = turns;
        this.turnsLeft = turns;
    }

    public decreaseTurns(): boolean {
        this.turnsLeft -= this.turnsLeft > 0 ? 1 : 0;
        return this.turnsLeft == 0;
    }

    public getText(character: Character): string {
        if (this.isBuff) {
            return `${character.getNameAndNumber()} is effected by ${this.name} and gained ${this.amount}hp.`
        }
        else {
            return `${character.getNameAndNumber()} is afflicted by ${this.name} and lost ${this.amount}hp.`
        }
    }
}