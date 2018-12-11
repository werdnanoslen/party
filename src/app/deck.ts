import { Card } from 'src/app/card';

export class Deck {
    public cards: Card[] = [];
    private drawCount: number = 0;

    constructor(cards) {
        this.cards = cards;
        this.shuffle();
    }

    public discard(card) {
        this.cards.unshift(card);
    }

    public draw() {
        this.drawCount++;
        if (this.drawCount > this.cards.length) {
            this.shuffle();
            this.drawCount = 0;
        }
        return this.cards.pop();
    }

    private shuffle() {
        // derived from https://github.com/Daplie/knuth-shuffle
        var currentIndex = this.cards.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    }
}
