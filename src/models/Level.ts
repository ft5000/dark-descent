import { GameRunner } from "../GameRunner.js";
import { DataService } from "../main.js";
import { Encounter } from "./Encounter.js";
import { Enemy } from "./Enemy.js";

export class Level {
    level: number;
    encounters: Encounter[] = []
    current: number = 0;
    completed: boolean = false;
    //events: GameEvent[];

    constructor(level: number) {
        this.level = level;
        this.generateEncounters();
    }

    private generateEncounters() {
        const encounters = DataService.get().getEncountersByLevel(this.level);
        for (var n = 0; n < 3; n++) {
            const i = GameRunner.get().getRandomIndex(encounters)
            this.encounters.push(new Encounter(DataService.get().getEncountersByLevel(this.level)[i].data, this.level))
        }
    }

    public getCurrentEnemies(): Enemy[] {
        return this.encounters[this.current].enemies;
    }

    public getEncounterText(): string[] {
        return this.encounters[this.current].text;
    }

    public nextEncounter(): boolean {
        if (this.current < this.encounters.length - 1) {
            this.current++;
            return true;
        } else {
            this.completed = true;
            return false;
        }
    }
}