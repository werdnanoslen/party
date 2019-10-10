import { Card } from './card';

export class Player {
    public name: string;
    public points: number = 0;
    private cards: Card[] = [];

    constructor (name?: string) {
        if (name) {
            this.name = name;
        } else {
            this.name = "anonymous" + Date.now();
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

}
