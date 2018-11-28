import { Player } from 'src/app/player';

export class Card {
    readonly text: string;
    readonly color: string; //"black" or "white"
    owner?: Player; //Player obj or undefined

    constructor(text, color, owner?) {
        this.owner = owner;
        this.text = text;
        this.color = color;
    }

    setOwner(name?) {
        if (this.owner == name) {
            return false;
        } else {
            this.owner = name;
            return true;
        }
    }
}
