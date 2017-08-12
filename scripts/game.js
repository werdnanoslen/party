/*
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
  var maxPlayers = 5;
  var minPlayers = 2;
  var whiteCards = [];
  var blackCards = [];
  var whiteDeck = undefined;
  var blackDeck = undefined;
  var playedWhiteCard = undefined;
  var playedWhiteCardElement = new CardElement(new Card("white", "Cards Against Humanity."));
  var playedBlackCards = [];
  var playedBlackCardsElements = [];
  var globals = {
    itemSize: 15,
  };
  Misc.applyUrlSettings(globals);

  // load card contents
  var blackCardContents = require('../content/cah/wcards.json');
  var whiteCardContents = require('../content/cah/bcards.json');
  for (var i=0; i<blackCardContents.cards.length; ++i) {
      blackCards.push(new Card("black", blackCardContents.cards[i]));
  }
  for (var i=0; i<whiteCardContents.cards.length; ++i) {
      whiteCards.push(new Card("white", whiteCardContents.cards[i]));
  }
  whiteDeck = new Deck(whiteCards);
  blackDeck = new Deck(blackCards);
  playedWhiteCardElement.set(playedWhiteCardElement.card);

  function nextTurn() {
      if (players.length < minPlayers) {
          console.log("not enough players");
          return;
      }
      for (var i=0; i<playedBlackCards.length; ++i) {
          blackDeck.discard(playedBlackCards[i]);
      }
      for (var i=0; i<playedBlackCardsElements.length; ++i) {
          playedBlackCardsElements[i].unset();
      }
      playedBlackCards = [];
      whiteDeck.discard(playedWhiteCard);
      playedWhiteCard = whiteDeck.draw();
      playedWhiteCardElement.set(playedWhiteCard);
      nextPlayer = players[((++turn) % players.length)];
      nextPlayer.isTurn = true;
      nextPlayer.canPlayCard = false;
      for (var i=0; i<players.length; ++i) {
          var player = players[i];
          if (player === nextPlayer) {
              player.placeCardElement.el.style.visibility = "hidden";
          } else {
              player.placeCardElement.el.style.visibility = "visible";
          }
      }
      console.log("it's " + nextPlayer.name + "'s turn");
      var placeCards = [];
      for (var i=0; i<players.length; ++i) {
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
          var currentIndex = this.cards.length, temporaryValue, randomIndex;
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
      this.color = color; //"black" or "white"

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
          if (card.color == "black") {
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
    this.placeCard = new Card("black", name);

    this.placeCard.setOwner(name);
    this.placeCardElement = new CardElement(this.placeCard);
    this.placeCardElement.set(this.placeCard);
    playedBlackCardsElements.push(this.placeCardElement);

    for (var i=0; i<handSize; ++i) {
        var card = blackDeck.draw();
        card.setOwner(name);
        this.hand.push(card);
    }
    console.log(name + '\'s hand: ', this.hand);

    netPlayer.addEventListener('playCard', Player.prototype.playCard.bind(this));
    netPlayer.addEventListener('disconnect', Player.prototype.disconnect.bind(this));
    netPlayer.addEventListener('startGame', function() {
        if (players.length >= minPlayers) {
            for (var i=0; i<players.length; ++i) {
                players[i].setHand(players[i].hand);
            }
            nextTurn();
        }
    });

    this.playerNameManager = new PlayerNameManager(netPlayer);
    this.playerNameManager.on('setName', Player.prototype.handleNameMsg.bind(this));
  };

  Player.prototype.playCard = function(cmd) {
      if (!this.canPlayCard) {
          if (this.isTurn) {
              for (var i=0; i<playedBlackCards.length; ++i) {
                  if (playedBlackCards[i].text == cmd.text) {
                      this.chooseCard(playedBlackCards[i]);
                      return;
                  }
              }
          } else {
              return false;
          }
      }
      var card = undefined;
      for (var i=0; i<this.hand.length; ++i) {
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
      playedBlackCards.push(card);
      this.placeCardElement.set(card);
      this.hand.push(blackDeck.draw());
      this.setHand(this.hand);
      if (playedBlackCards.length == players.length - 1) {
          for (var i=0; i<players.length; ++i) {
              var player = players[i];
              if (player.isTurn) {
                  player.setHand(playedBlackCards);
              } else {
                  playedBlackCardsElements[i].reveal();
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
      for (var i=0; i<players.length; ++i) {
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
        players.splice(ii, 1);
        if (players.length < minPlayers) {
            nextTurn();
        }
        console.log(player.name + " left");
        return;
      }
    }
  };

  Player.prototype.handleNameMsg = function(name) {
    for (var i=0; i<players.length; ++i) {
        if (players[i].name == name) {
            console.log('that name is taken');
            return false;
        }
    }
    console.log(this.name + " renamed to " + name);
    this.name = name;
    if (playedBlackCards.length == 0) {
        this.placeCardElement.el.innerHTML = name;
        this.placeCardElement.el.id = name;
        this.placeCard.text = name;
    }
    for (var i=0; i<this.hand.length; ++i) {
        this.hand[i].owner = name;
        this.placeCard.setOwner(name);
    }
  };

  var server = new GameServer();
  GameSupport.init(server, globals);

  // A new player has arrived.
  server.addEventListener('playerconnect', function(netPlayer, name) {
    console.log(name + " joined");
    if (players.length > maxPlayers) {
        console.log("too many players");
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
  });

  GameSupport.run(globals, function(){});
});
