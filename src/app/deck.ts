import { Card } from 'src/app/card';

export class Deck {
    cards: Card[] = [];

    constructor(cardsArray) {
        this.cards = cardsArray;
    }

    discard(card) {
        this.cards.unshift(card);
        return card;
    }

    draw() {
        return this.cards.pop();
    }

    shuffle() {
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
        return this.cards;
    }
}
