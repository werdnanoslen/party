import { Card } from 'src/app/card';

export class Player {
    name: String;
    hand: Card[];
    points: number;
    canPlayCard: boolean;
    isTurn: boolean;
    placeCard: Card;

    constructor (name) {
        this.name = name;
        this.hand = [];
        this.points = 0;
        this.canPlayCard = false;
        this.isTurn = false;
        this.placeCard = new Card(this.name, 'white', this);
    }

}

playCard(cmd) {
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

chooseCard(card) {
    if (!this.isTurn) {
        return false;
    }
    this.setHand(this.hand);
    var owner = card.owner;
    console.log(this.name + ' chose ' + owner + '\'s', card);
    for (var i = 0; i < players.length; ++i) {
        var player = players[i];
        if (player.name == card.owner) {
            this.points += 1;
            this.isTurn = false;
            nextTurn();
            break;
        }
    }
}

setHand(hand) {

};

disconnect() {
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

setName(name) {
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
