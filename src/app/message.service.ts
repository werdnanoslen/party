import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

const BACKEND_URL = 'ws://localhost:5000/';

@Injectable()
export class MessageService {
    public subject: Subject<Message>;
    public from: string;

	constructor() {
        let from = localStorage.getItem('from');
        this.from = (from === null) ? '' : from;
        let url = BACKEND_URL + this.from;
        this.subject = webSocket(url);
        this.subject.subscribe(
            (msg: Message) => {
                console.log('received message: ', msg);
                if (msg.command === 'screenConnected') {
                    this.from = 'SCREEN';
                    localStorage.setItem('from', this.from);
                } else if (msg.command === 'playerConnected' || msg.command === 'getPlayer') {
                    this.from = msg.data.name;
                    localStorage.setItem('from', this.from);
                }
            },
            (err) => console.log(err),
            () => console.log('complete')
        );
	}

    public sendMessage (command: string, data?: any): void {
        let message: Message = {
            command: command,
            from: this.from,
            data: data
        };
        this.subject.next(message);
        console.log('sent message: ', message)
    }
}
