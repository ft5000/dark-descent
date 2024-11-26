import { GameRunner } from "./GameRunner.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Attribute } from "./enums/Attribute.js";
import { Color } from "./enums/Color.js";
import { Command } from "./enums/Command.js";
export class GameInput {
    static _instance;
    input = "";
    inputField;
    onKeydownHandler;
    infoText;
    confirmMode = false;
    selectHero = false;
    onSelect;
    onConfirm;
    helpText;
    init() {
        this.input = "";
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.location.href = "mobile.html";
        }
        const readInput = this.readInputCommand.bind(this);
        document.addEventListener('keyup', function (event) {
            if (event.key == "Enter" && !GameUI.get().isPrinting()) {
                readInput();
            }
        });
    }
    appendInputField(text) {
        const inputField = document.createElement('span');
        inputField.id = 'input-field';
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
    removeInputField() {
        this.inputField.remove();
        this.inputField = null;
        this.input = "";
        this.infoText.remove();
        this.infoText = null;
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
        if (this.confirmMode) {
            if ((this.input == "yes" || this.input == "y") && this.onConfirm != null) {
                GameUI.get().log(this.input);
                this.onConfirm();
                this.onConfirm = null;
                this.helpText = null;
                this.confirmMode = false;
                valid = true;
            }
            if ((this.input == "no" || this.input == "n") && this.onConfirm != null) {
                GameUI.get().log(this.input);
                GameUI.get().printLog();
                this.onConfirm = null;
                this.helpText = null;
                this.confirmMode = false;
                valid = true;
            }
        }
        else if (this.selectHero) {
            var heroName = this.input.split(" ").join(" ");
            if (GameRunner.get().party.some(h => h.name.toLocaleLowerCase() == heroName)) {
                var hero = GameRunner.get().party.find(h => h.name.toLocaleLowerCase() == heroName);
                GameUI.get().log('&nbsp;', null, 0);
                this.onSelect(hero);
            }
            else {
                GameUI.get().log('Hero not found.', Color.gray, 0);
                GameUI.get().log('&nbsp;', null, 0);
            }
            GameUI.get().printLog();
            this.selectHero = false;
            valid = true;
        }
        else {
            if (this.input == Command.newGame && GameRunner.get().newInstance) {
                GameRunner.get().newGame();
                if (Number(AppInfo.skipIntro) != 1) {
                    GameUI.get().intro();
                    GameUI.get().title();
                }
                GameRunner.get().play();
                valid = true;
            }
            else if (this.input == Command.newGame && !GameRunner.get().newInstance) {
                this.helpText = "Please confirm: y/n";
                GameUI.get().log("Are you sure?");
                GameUI.get().printLog(this.helpText);
                var onConfirm = function onConfirm() {
                    GameRunner.get().newGame();
                    if (Number(AppInfo.skipIntro) != 1) {
                        GameUI.get().intro();
                        GameUI.get().title();
                    }
                    GameRunner.get().play();
                };
                this.onConfirm = onConfirm.bind(this);
                this.confirmMode = true;
                valid = true;
            }
            if (this.input == Command.play) {
                if (!GameRunner.get().isGameOver()) {
                    GameRunner.get().play();
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
            if (this.input == Command.matrixTheme) {
                GameUI.get().setMatrixTheme();
                valid = true;
            }
            if (this.input == Command.bloodTheme) {
                GameUI.get().setBloodTheme();
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
            if (this.input == Command.gameStats) {
                GameUI.get().printGameStats();
                valid = true;
            }
            if (this.input == Command.inventory) {
                GameUI.get().inventory();
                valid = true;
            }
            if (this.input.startsWith(Command.use + " ")) {
                var itemName = this.input.split(" ").slice(1).join(" ").toLocaleLowerCase();
                var item = GameRunner.get().inventory.find(i => i.name.toLocaleLowerCase() == itemName);
                if (item) {
                    if (item.attribute == Attribute.HealAll || item.attribute == Attribute.CureAll) {
                        switch (item.attribute) {
                            case Attribute.HealAll:
                                item.healAll();
                                break;
                            case Attribute.CureAll:
                                item.cureAll();
                                break;
                        }
                        GameUI.get().log('&nbsp;');
                        GameUI.get().log(`Used ${item.name}.`);
                        GameUI.get().log('Item has been removed from inventory.');
                        GameUI.get().log('&nbsp;');
                        var index = GameRunner.get().inventory.findIndex(i => i.name.toLocaleLowerCase() == itemName);
                        GameRunner.get().inventory.splice(index, 1);
                    }
                    else if (item.attribute == Attribute.Heal || item.attribute == Attribute.Cure) {
                        GameUI.get().log(`Using ${item.name} - ${item.description}`);
                        GameUI.get().log(`Select target:`, null, 0);
                        this.selectHero = true;
                        var onSelect = function onSelect(hero) {
                            if (item.attribute == Attribute.Heal) {
                                item.heal(hero);
                            }
                            if (item.attribute == Attribute.Cure) {
                                item.cure(hero);
                            }
                            GameUI.get().log('&nbsp;');
                            GameUI.get().log(`Used ${item.name}.`);
                            GameUI.get().log('Item has been removed from inventory.');
                            GameUI.get().log('&nbsp;');
                            var index = GameRunner.get().inventory.findIndex(i => i.name.toLocaleLowerCase() == itemName);
                            GameRunner.get().inventory.splice(index, 1);
                        };
                        this.onSelect = onSelect.bind(this);
                        valid = true;
                    }
                }
                else {
                    GameUI.get().log('Item not found.', null, 0);
                    GameUI.get().log('&nbsp;');
                }
                GameUI.get().printLog();
                valid = true;
            }
        }
        if (valid) {
            this.removeInputField();
        }
        else {
            GameUI.get().log(this.input, null, 0);
            GameUI.get().log('Invalid command.', null, 0);
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
