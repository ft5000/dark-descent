import { GameRunner } from "../GameRunner.js";
import { DamageType } from "../enums/DamageType.js";
import { ICharacter } from "./ICharacter.js";
import { Skill } from "./Skill.js";
import { GameUI } from "../GameUI.js";
import { Trait } from "./Trait.js";
import { DataService } from "../main.js";
import { Color } from "../enums/Color.js";

export class Character implements ICharacter {
    name: string;
    hp: number;
    hpMax: number;
    ap: number;
    apMax: number;
    physDmg: number;
    magDmg: number;
    critDmg: number;
    critChance: number
    isDead: boolean;
    trait: Trait;
    isEnemy: boolean;
    number: number = null;
    race: string = "Undefined";
    data: any;

    constructor(data: any) {
        this.data = data;

        this.trait = DataService.get().getTraits(data.isEnemy).find(x => x.name == data.name)
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

    public setNumber(num: number) {
        this.number = num;
    }

    public getNameAndNumber() {
        let name = this.name;
        if (this.number) {
            name += ` ${this.number}`
        }
        return name;
    }

    getName(): string {
        return this.name;
    }

    public setAllegiance(isEnemy: boolean) {
        this.isEnemy = isEnemy;
    }

    public heal(hp: number) {
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
        GameUI.get().log(`✚ ${this.getNameAndNumber()} healed for ${healAmt}hp.`, Color.green)
    }

    public deductAp(amount: number) {
        this.ap = (this.ap - amount) > 0 ? (this.ap - amount) : 0;
    }

    public replenishAp(amount: number) {
        if (this.isDead) {
            return;
        }
        const prevAp = this.ap;
        this.ap = (this.ap + amount) < this.apMax ? (this.ap + amount) : this.apMax;
        const diff = Math.abs(prevAp - this.ap)
        if (diff > 0) {
            GameUI.get().log(`🗲 ${this.getNameAndNumber()} replenished ${diff}ap.`, Color.blue)
        }
    }

    public takeDamage(dmg: number) {
        this.hp = (this.hp - dmg) > 0 ? (this.hp - dmg) : 0;
        this.isDead = this.hp > 0 ? false : true;
        GameUI.get().log(`⚔ ${this.getNameAndNumber()} recieved ${dmg} damage and now has ${this.hp}hp remaining.`)
        if(this.isDead) {
            GameUI.get().log(`🕱 ${this.getNameAndNumber()} has perished.`, 'red')
        }
    }

    public performAction() {
        const skill = this.getRandomSkill();
        var targets;
        
        if (skill == null) {
            GameUI.get().log(`${this.getNameAndNumber()} has insufficient action points.`)
            return;
        }

        if (skill.damageType == DamageType.none) {
            targets = GameRunner.get().party.filter(x => !x.isDead)
            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} healing for ${skill.heal}hp.`, Color.orange)
            targets.forEach(target => {
                target.heal(skill.heal)
            })
        }

        if (skill.damageType == DamageType.physical) {
            targets = this.getTarget(skill).filter(x => !x.isDead)

            var damage = this.calculateDamage(skill.damage, DamageType.physical)
            const isCritical = this.isCriticalHit();
            damage = isCritical ? Math.round(damage * this.critDmg) : damage;
            const isMiss = this.isMiss()

            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} dealing ${damage} damage.`, Color.orange)
            if (!isMiss) {
                if (isCritical) {
                    GameUI.get().log('It was a critical hit!', Color.blue, 1);
                }

                for (let target of targets) {
                    target.takeDamage(damage)
                }
            }
            else {
                GameUI.get().log('But it missed.', Color.gray);
            }
        }

        if (skill.damageType == DamageType.magic) {
            targets = this.getTarget(skill).filter(x => !x.isDead)

            var damage = this.calculateDamage(skill.damage, DamageType.magic)
            const isCritical = this.isCriticalHit();
            damage = isCritical ? Math.round(damage * this.critDmg) : damage;
            const isMiss = this.isMiss()

            GameUI.get().log(`${this.getNameAndNumber()} performed ${skill.name} dealing ${damage} damage.`, Color.orange)
            if (!isMiss) {
                if (isCritical) {
                    GameUI.get().log('It was a critical hit!', Color.blue, 1);
                }

                for (let target of targets) {
                    target.takeDamage(damage)
                }
            }
            else {
                GameUI.get().log('But it missed.', Color.gray, 1);
            }
        }
        this.deductAp(skill.cost)
        GameUI.get().log('&nbsp;', null, 1)
    }

    private calculateDamage(skillDamage: number, type: DamageType): number {
        const damageOutput = type == DamageType.physical ? skillDamage * (this.physDmg * 0.1) : skillDamage * (this.magDmg * 0.1);
        return Math.round(damageOutput);
    }

    private isCriticalHit(): boolean {
        const roll = Math.random() * 100;
        return roll <= this.critChance ? true : false;
    }

    private isMiss(): boolean {
        const roll = Math.random() * 100;
        return roll <= this.critChance  / 2 ? true : false;
    }

    public getTarget(skill: Skill) {
        let targets = [];
        if (skill.aoe) {
            targets = GameRunner.get().getTargets(this.isEnemy);
        }
        else {
            targets.push(GameRunner.get().getRandomTarget(this.isEnemy))
        }
        return targets;
    }

    private getRandomSkill() {
        const skills = this.trait.getSkills().filter(x => x.cost <= this.ap)
        if (skills.length == 0) {
            return null;
        }
        const i = Math.floor(Math.random() * skills.length);
        return skills[i];
    }
}