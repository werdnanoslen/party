import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
// import { GameService } from 'src/app/game.service';
import { Card } from 'src/models/card';
import { Player } from 'src/models/player';
import { Message } from 'src/models/message';
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
    private gameStarted: boolean;
    private gameReady: boolean;

    constructor(private messageService: MessageService/*gameService: GameService*/) {
        // this.gameService = gameService;
        // this.gameStarted = gameService.isGameStarted();
        // this.player = this.gameService.connect(this.name);
        // this.messageService.sendMessage('getPlayer');
        this.messageService.subject.subscribe((msg: Message) => {
            switch (msg.command) {
                case 'playerConnected':
                    this.updatePlayer(msg.data);
                    break;
                case 'getPlayer':
                    this.updatePlayer(msg.data);
                    break;
                case 'gameReady':
                    this.gameReady = msg.data;
                    break;
                case 'gameStarted':
                    this.gameStarted = msg.data;
                    break;
                default:
                    console.log('unhandled message: ', msg);
                    break;
            }
        });
    }

    private updatePlayer(playerData: any): void {
        let keys = Object.keys(playerData);
        let newPlayerObject = {};
        for (var k=0; k<keys.length; ++k) {
            let key = keys[k];
            newPlayerObject[key] = playerData[key];
        }
        if (this.player === undefined) {
            this.player = new Player;
        }
        Object.assign(this.player, newPlayerObject);
    }

    private changeName(form: any) {
        let newName:string = form.name;
        this.messageService.sendMessage('changeName', newName);
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
        this.messageService.sendMessage('startGame');
    }
}
