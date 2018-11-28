import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  score = this.socket.fromEvent<number>('score');
  gameStarted = this.socket.fromEvent<boolean>('isGameStarted');
  turn = this.socket.fromEvent<boolean>('isTurn');
  cards = this.socket.fromEvent<string[]>('getCards');
  playedCard = this.socket.fromEvent<string>('playCard');

  constructor(private socket: Socket) { }

  getScore(playerId: string) {
      this.socket.emit('getScore', playerId);
  }

  getCards(playerId: string) {
      this.socket.emit('getCards', playerId);
  }

  playCard(playerId: string, card: string) {
      this.socket.emit('playCard', {'playerId': playerId, 'card': card});
  }

  isGameStarted() {
      this.socket.emit('isGameStarted');
  }

  isTurn(playerId: string) {
      this.socket.emit('isTurn')
  }

  startGame() {
      this.socket.emit('startGame');
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  private docId() {
    let text = 'this is private';
    return text;
  }
}
