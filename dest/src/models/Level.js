import { GameRunner } from "../GameRunner.js";
import { DataService } from "../main.js";
import { Encounter } from "./Encounter.js";
export class Level {
    //events: GameEvent[];
    constructor(level) {
        this.encounters = [];
        this.level = level;
        this.generateEncounters();
    }
    generateEncounters() {
        const encounters = DataService.get().getEncountersByLevel(this.level);
        for (var n = 0; n < 4; n++) {
            const i = GameRunner.get().getRandomIndex(encounters);
            this.encounters.push(new Encounter(DataService.get().getEncountersByLevel(this.level)[i].data, this.level));
        }
    }
}
