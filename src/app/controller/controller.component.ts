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

export class ControllerComponent {
    private player: Player;
    private gameService: GameService;

    constructor(player: Player, gameService: GameService) {
        this.player = player;
        this.gameService = gameService;
    }

    private setName(name: string) {
        this.player.setName(name);
    }

    private acceptCard(card: Card) {
        this.player.acceptCard(card);
    }

    private playCard(card: Card) {
        this.player.playCard(card);
    }

    private chooseCard(card: Card) {
        this.gameService.chooseCard(card);
    }

    private startGame() {
        this.gameService.startGame();
    }
}
