export class StatusEffect {
    constructor(data) {
        this.amount = 0;
        this.turnsLeft = 0;
        this.turns = 0;
        this.data = data;
        this.name = data.name;
        this.isBuff = data.isBuff;
    }
    setSpecifics(amount, turns) {
        this.amount = amount;
        this.turns = turns;
        this.turnsLeft = turns;
    }
    decreaseTurns() {
        this.turnsLeft -= this.turnsLeft > 0 ? 1 : 0;
        return this.turnsLeft == 0;
    }
    getText(character) {
        if (this.isBuff) {
            return `⇧ ${character.getNameAndNumber()} is effected by ${this.name}.`;
        }
        else {
            return `⇩ ${character.getNameAndNumber()} is afflicted by ${this.name}.`;
        }
    }
}
