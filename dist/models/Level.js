import { GameRunner } from "../GameRunner.js";
import { DataService } from "../main.js";
import { Encounter } from "./Encounter.js";
export class Level {
    level;
    encounters = [];
    current = 0;
    completed = false;
    //events: GameEvent[];
    constructor(level) {
        this.level = level;
        this.generateEncounters();
    }
    generateEncounters() {
        const encounters = DataService.get().getEncountersByLevel(this.level);
        for (var n = 0; n < 3; n++) {
            const i = GameRunner.get().getRandomIndex(encounters);
            this.encounters.push(new Encounter(DataService.get().getEncountersByLevel(this.level)[i].data, this.level));
        }
    }
    getCurrentEnemies() {
        return this.encounters[this.current].enemies;
    }
    getEncounterText() {
        return this.encounters[this.current].text;
    }
    nextEncounter() {
        if (this.current < this.encounters.length - 1) {
            this.current++;
            return true;
        }
        else {
            this.completed = true;
            return false;
        }
    }
}
