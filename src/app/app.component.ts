import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { MessageService } from 'src/app/message.service';
import { WebsocketService } from 'src/app/websocket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    public title: string = "Cards Against Humanity";
    public screenReady: boolean;

    constructor(private router: Router, private messageService: MessageService) {
        messageService.messages.subscribe(msg => {
            console.log("app.component received message: ", msg);
            if ('screen is ready' === msg.data) {
                this.screenReady = true;
                this.router.navigate(['/controller']);
            }
        });
    }
}
