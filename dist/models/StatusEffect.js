export class StatusEffect {
    name;
    amount = 0;
    turnsLeft = 0;
    turns = 0;
    chance = 1;
    isBuff;
    data;
    constructor(data) {
        this.data = data;
        this.name = data.name;
        this.isBuff = data.isBuff;
    }
    setSpecifics(amount, turns, chance) {
        this.amount = amount;
        this.turns = turns;
        this.turnsLeft = turns;
        this.chance = chance;
    }
    decreaseTurns() {
        this.turnsLeft -= this.turnsLeft > 0 ? 1 : 0;
        return this.turnsLeft == 0;
    }
    getText(character) {
        if (this.isBuff) {
            return `▲ ${character.getNameAndNumber()} is effected by ${this.name}.`;
        }
        else {
            return `▼ ${character.getNameAndNumber()} is afflicted by ${this.name}.`;
        }
    }
}
