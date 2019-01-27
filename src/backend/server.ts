import * as Express from 'express';
import * as Http from 'http';
import * as WebSocket from 'ws';
import * as Ip from 'ip';
import { Message } from '../models/message';
import { GameService } from './game.service';

const app = Express();
const server = Http.createServer(app);
const port = 5000;
const wss = new WebSocket.Server({ server });
const url = Ip.address() + ':' + port;
const game = new GameService();

var sockets: WebSocket[] = [];

app.get('/', function (req, res) {
    let gameProps = Object.getOwnPropertyNames(game);
    let properties = {};
    for (var p=0; p<gameProps.length; ++p) {
        let prop = gameProps[p];
        properties[prop] = game[prop];
    }
    res.send(properties);
})

wss.on('connection', function(socket) {
    sockets.push(socket);
    sendMessage({
        from: 'SERVER',
        data: 'connection'
    });

    socket.on('message', (messageJSON: string) => {
        let message: Message = JSON.parse(messageJSON);
        console.log('received message: ', message);
        switch (message.data) {
            case 'screen is ready':
                game.screenReady = true;
                broadcastMessage({
                    from: 'SERVER',
                    data: 'screen is ready'
                });
                break;
            default:
                sendMessage({
                    from: 'SERVER',
                    data: 'idklol'
                })
                break;
        }
    });

    // socket.on('getScore', (playerId: string) => {
    //     socket.send('score', players[playerId].score);
    // });

    // socket.on('getCards', playerId => {
    //     socket.emit('getHand', players[playerId][cards]);
    // })
    //
    // socket.on('playCard', playerId, card => {
    //     playedCards[playerId] = card;
    //     socket.emit('playCard', playedCards);
    // })
    //
    // socket.on('isTurn', playerId => {
    //     socket.emit('isTurn', players[playerId][isTurn]);
    // })
    //
    // socket.on('isGameStarted', data => {
    //     socket.emit('isGameStarted', isGameStarted);
    // })
    //
    // socket.on('startGame', data => {
    //     gameStarted = true;
    //     socket.emit('startGame', isGameStarted);
    // })
    //
    // socket.on('addDoc', doc => {
    //     documents[doc.id] = doc;
    //     io.emit('documents', Object.keys(documents));
    //     socket.emit('document', doc);
    // });
    //
    // socket.on('editDoc', doc => {
    //     documents[doc.id] = doc;
    //     socket.to(doc.id).emit('document', doc);
    // });

    function sendMessage(message: Message): void {
        socket.send(JSON.stringify(message));
        console.log('sent message: ', message);
    }

    function broadcastMessage(message: Message): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
        console.log('broadcasted message: ', message);
    }
});

// app.get('/', (req, res) => {
//   if (!isGameStarted) {
//     isGameStarted = true;
//     console.log('sending game');
//     res.send('game');
//   } else {
//     console.log('sending controller');
//     res.send('controller');
//   }
// });
server.listen(port, () => console.log('Express server running at', url));
