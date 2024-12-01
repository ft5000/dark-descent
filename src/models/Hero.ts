import { GameRunner } from "../GameRunner.js";
import { DataService } from "../main.js";
import { Character } from "./Character.js";

export class Hero extends Character  {
    isEnemy: boolean = false;
    constructor(data: any) {
        super(data)
        this.race = this.randomRace();
    }

    public setRandomName(): void {
        var names: string[] = DataService.get().getNames();
        names = names.filter(x => !GameRunner.get().party.some(p => p.name == x));
        const i = GameRunner.get().getRandomIndex(names)
        this.name = names[i]
    }

    private randomRace(): string {
        const races = DataService.get().getRaces();
        const i = GameRunner.get().getRandomIndex(races)
        return races[i]
    }
}