import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { WebsocketService } from 'src/app/websocket.service';
import { Card } from 'src/models/card';
import { Player } from 'src/models/player';
import { Message } from 'src/models/message';

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

    constructor(private messageService: MessageService) {
        messageService.messages.subscribe(msg => {
            console.log("screen.component received message: ", msg);
		});

        // this.gameMessage = gameService.gameMessage;
        this.sendMessage({
            from: 'APP',
            data: 'screen is ready'
        })
        this.table = "table area";
    }

    private sendMessage(message: Message) {
        this.messageService.messages.next(message);
        console.log('sent message: ', message);
    }

    public sendTestMessage() {
        this.sendMessage({
            from: 'APP',
            data: 'screen is ready'
        })
    }
}
