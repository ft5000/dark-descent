export class Hero {
    constructor(data) {
        this.name = "";
        this.hp = 0;
        this.hpMax = 0;
        this.physDmg = 0;
        this.magDmg = 0;
        this.isDead = true;
        this.name = data.name;
        this.hp = data.hp;
        this.hpMax = data.hp;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.isDead = false;
    }
    changeName(name) {
        var prevName = this.name;
        this.name = name;
        console.log(`${prevName} has become ${this.name}!`);
    }
    heal(hp) {
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
        console.log(`${this.name} healed for ${healAmt}hp.`);
        console.log(`${this.name} ${this.hp}hp`);
    }
    takeDamage(dmg) {
        this.hp -= dmg;
        this.isDead = this.hp > 0 ? false : true;
        console.log(`${this.name} took ${dmg} damage.`);
        console.log(`${this.name} ${this.hp}hp`);
        this.checkIfDead();
    }
    checkIfDead() {
        if (this.isDead) {
            console.log(`${this.name} has perished.`);
            return true;
        }
        else {
            return false;
        }
    }
}
