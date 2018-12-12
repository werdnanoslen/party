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
        this.gameService = gameService;
    }

    ngOnInit () {
        this.player = this.gameService.connect(this.name);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('name' in changes) {
            let newName:string = changes['name'].currentValue
            if (newName in this.gameService.players) {
                console.log('this name is already taken');
            } else {
                this.player.setName(newName);
            }
        }
    }

    private acceptCard(card: Card): void {
        this.player.acceptCard(card);
    }

    private playCard(card: Card): void {
        this.player.playCard(card);
    }

    private chooseCard(card: Card): void {
        this.gameService.chooseCard(card);
    }

    private startGame(): void {
        this.gameService.startGame();
    }
}
