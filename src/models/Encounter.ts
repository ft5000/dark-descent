import { GameRunner } from "../GameRunner.js";
import { LogItem } from "../GameUI.js";
import { DataService } from "../main.js";
import { Enemy } from "./Enemy.js";

export class Encounter {
    level: number;
    text: string[];
    enemies: Enemy[] = [];
    data: any;

    constructor(data: any, level: number) {
        this.data = data;
        this.level = level;
        this.text = data.text;
        for (let enemy of data.enemies) {
            this.enemies.push(DataService.get().getEnemy(enemy));
        }
    }
}