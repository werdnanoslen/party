import * as Express from 'express';
import * as Http from 'http';
import * as WebSocket from 'ws';
import * as Ip from 'ip';
import { Message } from '../models/message';

const app = Express();
const server = Http.createServer(app);
const port = 5000;
const wss = new WebSocket.Server({ server });
const url = Ip.address() + ':' + port;

let players = {
    'player-one': {
        score: 0,
        isTurn: 0,
        cards: ['one', 'two', 'three']
    }
};

wss.on('connection', function(socket) {
    sendMessage({
        from: 'SERVER',
        data: 'new connection'
    });

    socket.on('message', (message: Message) => {
        console.log('received message: ', message);
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
