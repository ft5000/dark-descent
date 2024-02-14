import { GameRunner } from "../GameRunner.js";
import { DamageType } from "../enums/DamageType.js";
import { GameUI } from "../GameUI.js";
import { DataService } from "../main.js";
export class Character {
    constructor(data) {
        this.isEnemy = false;
        this.number = null;
        this.race = "Undefined";
        this.data = data;
        this.name = data.name;
        this.hp = data.hp;
        this.hpMax = data.hp;
        this.ap = data.ap;
        this.apMax = data.ap;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.isDead = false;
        this.trait = DataService.get().getTraits().find(x => x.name == data.trait);
    }
    setNumber(num) {
        this.number = num;
    }
    getNameAndNumber() {
        let name = this.name;
        if (this.number) {
            name += ` ${this.number}`;
        }
        return name;
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
        GameUI.get().log(`${this.getNameAndNumber()} healed for ${healAmt}hp.`, 'skyblue');
    }
    takeDamage(dmg) {
        this.hp -= dmg;
        this.isDead = this.hp > 0 ? false : true;
        GameUI.get().log(`${this.getNameAndNumber()} took ${dmg} damage. Current hp: ${this.hp}`);
        if (this.isDead) {
            GameUI.get().log(`${this.getNameAndNumber()} has perished.`, 'red');
        }
    }
    performAction() {
        const skill = this.getRandomSkill();
        var targets;
        if (skill == null) {
            GameUI.get().log(`${this.getNameAndNumber()} has insufficient action points.`);
            return;
        }
        if (skill.damageType == DamageType.none) {
            targets = GameRunner.get().party.filter(x => !x.isDead);
            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} healing for ${skill.heal}hp.`, 'limegreen');
            targets.forEach(target => {
                target.heal(skill.heal);
            });
        }
        if (skill.damageType == DamageType.physical) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            GameUI.get().log(`<b style="color: orange">${this.getNameAndNumber()} performed ${skill.name} causing ${skill.damage} damage.`);
            for (let target of targets) {
                target.takeDamage(skill.damage);
            }
        }
        if (skill.damageType == DamageType.magic) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            GameUI.get().log(`<b style="color: orange">${this.getNameAndNumber()} performed ${skill.name} causing ${skill.damage} damage.`);
            for (let target of targets) {
                target.takeDamage(skill.damage);
            }
        }
        GameUI.get().log('&nbsp;', null, 1);
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
    getRandomSkill() {
        const skills = this.trait.getSkills().filter(x => x.cost <= this.ap);
        if (skills.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * skills.length);
        return skills[i];
    }
}
