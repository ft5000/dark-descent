import { GameRunner } from "../GameRunner.js";
import { DataService } from "../main.js";
import { Character } from "./Character.js";
export class Hero extends Character {
    constructor(data) {
        super(data);
        this.isEnemy = false;
        this.race = this.randomRace();
    }
    setRandomName() {
        var names = DataService.get().getNames();
        names = names.filter(x => !GameRunner.get().party.some(p => p.name == x));
        const i = GameRunner.get().getRandomIndex(names);
        this.name = names[i];
    }
    randomRace() {
        const races = DataService.get().getRaces();
        const i = GameRunner.get().getRandomIndex(races);
        return races[i];
    }
}
