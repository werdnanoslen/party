import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { Player } from 'src/app/player';
import { Card } from 'src/app/card';
import { Deck } from 'src/app/deck';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.css']
})

export class ScreenComponent {
    playedBlackCard: Card;
    playedWhiteCards: Card[];

    constructor(private gameService: GameService) { }
}
