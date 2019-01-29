import * as Express from 'express';
import * as Http from 'http';
import * as WebSocket from 'ws';
import * as Ip from 'ip';
import { Message } from '../models/message';
import { GameService } from './game.service';
import { Player } from '../models/player';

const app = Express();
const server = Http.createServer(app);
const port = 5000;
const wss = new WebSocket.Server({ server });
const url = Ip.address() + ':' + port;
const game = new GameService();

var screenSocket: WebSocket;
var properties = {};

app.get('/', function (req, res) {
    let gameProps = Object.getOwnPropertyNames(game);
    for (var p=0; p<gameProps.length; ++p) {
        let prop = gameProps[p];
        properties[prop] = game[prop];
    }
    res.send(properties);
})

wss.on('connection', function(socket: WebSocket) {
    if (undefined === screenSocket || socket === screenSocket) {
        screenSocket = socket;
        game.screenReady = true;
        sendMessage({
            from: 'SERVER',
            data: 'hello screen'
        });
    } else {
        //TODO: why is this undefined? It's all I need to make token exchange work :(
        console.log(socket.url);
        let player: Player = game.connect();
        sendMessage({
            from: 'SERVER',
            data: 'hello ' + player.name
        });
    }

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        if (socket === screenSocket) {
            screenSocket = undefined;
            game.screenReady = false;
        } else {
            for (var p=0; p<properties['players'].length; ++p) {
                let player: Player = properties['players'][p];
                if (socket === player.getSocket()) {
                    game.disconnect(player)
                }
            }
        }
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

server.listen(port, () => console.log('Express server running at', url));
