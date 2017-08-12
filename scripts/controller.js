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

// Start the main app logic.
requirejs([
    '../node_modules/happyfuntimes/dist/hft',
    '../node_modules/hft-sample-ui/dist/sample-ui',
    '../node_modules/hft-game-utils/dist/game-utils',
    '../node_modules/angular/angular.js'
  ], function(
    hft,
    sampleUI,
    gameUtils,
    angular) {

  var GameClient = hft.GameClient;
  var CommonUI = sampleUI.commonUI;
  var Input = sampleUI.input;
  var Misc = sampleUI.misc;
  var MobileHacks = sampleUI.mobileHacks;
  var Touch = sampleUI.touch;

  var globals = {
    debug: false,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  var score = 0;
  var statusElem = document.getElementById("gamestatus");
  var hand = document.getElementById("hand");
  var handElements = [];
  var handSize = 5;
  var isTurn = false;
  var client = new GameClient();

  CommonUI.setupStandardControllerUI(client, globals);
  CommonUI.askForNameOnce();   // ask for the user's name if not set
  CommonUI.showMenu(true);     // shows the gear menu

  // Update our score when the game tells us.
  client.addEventListener('scored', function(cmd) {
    score += cmd.points;
    statusElem.innerHTML = "Score: " + score;
  });

  // Set hand
  client.addEventListener('setHand', function(cmd) {
      document.getElementById("gameStarter").style.visibility = "hidden";
      handElements = [];
      hand.innerHTML = "";
      for (var i=0; i<cmd.hand.length; ++i) {
          handElements.push(new CardElement(cmd.hand[i]));
      }
  });

  document.getElementById("gameStarter").onclick = function() {
      client.sendCmd('startGame');
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
      el.className = card.color + " card";
      el.innerHTML = card.text;
      hand.appendChild(el);
      this.el = el;

      this.el.onclick = function(event) {
          client.sendCmd('playCard', {
            text: this.innerHTML
          });
      }

      this.set = function(card) {
          this.card = card;
          this.el.innerHTML = card.text;
          return this.el;
      }

      this.unset = function() {
          this.el.innerHTML = this.card.owner;
      }
  }
});
