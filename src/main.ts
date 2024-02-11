import { Hero } from "./models/hero.js";
import heroesJson from '../data/heroes.json' assert { type: 'json' }

console.log('test ts2')
const heroes: Hero[] = [];

heroesJson.forEach((data: any) => {
    heroes.push(new Hero(data))
});

heroes[0].changeName("Johnny The Barbarian")


heroes[0].takeDamage(4);
heroes[0].heal(2);
heroes[0].takeDamage(200);
heroes[0].heal(22);


