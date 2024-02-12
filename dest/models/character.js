import { GameRunner } from "../GameRunner.js";
import { DamageType } from "../enums/DamageType.js";
export class Character {
    constructor(data, traits) {
        this.isEnemy = false;
        this.data = data;
        this.name = data.name;
        this.hp = data.hp;
        this.hpMax = data.hp;
        this.ap = data.ap;
        this.apMax = data.ap;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.isDead = false;
        this.trait = traits.find(x => x.name == data.trait);
    }
    getName() {
        return this.name;
    }
    setAllegiance(isEnemy) {
        this.isEnemy = isEnemy;
    }
    heal(hp) {
        if (this.isDead) {
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
        console.log(`${this.name} took ${dmg} damage. Current hp: ${this.hp}`);
        if (this.isDead) {
            console.log(`${this.name} has perished.`);
        }
    }
    performAction() {
        const skill = this.getRandomSkill();
        var targets;
        if (skill == null) {
            console.log(`${this.name} has insufficient action points.`);
            return;
        }
        if (skill.damageType == DamageType.none) {
            targets = GameRunner.get().party.filter(x => !x.isDead);
            console.log(`${this.name} performed ${skill.name} healing for ${skill.heal}hp.`);
            targets.forEach(target => {
                target.heal(skill.heal);
            });
        }
        if (skill.damageType == DamageType.physical) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            console.log(`${this.name} performed ${skill.name} causing ${skill.damage} damage... `);
            targets.forEach(target => {
                target.takeDamage(skill.damage);
            });
        }
        if (skill.damageType == DamageType.magic) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            console.log(`${this.name} performed ${skill.name} causing ${skill.damage} damage... `);
            targets.forEach(target => {
                target.takeDamage(skill.damage);
            });
        }
    }
    getTarget(skill) {
        let targets = [];
        if (skill.aoe) {
            targets = GameRunner.get().getTargets(this.isEnemy);
        }
        else {
            targets.push(GameRunner.get().getRandomTarget(this.isEnemy));
        }
        return targets;
    }
    // private getTargetNames(targets: Character[]) {
    //     var names = "";
    //     targets.forEach(target => {
    //         names += ` ${target.getName()}`;
    //     })
    //     return names;
    // } 
    getRandomSkill() {
        const skills = this.trait.getSkills().filter(x => x.cost <= this.ap);
        if (skills.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * skills.length);
        return skills[i];
    }
}
