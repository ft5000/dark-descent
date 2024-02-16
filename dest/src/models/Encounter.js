import { DataService } from "../main.js";
export class Encounter {
    constructor(data, level) {
        this.enemies = [];
        this.data = data;
        this.level = level;
        this.text = data.text;
        for (let enemy of data.enemies) {
            this.enemies.push(DataService.get().getEnemy(enemy));
        }
    }
}
