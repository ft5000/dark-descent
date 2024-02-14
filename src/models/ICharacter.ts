export interface ICharacter {
    name: string;
    getName(): string;
    takeDamage(dmg: number): void;
}