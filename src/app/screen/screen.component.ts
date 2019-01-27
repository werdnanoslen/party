import { Component, OnInit } from '@angular/core';
import { Card } from 'src/models/card';
import { Player } from 'src/models/player';
import { MessageService } from '../message.service'

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
    private messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
    }

    public sendTestMessage() {
        this.messageService.sendMessage('APP', 'screen is ready');
    }
}
