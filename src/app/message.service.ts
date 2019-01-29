import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

const BACKEND_URL = 'ws://localhost:5000/';

@Injectable()
export class MessageService {
    public subject: Subject<Message>;
    private from: string = localStorage.getItem('from');

	constructor() {
        let userRoute = this.from !== undefined ? this.from : '';
        this.subject = webSocket(BACKEND_URL + userRoute);
        this.subject.subscribe(
            (msg: Message) => {
                console.log('message received: ', msg);
                let to = msg.data.split('hello ')[1];
                if (undefined !== to) {
                    this.from = to;
                    localStorage.setItem('from', this.from);
                }
            },
            (err) => console.log(err),
            () => console.log('complete')
        );
	}

    public sendMessage (data: string): void {
        let message: Message = {
            from: this.from,
            data: data
        };
        this.subject.next(message);
    }
}
