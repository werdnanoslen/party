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
                if (msg.command === 'playerConnected') {
                    this.from = msg.data.name;
                    // sessionStorage.setItem('from', this.from);
                } else if (msg.command === 'screenConnected') {
                    this.from = 'SCREEN'
                }
            },
            (err) => console.log(err),
            () => console.log('complete')
        );
	}

    public sendMessage (command: string, data?: object): void {
        let message: Message = {
            command: command,
            from: this.from,
            data: data
        };
        this.subject.next(message);
        console.log('sent message: ', message)
    }
}
