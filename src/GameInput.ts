import { GameRunner } from "./GameRunner.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Color } from "./enums/Color.js";
import { Command } from "./enums/Command.js";

export class GameInput {
    private static _instance: GameInput;
    public input: string = "";
    private inputField: HTMLElement;
    private onKeydownHandler: Function;
    private infoText: HTMLElement;
    private confirmMode: boolean = false;
    private onConfirm: Function;
    private helpText: string;

    public init() {
        this.input = "";

        const readInput = this.readInputCommand.bind(this);
        document.addEventListener('keyup', function(event: KeyboardEvent) { 
            if (event.key == "Enter" && !GameUI.get().isPrinting()) {
                readInput();
            }
        })

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.location.href = "mobile.html";
        }
    }

    public appendInputField(text?: string) {
        const inputField = document.createElement('span');
        inputField.id = 'input-field';
        const textbox: HTMLElement = document.getElementById('console');

        // Check if event listener is added.
        if (!this.onKeydownHandler) {
            const getkey = this.getKey.bind(this);
            const func = function onKeydown(e: KeyboardEvent) {
                if (!GameUI.get().isPrinting()) {
                    getkey(e) 
                }
            }
            document.addEventListener('keydown', func)
            this.onKeydownHandler = func;
        }

        this.inputField = inputField;
        textbox.append(inputField);

        const infoText = document.createElement('span');
        if (text != null) {
            infoText.innerHTML = text;
        }
        else {
            infoText.innerHTML = "Type 'help' for commands";
        }
        infoText.style.color = Color.gray;
        infoText.style.userSelect = 'none';
        this.infoText = infoText;
        textbox.append(infoText);

        GameUI.get().scrollToBottom();
    }

    public removeInputField() {
        this.inputField.remove();
        this.inputField = null;
        this.input = "";

        this.infoText.remove();
        this.infoText = null;
    }

    private updateInput() {
        if (this.inputField){
            this.inputField.innerHTML = this.input;
        }
    }

    private getKey(event: KeyboardEvent) {
        if (event.keyCode <=  90 && event.keyCode >=  48) {
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

    private readInputCommand() {
        var valid = false;

        if (this.confirmMode) {
            if ((this.input == "yes" || this.input == "y") && this.onConfirm != null) {
                GameUI.get().log(this.input)
                this.onConfirm();
                this.onConfirm = null;
                this.helpText = null;
                this.confirmMode = false;
                valid = true;
            }
            if ((this.input == "no" || this.input == "n")&& this.onConfirm != null) {
                GameUI.get().log(this.input)
                GameUI.get().printLog();
                this.onConfirm = null;
                this.helpText = null;
                this.confirmMode = false;
                valid = true;
            }
        }
        else {
            if (this.input == Command.newGame && GameRunner.get().newInstance) {
                GameRunner.get().newGame()
                if (Number(AppInfo.skipIntro) != 1) {
                    GameUI.get().intro();
                    GameUI.get().title();
                }
                GameRunner.get().play()
                valid = true;
            }
            else if (this.input == Command.newGame && !GameRunner.get().newInstance) {
                this.helpText = "Please confirm: y/n"
                GameUI.get().log("Are you sure?");
                GameUI.get().printLog(this.helpText);
                var onConfirm = function onConfirm() {
                    GameRunner.get().newGame()
                    if (Number(AppInfo.skipIntro) != 1) {
                        GameUI.get().intro();
                        GameUI.get().title();
                    }
                    GameRunner.get().play()
                }
                this.onConfirm = onConfirm.bind(this)
                this.confirmMode = true;
                valid = true;
            }
            if (this.input == Command.play) {
                if (!GameRunner.get().isGameOver()) {
                    GameRunner.get().play()
                    valid = true;
                }
                else {
                    GameUI.get().log("Please input 'new game' to start a new game.", null, 0.1);
                }
            }
            if (this.input == Command.enemyStats) {
                GameUI.get().stats(false);
                valid = true;
            }
            if (this.input == Command.partyStats) {
                GameUI.get().stats(true);
                valid = true;
            }
            if (this.input == Command.dosTheme) {
                GameUI.get().setMSDosTheme();
                valid = true;
            }
            if (this.input == Command.darkTheme) {
                GameUI.get().setDarkTheme();
                valid = true;
            }
            if (this.input == Command.clear) {
                GameUI.get().clearLog();
                valid = true;
            }
            if (this.input == Command.about) {
                GameUI.get().about();
                valid = true;
            }
            if (this.input == Command.help) {
                GameUI.get().listCommands();
                valid = true;
            }
        }

        if (valid) {
            this.removeInputField();
        }
        else {
            GameUI.get().log(this.input, null, 0.1);
            GameUI.get().log('Invalid command.', null, 0.1);
            this.removeInputField();
            GameUI.get().printLog(this.helpText);
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