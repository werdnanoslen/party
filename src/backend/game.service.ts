import { Player } from '../models/player';
import { Card } from '../models/card';
import { Deck } from '../models/deck';
import * as BLACK_CARD_CONTENTS from "../assets/cards/core_bcards.json";
import * as WHITE_CARD_CONTENTS from "../assets/cards/core_wcards.json";

const HAND_SIZE: number = 5;
const MAX_PLAYERS: number = 12;
const MIN_PLAYERS: number = 3;

export class GameService {
    public players: Player[] = [];
    public currentPlayer: Player;
    public cardsInPlay: { player: Player, card: Card }[] = [];
    public blackCard: Card;
    public whiteDeck: Deck;
    public blackDeck: Deck;
    public gameMessage: string = 'game is ready';
    public gameStarted: boolean = false;
    public screenReady: boolean = false;

    constructor() {
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

    public startGame(): void {
        let morePeopleNeeded = MIN_PLAYERS - this.players.length;
        if (morePeopleNeeded < 1) {
            this.currentPlayer = this.players[0];
            this.gameStarted = true;
            this.gameMessage = 'It\'s ', this.currentPlayer.name + '\'s turn';
        } else if (morePeopleNeeded === 1) {
            this.gameMessage = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            this.gameMessage = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    }

    private nextTurn(): void {
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

    public chooseCard(card: Card): void {
        console.log(this.currentPlayer.name, ' chose ', card)
    }

    private deal(player: Player, numCardsToDeal: number): void {
        if ((player.getHandSize() + numCardsToDeal) > HAND_SIZE) {
            throw new RangeError('exceeds hand size');
        }
        for (let c = 0; c < numCardsToDeal; ++c) {
            player.acceptCard(this.whiteDeck.draw());
        }
    }

    public playerExists(name: string): boolean {
        for (let p = 0; p < this.players.length; ++p) {
            let player: Player = this.players[p];
            if (name === player.name) {
                return true;
            }
        }
        return false;
    }

    public disconnect(player: Player) {
        let deletedPlayer = this.players.splice(this.players.indexOf(player), 1);
        delete deletedPlayer[0];
        console.log(player.name + " left");

        let morePeopleNeeded = MIN_PLAYERS - this.players.length;
        if (morePeopleNeeded < 1) {
            this.gameMessage = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            this.gameMessage = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            this.gameMessage = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    }

    public connect(name?: string): Player {
        if (this.players.length >= MAX_PLAYERS) {
            this.gameMessage = "Sorry " + name + ", I think we have all our <em>real</em> friends here, don't you? Somebody press start already..."
            throw new RangeError('too many players');
        }

        var player = new Player(name);
        console.log(player.name + " joined");
        this.players.push(player);
        this.deal(player, HAND_SIZE);

        let morePeopleNeeded = MIN_PLAYERS - this.players.length;
        if (morePeopleNeeded < 1) {
            this.gameMessage = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            this.gameMessage = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            this.gameMessage = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }

        return player;
    }
}
