import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    public title: string = "Cards Against Humanity";
    private messageService: MessageService;

    constructor(private router: Router) {
        this.messageService = new MessageService();
        this.messageService.subject.subscribe((msg) => {
            if ('hello screen' === msg.data) {
                this.router.navigate(['/screen']);
            } else if ('hello controller' === msg.data) {
                this.router.navigate(['/controller']);
            }
        });
    }
}
