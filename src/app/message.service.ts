import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

const BACKEND_URL = 'ws://localhost:5000/';

@Injectable()
export class MessageService {
    public subject = webSocket(BACKEND_URL);

	constructor() {
        this.subject.subscribe(
            (msg) => console.log('message received: ', msg),
            (err) => console.log(err),
            () => console.log('complete')
        );
	}

    public sendMessage (from: string, data: string): void {
        let message: Message = {
            from: from,
            data: data
        };
        this.subject.next(message);
    }
}
