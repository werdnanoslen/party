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
    // let name = socket.upgradeReq.url;
    if (undefined === screenSocket || socket === screenSocket) {
        screenSocket = socket;
        game.screenReady = true;
        sendMessage('screenConnected');
    } else {
        let player: Player = game.connect();
        sendMessage('playerConnected', {
            name: player.name
        });
    }

    socket.on('close', function() {
        console.log('Got disconnect!');
        if (socket === screenSocket) {
            screenSocket = undefined;
            game.screenReady = false;
            console.log('screen disconnected')
        } else {
            for (var p = 0; p < game.players.length; ++p) {
                let player: Player = game.players[p];
                if (socket === player.getSocket()) {
                    game.disconnect(player);
                    console.log('player ' + player.name + ' disconnected');
                    break;
                }
            }
        }
    });

    socket.on('message', (messageJSON: string) => {
        let message: Message = JSON.parse(messageJSON);
        console.log('received message: ', message);
        switch (message.command) {
            case 'screenReady':
                game.screenReady = true;
                broadcastMessage('screenReady');
                break;
            default:
                sendMessage('test')
                break;
        }
    });

    function sendMessage(command: string, data?: object): void {
        let message: Message = toMessage(command, data);
        socket.send(JSON.stringify(message));
        console.log('sent message: ', message);
    }

    function broadcastMessage(command: string, data?: object): void {
        let message: Message = toMessage(command, data);
        wss.clients.forEach(function each(client) {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
        console.log('broadcasted message: ', message);
    }

    function toMessage(command: string, data?: object): Message {
        return {
            command: command,
            from: 'SERVER',
            data: data
        };
    }
});

server.listen(port, () => console.log('Express server running at', url));
