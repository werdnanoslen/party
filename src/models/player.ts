import { Card } from './card';

export class Player {
    public name: string = "anonymous" + Date.now();
    public points: number = 0;
    private socket;
    private cards: Card[] = [];

    constructor (name?: string) {
        if (undefined !== name) {
            this.name = name;
        }
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

    public getSocket() {
        return this.socket;
    }

    public setName(name): void {
        //TODO: check if name is already taken
        console.log(this.name + " renamed to " + name);
        this.name = name;
    }

}
