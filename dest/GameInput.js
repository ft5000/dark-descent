import { GameRunner } from "./GameRunner.js";
import { GameUI } from "./GameUI.js";
export class GameInput {
    constructor() {
        this.input = "";
    }
    init() {
        this.input = "";
        const getkey = this.getKey.bind(this);
        document.addEventListener('keydown', function (e) {
            getkey(e);
        });
        const run = GameRunner.get().play.bind(GameRunner.get());
        document.addEventListener('keyup', function (event) {
            if (event.key == "Enter") {
                run();
            }
        });
    }
    getKey(event) {
        if (event.keyCode <= 90 && event.keyCode >= 48) {
            this.input += event.key.toLowerCase();
        }
        if (event.key == " ") {
            this.input += event.key;
        }
        if (event.key == "Backspace") {
            this.input = this.input.slice(0, -1);
        }
        GameUI.get().updateInput(this.input);
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameInput();
        return this._instance;
    }
}
