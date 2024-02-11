class Hero {
    name: string = "";
    hp: number = 0;

    constructor(data: any) {
        this.name = data.name;
        this.hp = data.hp;
    }
}