import { GameRunner } from "../GameRunner";
import { LogItem } from "../GameUI";
import { DataService } from "../main";
import { Enemy } from "./Enemy";

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
        this.setEnemyId();
        this.numberEnemies();
    }

    private setEnemyId() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].setId(i);
        }
    }

    private numberEnemies() {
        // Number type enemies.
        const enemyTypes: string[] = [];
        for (let enemy of this.enemies) {
            if (!enemyTypes.some(x => x == enemy.name)) {
                enemyTypes.push(enemy.name)
            }
        }
        for (let type of enemyTypes) {
            const enemiesOfType = this.enemies.filter(x => x.name == type);
            // If then number enemies.
            if (enemiesOfType.length > 1) {
                let count = 1;
                for (let enemy of enemiesOfType) {
                    this.enemies.find(x => x.id == enemy.id).setNumber(count)
                    count++;
                }
            }
        }
    }
}