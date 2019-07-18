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
    private players: any;
    private gameStatus: any;
    private gameStarted: boolean;

    constructor(private messageService: MessageService) {
        this.gameMessage = "0 players connected";
        this.messageService.subject.subscribe((msg: Message) => {
            switch (msg.command) {
                case 'playerConnected':
                    this.messageService.sendMessage('getGameStatus');
                    break;
                case 'getGameStatus':
                    this.gameStatus = msg.data;
                    this.gameMessage = msg.data.gameMessage;
                    this.players = msg.data.players;
                    break;
                case 'screenConnected':
                    console.log('the screen is ready');
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

    public sendTestMessage() {
        this.messageService.sendMessage('test');
    }
}
