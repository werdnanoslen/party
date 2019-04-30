import { Component, OnInit } from '@angular/core';
import { Card } from 'src/models/card';
import { Player } from 'src/models/player';
import { Message } from 'src/models/message';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.css']
})

export class ScreenComponent {
    public playedBlackCard: Card;
    public playedWhiteCards: Card[];
    public gameMessage: string;
    public table: string;
    private gameStatus: any;

    constructor(private messageService: MessageService) {
        this.gameMessage = "0 players connected";
        this.messageService.subject.subscribe((msg: Message) => {
            switch (msg.command) {
                case 'playerConnected':
                    this.messageService.sendMessage('getGameStatus');
                    break;
                case 'getGameStatus':
                    this.gameStatus = msg.data;
                    this.gameMessage = this.gameStatus.players.length + ' players connected';
                    break;
                case 'screenConnected':
                    console.log('the screen is ready');
                    break;
                default:
                    console.log('unknown message: ', msg.data);
                    break;
            }
        });
    }

    public sendTestMessage() {
        this.messageService.sendMessage('test');
    }
}
