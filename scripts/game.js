/*
 * Derivative work by Andrew Nelson <andy@andyhub.com> based on the work of...
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

const isDevMode = process.env.NODE_ENV === 'development';
const requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname,
});

// Start the main app logic.
requirejs([
    'happyfuntimes',
    'hft-game-utils',
    'hft-sample-ui',
], function(
    happyfuntimes,
    gameUtils,
    sampleUI) {

    var GameServer = happyfuntimes.GameServer;
    var GameSupport = gameUtils.gameSupport;
    var Misc = sampleUI.misc;
    var PlayerNameManager = sampleUI.PlayerNameManager;

    var statusElem = document.getElementById("status");
    var table = document.getElementById("table");
    var players = [];
    var turn = -1;
    var nextPlayer = undefined;
    var handSize = 5;
    var maxPlayers = 12;
    var minPlayers = 3;
    var blackCards = [];
    var whiteCards = [];
    var blackDeck = undefined;
    var whiteDeck = undefined;
    var playedBlackCard = undefined;
    var playedBlackCardElement = new CardElement(new Card("black", "Cards Against Humanity."));
    var playedWhiteCards = [];
    var playedWhiteCardsElements = [];
    var globals = {
        itemSize: 15,
    };
    Misc.applyUrlSettings(globals);

    // load card contents
    var whiteCardContents = require('../content/cah/core_wcards.json');
    var blackCardContents = require('../content/cah/core_bcards.json');
    for (var i = 0; i < whiteCardContents.cards.length; ++i) {
        whiteCards.push(new Card("white", whiteCardContents.cards[i]));
    }
    for (var i = 0; i < blackCardContents.cards.length; ++i) {
        blackCards.push(new Card("black", blackCardContents.cards[i]));
    }
    blackDeck = new Deck(blackCards);
    whiteDeck = new Deck(whiteCards);
    playedBlackCardElement.set(playedBlackCardElement.card);

    function nextTurn() {
        if (players.length < minPlayers) {
            console.log("not enough players");
            return;
        }
        for (var i = 0; i < playedWhiteCards.length; ++i) {
            whiteDeck.discard(playedWhiteCards[i]);
        }
        for (var i = 0; i < playedWhiteCardsElements.length; ++i) {
            playedWhiteCardsElements[i].unset();
        }
        playedWhiteCards = [];
        blackDeck.discard(playedBlackCard);
        playedBlackCard = blackDeck.draw();
        playedBlackCardElement.set(playedBlackCard);
        nextPlayer = players[((++turn) % players.length)];
        nextPlayer.isTurn = true;
        var title = document.getElementById('title');
        title.innerText = "It's " + nextPlayer.name + "\'s turn."
        nextPlayer.canPlayCard = false;
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            if (player === nextPlayer) {
                player.placeCardElement.el.style.visibility = "hidden";
            } else {
                player.placeCardElement.el.style.visibility = "visible";
            }
        }
        console.log("it's " + nextPlayer.name + "'s turn");
        var placeCards = [];
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            if (!player.isTurn) {
                placeCards.push(player.placeCard);
                player.canPlayCard = true;
            }
        }
        nextPlayer.setHand(placeCards);
    }

    function Deck(cardsArray) {
        this.cards = cardsArray; //array of cards

        this.discard = function(card) {
            this.cards.unshift(card);
            return card;
        }

        this.draw = function() {
            return this.cards.pop();
        }

        this.shuffle = function() {
            // derived from https://github.com/Daplie/knuth-shuffle
            var currentIndex = this.cards.length,
                temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = this.cards[currentIndex];
                this.cards[currentIndex] = this.cards[randomIndex];
                this.cards[randomIndex] = temporaryValue;
            }
            return this.cards;
        }
    }

    function Card(color, text) {
        this.owner = undefined; //Player obj or undefined
        this.text = text;
        this.color = color; //"white" or "black"

        this.setOwner = function(name) {
            if (this.owner == name) {
                return false;
            } else {
                this.owner = name;
                return true;
            }
        }
        this.remOwner = function() {
            if (this.owner === undefined) {
                return false;
            } else {
                var oldOwner = this.owner;
                this.owner = undefined;
                return oldOwner;
            }
        }
    };

    function CardElement(card) {
        this.card = card;
        var el = document.createElement("div");
        el.id = card.owner;
        el.className = card.color + " card";
        table.appendChild(el);
        this.el = el;

        this.set = function(card) {
            this.card = card;
            if (card.color == "white") {
                this.el.innerHTML = card.owner + " PLAYED"
            } else {
                this.el.innerHTML = card.text;
            }
            return this.el;
        }

        this.reveal = function() {
            this.el.innerHTML = this.card.text;
        }

        this.unset = function() {
            this.el.innerHTML = "WAITING ON " + this.card.owner;
        }
    }

    var Player = function(netPlayer, name) {
        this.netPlayer = netPlayer;
        this.name = name;
        this.hand = [];
        this.points = 0;
        this.canPlayCard = false;
        this.isTurn = false;
        this.placeCard = new Card("white", name);

        this.placeCard.setOwner(name);
        this.placeCardElement = new CardElement(this.placeCard);
        this.placeCardElement.set(this.placeCard);
        playedWhiteCardsElements.push(this.placeCardElement);

        for (var i = 0; i < handSize; ++i) {
            var card = whiteDeck.draw();
            card.setOwner(name);
            this.hand.push(card);
        }
        console.log(name + '\'s hand: ', this.hand);

        netPlayer.addEventListener('playCard', Player.prototype.playCard.bind(this));
        netPlayer.addEventListener('disconnect', Player.prototype.disconnect.bind(this));
        netPlayer.addEventListener('startGame', function() {
            if (players.length >= minPlayers) {
                for (var i = 0; i < players.length; ++i) {
                    players[i].setHand(players[i].hand);
                }
                nextTurn();
            } else {
                alert("You're the only player right now, and you need at least two to start the game.")
            }
        });

        this.playerNameManager = new PlayerNameManager(netPlayer);
        this.playerNameManager.on('setName', Player.prototype.handleNameMsg.bind(this));
    };

    Player.prototype.playCard = function(cmd) {
        if (!this.canPlayCard) {
            if (this.isTurn) {
                for (var i = 0; i < playedWhiteCards.length; ++i) {
                    if (playedWhiteCards[i].text == cmd.text) {
                        this.chooseCard(playedWhiteCards[i]);
                        return;
                    }
                }
            } else {
                return false;
            }
        }
        var card = undefined;
        for (var i = 0; i < this.hand.length; ++i) {
            if (this.hand[i].text == cmd.text) {
                card = this.hand[i];
                break;
            }
        }
        if (card == undefined) {
            return false;
        }
        this.canPlayCard = false;
        this.hand.splice(this.hand.indexOf(card), 1);
        playedWhiteCards.push(card);
        this.placeCardElement.set(card);
        var newCard = whiteDeck.draw();
        newCard.setOwner(this.name);
        this.hand.push(newCard);
        this.setHand(this.hand);
        if (playedWhiteCards.length == players.length - 1) {
            for (var i = 0; i < players.length; ++i) {
                var player = players[i];
                if (player.isTurn) {
                    player.setHand(playedWhiteCards);
                } else {
                    playedWhiteCardsElements[i].reveal();
                }
            }
        }
    }

    Player.prototype.chooseCard = function(card) {
        if (!this.isTurn) {
            return false;
        }
        this.setHand(this.hand);
        var owner = card.owner;
        console.log(this.name + ' chose ' + owner + '\'s', card);
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            if (player.name == card.owner) {
                player.netPlayer.sendCmd('scored', {
                    points: 1
                });
                this.isTurn = false;
                nextTurn();
                break;
            }
        }
    }

    Player.prototype.setHand = function(hand) {
        this.netPlayer.sendCmd('setHand', {
            hand: hand,
            isTurn: this.isTurn
        });
    };

    Player.prototype.disconnect = function() {
        for (var ii = 0; ii < players.length; ++ii) {
            var player = players[ii];
            if (player === this) {
                var deletedPlayer = players.splice(ii, 1);
                deletedPlayer[0].placeCardElement.el.remove();
                delete deletedPlayer[0];

                var title = document.getElementById('title');
                if (players.length > maxPlayers) {
                    console.log("too many players");
                    title.innerHTML = "Sorry " + name + ", I think we have all our <em>real</em> friends here, don't you? Somebody press start already..."
                } else {
                    var morePeopleNeeded = minPlayers - players.length;
                    console.log(morePeopleNeeded);
                    if (morePeopleNeeded < 1 & turn === -1) {
                        title.innerText = "Ready when you are, friend."
                    } else if (morePeopleNeeded === 1) {
                        title.innerText = "Please nab at least one more horrible person."
                    } else if (morePeopleNeeded > 1){
                        title.innerText = "Please nab at least " + morePeopleNeeded + " more horrible people."
                    }
                }

                if (players.length < minPlayers) {
                    nextTurn();
                }
                console.log(player.name + " left");
                return;
            }
        }
    };

    Player.prototype.handleNameMsg = function(name) {
        for (var i = 0; i < players.length; ++i) {
            if (players[i].name == name) {
                console.log('that name is taken');
                return false;
            }
        }
        console.log(this.name + " renamed to " + name);
        this.name = name;
        if (playedWhiteCards.length == 0) {
            this.placeCardElement.el.innerHTML = name;
            this.placeCardElement.el.id = name;
            this.placeCard.text = name;
        }
        for (var i = 0; i < this.hand.length; ++i) {
            this.hand[i].owner = name;
            this.placeCard.setOwner(name);
        }
    };

    var server = new GameServer();
    GameSupport.init(server, globals);

    // A new player has arrived.
    server.addEventListener('playerconnect', function(netPlayer, name) {
        console.log(name + " joined");
        var title = document.getElementById('title');
        if (players.length >= maxPlayers) {
            console.log("too many players");
            title.innerHTML = "Sorry " + name + ", I think we have all our <em>real</em> friends here, don't you? Somebody press start already..."
            return false;
        }
        var player = new Player(netPlayer, name);
        if (players.length == 0) {
            player.isTurn = true;
        }
        players.push(player);
        player.placeCardElement.el.style.visibility = "visible";
        var card = document.getElementById(player.name);
        card.innerHTML = player.name;

        var morePeopleNeeded = minPlayers - players.length;
        if (morePeopleNeeded < 1 & turn === -1) {
            title.innerText = "Ready when you are, friend."
        } else if (morePeopleNeeded === 1) {
            title.innerText = "Please nab at least one more horrible person."
        } else if (morePeopleNeeded > 1){
            title.innerText = "Please nab at least " + morePeopleNeeded + " more horrible people."
        }
    });

    GameSupport.run(globals, function() {});

});
