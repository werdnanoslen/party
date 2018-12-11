import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
    @Input() public name: string;
    private gameService: GameService;

    constructor(player: Player, gameService: GameService) {
        this.player = player;
        this.name = player.name;
        this.gameService = gameService;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('name' in changes) {
            this.player.setName(changes['name'].currentValue);
        }
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
