import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/app/game.service';
import { Player } from 'src/app/player';
import { Card } from 'src/app/card';
import { Deck } from 'src/app/deck';
import * as blackCardContents from "src/assets/cards/core_bcards.json";
import * as whiteCardContents from "src/assets/cards/core_wcards.json";

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.css']
})

export class ScreenComponent implements OnInit {
    players: Player[];
    turn: number;
    nextPlayer: Player;
    readonly handSize: 5;
    readonly maxPlayers: 12;
    readonly minPlayers: 3;
    blackDeck: Deck;
    whiteDeck: Deck;
    playedBlackCard: Card;
    playedWhiteCards: Card[];

    constructor(private gameService: GameService) { }

    ngOnInit() {
        let blackCards = [];
        let whiteCards = [];
        for (var i = 0; i < whiteCardContents['cards'].length; ++i) {
            whiteCards.push(new Card(whiteCardContents['cards'][i], 'white'));
        }
        for (var i = 0; i < blackCardContents['cards'].length; ++i) {
            blackCards.push(new Card(blackCardContents['cards'][i], 'black'));

        }
        this.blackDeck = new Deck(blackCards);
        this.whiteDeck = new Deck(whiteCards);
    }

    nextTurn() {
        if (this.players.length < this.minPlayers) {
            console.log("not enough players");
            return;
        }
        for (var i = 0; i < this.playedWhiteCards.length; ++i) {
            this.whiteDeck.discard(this.playedWhiteCards[i]);
        }
        this.playedWhiteCards = [];
        this.blackDeck.discard(playedBlackCard);
        this.playedBlackCard = blackDeck.draw();
        this.nextPlayer = this.players[((++this.turn) % this.players.length)];
        this.nextPlayer.isTurn = true;
        this.nextPlayer.canPlayCard = false;
        for (var i = 0; i < this.players.length; ++i) {
            var player = this.players[i];
            if (player === this.nextPlayer) {
                player.placeCardElement.el.style.visibility = "hidden";
            } else {
                player.placeCardElement.el.style.visibility = "visible";
            }
        }
        console.log("it's " + nextPlayer.name + "'s turn");
        var placeCards = [];
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            if (!player.isTurn) {
                placeCards.push(player.placeCard);
                player.canPlayCard = true;
            }
        }
        nextPlayer.setHand(placeCards);
    }

    // A new player has arrived.
    connect(name) {
        console.log(name + " joined");
        if (players.length >= maxPlayers) {
            console.log("too many players");
            title.innerHTML = "Sorry " + name + ", I think we have all our <em>real</em> friends here, don't you? Somebody press start already..."
            return false;
        }
        var player = new Player(name);
        for (var i = 0; i < this.handSize; ++i) {
            var card = this.whiteDeck.draw();
            card.setOwner(name);
            this.hand.push(card);
        }
        if (players.length == 0) {
            player.isTurn = true;
        }
        players.push(player);

        var morePeopleNeeded = minPlayers - players.length;
        if (morePeopleNeeded < 1 & turn === -1) {
            title.innerText = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            title.innerText = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            title.innerText = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    }

}
