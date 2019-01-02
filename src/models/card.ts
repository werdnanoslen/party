import { Player } from './player';

export class Card {
    public readonly text: string;
    public readonly color: string; //"black" or "white"

    constructor(text, color) {
        this.text = text;
        this.color = color;
    }
}
