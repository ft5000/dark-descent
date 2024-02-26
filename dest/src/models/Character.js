import { GameRunner } from "../GameRunner.js";
import { DamageType } from "../enums/DamageType.js";
import { GameUI } from "../GameUI.js";
import { DataService } from "../main.js";
import { Color } from "../enums/Color.js";
export class Character {
    constructor(data) {
        this.number = null;
        this.race = "Undefined";
        this.statusEffects = [];
        this.data = data;
        this.trait = DataService.get().getTraits(data.isEnemy).find(x => x.name == data.name);
        this.name = data.name;
        this.hp = data.hp;
        this.hpMax = data.hp;
        this.ap = 20;
        this.apMax = 20;
        this.physDmg = data.physDmg;
        this.magDmg = data.magDmg;
        this.critDmg = data.critDmg;
        this.critChance = data.critChance;
        this.isEnemy = data.isEnemy;
        this.isDead = false;
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
        GameUI.get().log(`✚ ${this.getNameAndNumber()} healed for ${healAmt}hp.`, Color.green);
    }
    deductAp(amount) {
        this.ap = (this.ap - amount) > 0 ? (this.ap - amount) : 0;
    }
    replenishAp(amount) {
        if (this.isDead) {
            return;
        }
        const prevAp = this.ap;
        this.ap = (this.ap + amount) < this.apMax ? (this.ap + amount) : this.apMax;
        const diff = Math.abs(prevAp - this.ap);
        if (diff > 0) {
            GameUI.get().log(`🗲 ${this.getNameAndNumber()} replenished ${diff}ap.`, Color.blue);
        }
    }
    takeDamage(dmg) {
        this.hp = (this.hp - dmg) > 0 ? (this.hp - dmg) : 0;
        this.isDead = this.hp > 0 ? false : true;
        GameUI.get().log(`⚔ ${this.getNameAndNumber()} recieved ${dmg} damage and now has ${this.hp}hp remaining.`);
        if (this.isDead) {
            GameUI.get().log(`🕱 ${this.getNameAndNumber()} has perished.`, 'red');
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
            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} healing for ${skill.heal}hp.`, Color.orange);
            targets.forEach(target => {
                target.heal(skill.heal);
                if (skill.statusEffectData) {
                    this.applyStatusEffect(skill, target);
                }
            });
        }
        if (skill.damageType == DamageType.physical) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            var damage = this.calculateDamage(skill.damage, DamageType.physical);
            const isCritical = this.isCriticalHit();
            damage = isCritical ? Math.round(damage * this.critDmg) : damage;
            const isMiss = this.isMiss();
            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} dealing ${damage} damage.`, Color.orange);
            if (!isMiss) {
                if (isCritical) {
                    GameUI.get().log('It was a critical hit!', Color.blue, 1);
                }
                for (let target of targets) {
                    target.takeDamage(damage);
                    if (skill.statusEffectData) {
                        this.applyStatusEffect(skill, target);
                    }
                }
            }
            else {
                GameUI.get().log('But it missed.', Color.gray);
            }
        }
        if (skill.damageType == DamageType.magic) {
            targets = this.getTarget(skill).filter(x => !x.isDead);
            var damage = this.calculateDamage(skill.damage, DamageType.magic);
            const isCritical = this.isCriticalHit();
            damage = isCritical ? Math.round(damage * this.critDmg) : damage;
            const isMiss = this.isMiss();
            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} dealing ${damage} damage.`, Color.orange);
            if (!isMiss) {
                if (isCritical) {
                    GameUI.get().log('It was a critical hit!', Color.blue, 1);
                }
                for (let target of targets) {
                    target.takeDamage(damage);
                    if (skill.statusEffectData) {
                        this.applyStatusEffect(skill, target);
                    }
                }
            }
            else {
                GameUI.get().log('But it missed.', Color.gray, 1);
            }
        }
        this.deductAp(skill.cost);
        GameUI.get().log('&nbsp;', null, 1);
    }
    applyStatusEffect(skill, target) {
        const data = skill.statusEffectData;
        const effect = DataService.get().getStatusEffect(data.name, data.amount, data.turns, data.chance);
        if (!this.resistStatusEffect(effect)) {
            if (!target.statusEffects.some(x => x.name == effect.name) && !target.isDead) {
                target.statusEffects.push(effect);
                const color = effect.isBuff ? Color.green : Color.red;
                const symbol = effect.isBuff ? "▲" : "▼";
                GameUI.get().log(`${symbol} ${effect.name} was applied to ${target.getNameAndNumber()}.`, color);
            }
        }
    }
    checkStatusEffects() {
        const buffs = this.statusEffects.filter(x => x.isBuff);
        const debuffs = this.statusEffects.filter(x => !x.isBuff);
        if (buffs.length > 0) {
            for (let buff of buffs) {
                GameUI.get().log(buff.getText(this), Color.blue);
                this.heal(buff.amount);
                const isDepleted = buff.decreaseTurns();
                if (isDepleted && !this.isDead) {
                    this.statusEffects = this.statusEffects.filter(x => x.name == buff.name);
                    GameUI.get().log(`The effects of ${buff.name} has worn off.`, Color.gray, 1);
                }
            }
            GameUI.get().log('&nbsp;', null, 1);
        }
        if (debuffs.length > 0) {
            for (let debuff of debuffs) {
                GameUI.get().log(debuff.getText(this), Color.red);
                this.takeDamage(debuff.amount);
                const isDepleted = debuff.decreaseTurns();
                if (isDepleted && !this.isDead) {
                    this.statusEffects = this.statusEffects.filter(x => x.name == debuff.name);
                    GameUI.get().log(`${this.getNameAndNumber()} is no longer effected by ${debuff.name}.`, Color.gray, 1);
                }
            }
            GameUI.get().log('&nbsp;', null, 1);
        }
    }
    calculateDamage(skillDamage, type) {
        const damageOutput = type == DamageType.physical ? skillDamage * (this.physDmg * 0.1) : skillDamage * (this.magDmg * 0.1);
        return Math.round(damageOutput);
    }
    isCriticalHit() {
        const roll = Math.random() * 100;
        return roll <= this.critChance ? true : false;
    }
    resistStatusEffect(effect) {
        const roll = Math.random();
        return roll > effect.chance ? true : false;
    }
    isMiss() {
        const roll = Math.random() * 100;
        return roll <= this.critChance / 2 ? true : false;
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
        const allies = GameRunner.get().getTargets(!this.isEnemy);
        var skills;
        // Filter out healing spells of allies are at full health.
        if (!allies.some(x => x.hp != x.hpMax)) {
            skills = this.trait.getSkills().filter(x => x.cost <= this.ap && x.heal == 0);
        }
        else {
            skills = this.trait.getSkills().filter(x => x.cost <= this.ap);
        }
        if (skills.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * skills.length);
        return skills[i];
    }
}
