import { DataService } from "../main.js";
export class Encounter {
    level;
    text;
    enemies = [];
    data;
    constructor(data, level) {
        this.data = data;
        this.level = level;
        this.text = data.text;
        for (let enemy of data.enemies) {
            this.enemies.push(DataService.get().getEnemy(enemy));
        }
        this.setEnemyId();
        this.numberEnemies();
    }
    setEnemyId() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].setId(i);
        }
    }
    numberEnemies() {
        // Number type enemies.
        const enemyTypes = [];
        for (let enemy of this.enemies) {
            if (!enemyTypes.some(x => x == enemy.name)) {
                enemyTypes.push(enemy.name);
            }
        }
        for (let type of enemyTypes) {
            const enemiesOfType = this.enemies.filter(x => x.name == type);
            // If then number enemies.
            if (enemiesOfType.length > 1) {
                let count = 1;
                for (let enemy of enemiesOfType) {
                    this.enemies.find(x => x.id == enemy.id).setNumber(count);
                    count++;
                }
            }
        }
    }
}
