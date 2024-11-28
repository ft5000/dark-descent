import { GameRunner } from "./GameRunner.js";
import { GameUI } from "./GameUI.js";
import { AppInfo } from "./enums/AppInfo.js";
import { Attribute } from "./enums/Attribute.js";
import { Color } from "./enums/Color.js";
import { Command } from "./enums/Command.js";
export class ListItem {
    id;
    value;
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
}
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
    list = [];
    select = false;
    previous;
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
        else if (this.select) {
            var selected = this.list.find(l => l.id == Number(this.input) - 1);
            if (selected == null) {
                GameUI.get().log('Invalid selection.', null, 0);
                GameUI.get().printLog();
                this.setSelectMode(false);
            }
            else {
                this.onSelect(selected.value);
            }
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
                GameUI.get().logInventory(true);
                GameUI.get().printLog();
                valid = true;
            }
            if (this.input == Command.use) {
                if (GameRunner.get().inventory.length == 0) {
                    GameUI.get().log("You have no items in your inventory.");
                    GameUI.get().log("&nbsp;");
                    GameUI.get().printLog();
                    valid = true;
                }
                else {
                    GameUI.get().log('Please specify an item.', null, 0);
                    this.list = this.createList(GameRunner.get().uniqueItems);
                    this.logList(this.list, GameUI.get().logInventory.bind(GameUI.get()));
                    this.onSelect = this.onUseItem.bind(this);
                    GameUI.get().printLog(this.setSelectMode());
                    valid = true;
                }
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
    createList(array) {
        var list = [];
        for (let i = 0; i < array.length; i++) {
            list.push(new ListItem(i, array[i]));
        }
        return list;
    }
    logList(list, logFn) {
        if (logFn) {
            logFn();
            return;
        }
        for (let i = 0; i < list.length; i++) {
            GameUI.get().log(`${list[i].id + 1}. ${list[i].value}`);
        }
        GameUI.get().log('&nbsp;');
    }
    onUseItem(item) {
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
                var index = GameRunner.get().inventory.findIndex(i => i.name == item.name);
                GameRunner.get().inventory.splice(index, 1);
                this.setSelectMode(false);
                GameUI.get().printLog();
            }
            else if (item.attribute == Attribute.Heal || item.attribute == Attribute.Cure) {
                GameUI.get().log(`Using ${item.name} - ${item.description}`);
                GameUI.get().log(`Select target:`, null, 0);
                this.list = this.createList(GameRunner.get().party.map(h => h.name));
                this.logList(this.list);
                this.previous = item;
                this.onSelect = this.onUseItemHeroSelect.bind(this);
                GameUI.get().printLog(this.setSelectMode());
            }
        }
    }
    onUseItemHeroSelect(name) {
        var item = this.previous;
        var hero = GameRunner.get().party.find(h => h.name == name);
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
        var index = GameRunner.get().inventory.findIndex(i => i.name.toLocaleLowerCase() == item.name);
        GameRunner.get().inventory.splice(index, 1);
        this.setSelectMode(false);
        GameUI.get().printLog();
    }
    setSelectMode(value = true) {
        this.select = value;
        return value == true ? `Please select an option [1-${this.list?.length}]` : 'Select mode disabled.';
    }
}
