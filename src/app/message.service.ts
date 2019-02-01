import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

const BACKEND_URL = 'ws://localhost:5000/';

@Injectable()
export class MessageService {
    public subject: Subject<Message>;
    private from: string;// = sessionStorage.getItem('from');

	constructor() {
        let url = BACKEND_URL;// + (this.from !== undefined ? this.from : '');
        this.subject = webSocket(url);
        this.subject.subscribe(
            (msg: Message) => {
                console.log('message received: ', msg);
                let to = msg.data.split('hello ')[1];
                if (undefined !== to) {
                    this.from = to;
                    // sessionStorage.setItem('from', this.from);
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
