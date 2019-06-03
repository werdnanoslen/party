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
var sockets: {'name': string, 'socket': WebSocket}[] = [];

function getGameStatus(): object {
    let gameProps: object = {};
    let propNames: string[] = Object.getOwnPropertyNames(game);
    for (var p in propNames) {
        let propName = propNames[p];
        gameProps[propName] = game[propName];
    }
    return gameProps;
}

app.get('/', function (req, res) {
    res.send(getGameStatus());
})

wss.on('connection', function(socket: WebSocket) {
    let name: string = decodeURI(socket['upgradeReq'].url.substring(1));
    if (undefined === screenSocket || socket === screenSocket) {
        screenSocket = socket;
        game.screenReady = true;
        sendMessage('screenConnected');
    } else {
        let player: Player = game.connect(name);
        name = player.name;
        sendMessage('playerConnected', player);
        sendMessage('getGameStatus', getGameStatus(), [screenSocket]);
    }
    sockets.push({
        'name': name,
        'socket': socket
    });

    socket.on('close', function() {
        let name: string;
        for (let s=0; s<sockets.length; ++s) {
            if (sockets[s].socket === socket) {
                name = sockets[s].name;
                sockets.splice(s, 1);
                if (name === 'SCREEN') {
                    game.screenReady = false;
                    screenSocket = undefined;
                } else {
                    game.disconnect(name);
                    sendMessage('getGameStatus', getGameStatus(), [screenSocket]);
                }
                break;
            }
        }
        console.log(name || 'an unknown socket', 'disconnected');
    });

    socket.on('message', (messageJSON: string) => {
        let message: Message = JSON.parse(messageJSON);
        console.log('received message: ', message.command);
        switch (message.command) {
            case 'screenReady':
                game.screenReady = true;
                broadcastMessage('screenReady');
                break;
            case 'getPlayer':
                let name: string = message.from;
                let player: Player = game.getPlayer(name);
                sendMessage('getPlayer', player);
                break;
            case 'getGameStatus':
                sendMessage('getGameStatus', getGameStatus());
                break;
            case 'changeName':
                let oldName: string = message.from;
                let newName: string = message.data;
                if (!game.playerExists(newName)) {
                    game.getPlayer(oldName).name = newName;
                    for (let s=0; s<sockets.length; ++s) {
                        if (sockets[s].name === oldName) {
                            sockets[s].name = newName;
                            break;
                        }
                    }
                }
                sendMessage('getPlayer', game.getPlayer(newName));
                sendMessage('getGameStatus', getGameStatus(), [screenSocket]);
                break;
            default:
                broadcastMessage('test');
                break;
        }
    });

    function sendMessage(command: string, data?: object, to?: WebSocket[]): void {
        let message: Message = toMessage(command, data);
        try {
            if (to) {
                for (let s in to) {
                    to[s].send(JSON.stringify(message));
                }
            } else {
                socket.send(JSON.stringify(message));
            }
            console.log('sent message: ', message.command);
        } catch (error) {
            console.error('could not send message: ', error);
        }
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
