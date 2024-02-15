import { GameRunner } from "./GameRunner.js";
import { GameUI } from "./GameUI.js";
import { Command } from "./enums/Command.js";
export class GameInput {
    constructor() {
        this.input = "";
    }
    init() {
        this.input = "";
        const readInput = this.readInputCommand.bind(this);
        document.addEventListener('keyup', function (event) {
            if (event.key == "Enter" && !GameUI.get().isPrinting()) {
                console.log('read');
                readInput();
            }
        });
    }
    appendInputField() {
        const element = document.createElement('b');
        element.id = 'input-field';
        const textbox = document.getElementById('console');
        // Check if event listener is added.
        if (!this.onKeydownHandler) {
            const getkey = this.getKey.bind(this);
            const func = function onKeydown(e) {
                if (!GameUI.get().isPrinting()) {
                    getkey(e);
                }
            };
            document.addEventListener('keydown', func);
            this.onKeydownHandler = func;
        }
        this.inputField = element;
        textbox.append(element);
        GameUI.get().scrollToBottom();
    }
    removeInputField() {
        this.inputField.remove();
        this.inputField = null;
        this.input = "";
    }
    updateInput() {
        if (this.inputField) {
            this.inputField.innerHTML = this.input;
        }
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
        this.updateInput();
    }
    readInputCommand() {
        var valid = false;
        if (this.input == Command.play) {
            GameRunner.get().play();
            valid = true;
        }
        if (this.input == Command.help) {
            GameUI.get().listCommands();
            valid = true;
        }
        if (valid) {
            this.removeInputField();
        }
    }
    static get() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameInput();
        return this._instance;
    }
}
