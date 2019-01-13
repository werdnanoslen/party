import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

// Taken from https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
export class WebsocketService {
    constructor() { }

    private subject: Subject<MessageEvent>;

    public connect(url): Subject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }
        return this.subject;
    }

    private sendMessage(ws: WebSocket, data: Object): void {
        console.log("waiting for connection...")
        setTimeout(() => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify(data));
            } else {
                this.sendMessage(ws, data);
            }
        }, 5);
    }

    private create(url): Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                return ws.close.bind(ws);
            })
        let observer = {
            next: (data: Object) => {
                this.sendMessage(ws, data);
            }
        }
        return Subject.create(observer, observable);
    }
}
