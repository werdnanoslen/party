import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/app/game.service';
import { Player } from 'src/app/player';
import { Card } from 'src/app/card';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.css']
})

export class ControllerComponent implements OnInit {
    score: Observable<number>;
    isGameStarted: Observable<boolean>;
    isTurn: Observable<boolean>;
    readonly handSize = 5;
    cards: Observable<Card[]>;

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.score = this.gameService.score;
        this.isGameStarted = this.gameService.gameStarted;
        this.isTurn = this.gameService.turn;
        this.cards = this.gameService.cards;
    }

    loadScore() {
        this.gameService.getScore;
    }

    startGame() {
        if (players.length >= minPlayers) {
            for (var i = 0; i < players.length; ++i) {
                players[i].setHand(players[i].hand);
            }
            this.gameService.startGame;
        } else {
            alert("You're the only player right now, and you need at least two to start the game.")
        }
    }

    setCards(cards) {
        this.gameService.getCards;
    }

    playCard(card) {
        this.gameService.playCard;
    }
}
