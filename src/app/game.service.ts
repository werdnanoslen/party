import { Injectable } from '@angular/core';
import { Player } from './player';
import { Card } from './card';
import { Deck } from './deck';
import * as BLACK_CARD_CONTENTS from "src/assets/cards/core_bcards.json";
import * as WHITE_CARD_CONTENTS from "src/assets/cards/core_wcards.json";

const HAND_SIZE: number = 5;
const MAX_PLAYERS: number = 12;
const MIN_PLAYERS: number = 3;

@Injectable({
    providedIn: 'root'
})

export class GameService {
    public players: Player[] = [];
    public currentPlayer: Player;
    public cardsInPlay: { player: Player, card: Card }[] = [];
    public blackCard: Card;
    public whiteDeck: Deck;
    public blackDeck: Deck;

    constructor() { }

    ngOnInit() {
        let blackCards = [];
        let whiteCards = [];
        for (let i = 0; i < WHITE_CARD_CONTENTS['cards'].length; ++i) {
            whiteCards.push(new Card(WHITE_CARD_CONTENTS['cards'][i], 'white'));
        }
        for (let i = 0; i < BLACK_CARD_CONTENTS['cards'].length; ++i) {
            blackCards.push(new Card(BLACK_CARD_CONTENTS['cards'][i], 'black'));
        }
        this.blackDeck = new Deck(blackCards);
        this.whiteDeck = new Deck(whiteCards);
    }

    public startGame() {
        if (this.players.length < MIN_PLAYERS) {
            alert("Not enough players.")
        } else {
            this.currentPlayer = this.players[0];
        }
    }

    private nextTurn() {
        // discard cards
        this.blackDeck.discard(this.blackCard);
        this.blackCard = undefined;
        for (let c = 0; c < this.cardsInPlay.length; ++c) {
            let card:Card = this.cardsInPlay.pop().card;
            this.whiteDeck.discard(card);
        }

        // draw cards
        this.blackCard = this.blackDeck.draw();

        // next player
        let curr:number = this.players.indexOf(this.currentPlayer);
        let next:number = ++curr % this.players.length;
        this.currentPlayer = this.players[next];
        console.log("it's " + this.currentPlayer.name + "'s turn");
    }

    public chooseCard(card: Card) {
        console.log(this.currentPlayer.name, ' chose ', card)
    }

    private deal(player: Player, numCardsToDeal: number) {
        if ((player.getHandSize() + numCardsToDeal) > HAND_SIZE) {
            return false;
        }
        for (let c = 0; c < numCardsToDeal; ++c) {
            player.acceptCard(this.whiteDeck.draw());
        }
    }

    public disconnect(player: Player) {
        let deletedPlayer = this.players.splice(this.players.indexOf(player), 1);
        delete deletedPlayer[0];
        console.log(player.name + " left");

        let morePeopleNeeded = MIN_PLAYERS - this.players.length;
        if (morePeopleNeeded < 1) {
            // this.title = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            // this.title = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            // this.title = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    }

    public connect(name: string) {
        if (this.players.length >= MAX_PLAYERS) {
            console.log("too many players");
            // this.title = "Sorry " + name + ", I think we have all our <em>real</em> friends here, don't you? Somebody press start already..."
            return false;
        }

        console.log(name + " joined");
        var player = new Player(name);
        this.players.push(player);
        this.deal(player, HAND_SIZE);

        let morePeopleNeeded = MIN_PLAYERS - this.players.length;
        if (morePeopleNeeded < 1) {
            // this.title = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            // this.title = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            // this.title = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    }
}
