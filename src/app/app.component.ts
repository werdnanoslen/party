import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../models/message';
import { MessageService } from './message.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    public title: string = "Cards Against Humanity";

    constructor(private messageService: MessageService, private router: Router) {
        this.messageService.subject.subscribe((msg: Message) => {
            if (msg.command === 'screenConnected') {
                this.router.navigate(['/screen']);
            } else if (msg.command === 'playerConnected'){
                this.router.navigate(['/controller']);
            }
        });
    }
}
