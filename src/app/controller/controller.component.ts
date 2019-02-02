import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
// import { GameService } from 'src/app/game.service';
import { Card } from 'src/models/card';
import { Player } from 'src/models/player';
import { MessageService } from '../message.service'

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.css']
})

export class ControllerComponent {
    @Input() public name: string;
    private player: Player;
    // private gameService: GameService;
    public gameStarted: boolean;

    constructor(private messageService: MessageService/*gameService: GameService*/) {
        // this.gameService = gameService;
        // this.gameStarted = gameService.isGameStarted();
        // this.player = this.gameService.connect(this.name);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('name' in changes) {
            let newName:string = changes['name'].currentValue
            // if (newName in this.gameService.players) {
            //     console.log('this name is already taken');
            // } else {
            //     this.player.setName(newName);
            // }
        }
    }

    private acceptCard(card: Card): void {
        this.player.acceptCard(card);
    }

    private playCard(card: Card): void {
        this.player.playCard(card);
    }

    private chooseCard(card: Card): void {
        // this.gameService.chooseCard(card);
    }

    private startGame(): void {
        // this.gameService.startGame();
    }
}
