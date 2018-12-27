import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';
import { Message } from '../models/message';

const BACKEND_URL = 'ws://localhost:5000/';

@Injectable()
export class MessageService {
	public messages: Subject<Message>;

	constructor(wss: WebsocketService) {
		this.messages = <Subject<Message>>wss
			.connect(BACKEND_URL)
			.pipe(map((messageEvent: MessageEvent): Message => {
				return JSON.parse(messageEvent.data);
			}));
	}
}
