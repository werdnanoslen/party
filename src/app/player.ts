import { Card } from 'src/app/card';

export class Player {
    public name: string = "anonymous";
    public points: number = 0;
    private cards: Card[] = [];

    constructor (name?: string) {
        this.name = name;
    }

    public acceptCard(card: Card) {
        this.cards.unshift(card);
    }

    public getHandSize() {
        return this.cards.length;
    }

    public playCard(card: Card) {
        if (this.cards.includes(card)) {
            return card;
        } else {
            return false;
        }
    }

    public setName(name) {
        //TODO: check if name is already taken
        console.log(this.name + " renamed to " + name);
        this.name = name;
    }

}
