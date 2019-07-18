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

var sockets: Object = {}; //{'name': WebSocket}

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
    if (undefined === sockets['SCREEN'] || socket === sockets['SCREEN']) {
        name = 'SCREEN';
        game.screenReady = true;
        sendMessage('screenConnected');
    } else {
        let player: Player = game.connect(name);
        name = player.name;
        sendMessage('playerConnected', player);
        sendMessage('getGameStatus', getGameStatus(), [sockets['SCREEN']]);
        if (game.gameReady) {
            broadcastMessage('gameReady', true);
        } else {
            broadcastMessage('gameReady', false);
        }
    }
    sockets[name] = socket;

    socket.on('close', function() {
        let names = Object.keys(sockets);
        for (var name in names) {
            if (sockets[name] === socket) {
                if (name === 'SCREEN') {
                    game.screenReady = false;
                } else {
                    game.disconnect(name);
                    sendMessage('getGameStatus', getGameStatus(), [sockets['SCREEN']]);
                    if (game.gameReady) {
                        broadcastMessage('gameReady', true);
                    } else {
                        broadcastMessage('gameReady', false);
                    }
                }
                delete sockets[name];
                break;
            }
        }
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
                if (oldName !== newName && !game.playerExists(newName)) {
                    game.getPlayer(oldName).name = newName;
                    sockets[newName] = sockets[oldName];
                    delete sockets[oldName];
                }
                sendMessage('getPlayer', game.getPlayer(newName));
                console.log(Object.keys(sockets))
                sendMessage('getGameStatus', getGameStatus(), [sockets['SCREEN']]);
                break;
            case 'startGame':
                game.startGame();
                if (game.gameStarted) {
                    broadcastMessage('gameStarted', true);
                    sendMessage('getGameStatus', getGameStatus(), [sockets['SCREEN']]);
                }
                break;
            default:
                broadcastMessage('test');
                break;
        }
    });

    function sendMessage(command: string, data?: any, to?: WebSocket[]): void {
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

    function broadcastMessage(command: string, data?: any): void {
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
