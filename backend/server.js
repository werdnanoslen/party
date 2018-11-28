const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ip = require('ip');
const port = 4000;
const url = ip.address() + ':' + port;

let isGameStarted = false;
let players = {
    'player': {
        score: 0,
        isTurn: 0,
        cards: ['one', 'two', 'three']
    }
};
let playedCards = {};

io.on('connection', socket => {
    let previousId;

    socket.on('getScore', playerId => {
        socket.emit('score', players[playerId][score]);
    });

    socket.on('getCards', playerId => {
        socket.emit('getHand', players[playerId][cards]);
    })

    socket.on('playCard', playerId, card => {
        playedCards[playerId] = card;
        socket.emit('playCard', playedCards);
    })

    socket.on('isTurn', playerId => {
        socket.emit('isTurn', players[playerId][isTurn]);
    })

    socket.on('isGameStarted', data => {
        socket.emit('isGameStarted', isGameStarted);
    })

    socket.on('startGame', data => {
        gameStarted = true;
        socket.emit('startGame', isGameStarted);
    })

    socket.on('addDoc', doc => {
        documents[doc.id] = doc;
        io.emit('documents', Object.keys(documents));
        socket.emit('document', doc);
    });

    socket.on('editDoc', doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit('document', doc);
    });

    io.emit('test');
});

app.get('/', (req, res) => {
  if (!gameStarted) {
    gameStarted = true;
    console.log('sending game');
    res.send('game');
  } else {
    console.log('sending controller');
    res.send('controller');
  }
});
http.listen(port, () => console.log('Express server running at', url));
