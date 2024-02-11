import { ICharacter } from "./ICharacter.js";

export class Hero implements ICharacter  {
    name: string = "";
    hp: number = 0;
    hpMax: number = 0;
    physDmg: number = 0;
    magDmg: number = 0;
    isDead: boolean = true;

    constructor(data: Hero) {
        this.name = data.name;
        this.hp = data.hp;
        this.hpMax = data.hp;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg
        this.isDead = false;
    }

    public changeName(name: string): void {
        var prevName = this.name;
        this.name = name;
        console.log(`${prevName} has become ${this.name}!`)
    }

    public heal(hp: number): void {
        if (this.checkIfDead()) {
            return;
        }
        var prevHp = this.hp;
        var healAmt = 0;
        if (this.hp < this.hpMax) {
            var canHealAmt = this.hpMax - this.hp;
            var healAmt = 0;
            for (var i = 0; i < canHealAmt && i < hp; i++) {
                healAmt++;
            }
            this.hp += healAmt;
        }
        console.log(`${this.name} healed for ${healAmt}hp.`)
        console.log(`${this.name} ${this.hp}hp`)
    }

    public takeDamage(dmg: number) {
        this.hp -= dmg;
        this.isDead = this.hp > 0 ? false : true;
        console.log(`${this.name} took ${dmg} damage.`)
        console.log(`${this.name} ${this.hp}hp`)
        this.checkIfDead();
    }

    public checkIfDead(): boolean {
        if (this.isDead) {
            console.log(`${this.name} has perished.`)
            return true;
        }
        else {
            return false;
        }
    }

}