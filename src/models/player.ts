import { Card } from './card';

export class Player {
    public name: string = "anonymous";
    public points: number = 0;
    private cards: Card[] = [];

    constructor (name?: string) {
        this.name = name;
    }

    public acceptCard(card: Card): void {
        this.cards.unshift(card);
    }

    public getHandSize(): number {
        return this.cards.length;
    }

    public playCard(card: Card): void {
        // TODO
    }

    public setName(name): void {
        //TODO: check if name is already taken
        console.log(this.name + " renamed to " + name);
        this.name = name;
    }

}
