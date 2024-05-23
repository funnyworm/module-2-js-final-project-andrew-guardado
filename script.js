const startBtn = document.getElementById('startBtn');
const btnContainer = document.getElementById('buttons');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealerScore = document.getElementById('dealer-score');

// Backside of card used to hide Dealer's second card
const cardHidden = new Image();
cardHidden.src = 'images/backside.png';

class Player {
    constructor(name, game) {
        this.name = name;
        this.hand = [];
        this.score = 0;
        this.cash = 0;
        this.wager = 0;
        this.isTurn = false;
        this.game = game;
    }

    receiveCard(card) {
        this.hand.push(card);
        this.updateScore(card);
    }

    hitMe() {
        const hit = this.game.cards.pop();
        this.receiveCard(hit);
    }

    // updateScore(card) {
    //     const rank = card.rank;

    //     // Assigns a score based on a cards rank
    //     // Aces initially are given a score of 11
    //     if(rank === 'A') {
    //         this.score += 11;
    //     } else if(['J', 'Q', 'K'].includes(rank)) {
    //         this.score += 10;
    //     } else {
    //         this.score += parseInt(rank);
    //     }

    //     // If score is over 21 and hand contains an Ace, subtract 10 (ace can be 1 or 11)
    //     if(this.score > 21 && this.hand.some(card => card.rank === 'A')) {
    //         this.score -= 10;
    //     }
    // }

    updateScore(card) {
        const rank = card.rank;
    
        // Assigns a score based on a card's rank
        if (['J', 'Q', 'K'].includes(rank)) {
            this.score += 10;
        } else if (rank === 'A') {
            // Check if adding 11 would cause a bust, if so, add 1 instead
            this.score += (this.score + 11 > 21) ? 1 : 11;
        } else {
            this.score += parseInt(rank);
        }
    
        // Check for bust with Aces in hand
        // if (this.score > 21 && this.hand.some(card => card.rank === 'A')) {
        //     // Iterate over Aces and change their value to 1 until the score is under 21
        //     this.hand.filter(card => card.rank === 'A').forEach(() => {
        //         if (this.score > 21) {
        //             this.score -= 10;
        //         }
        //     });
        // }
    }
};

class Dealer extends Player{
    constructor() {
        super('Dealer');
    }
}


class Game {
    constructor() {
        this.cards = [];
        this.players = [];
    }

    createDeck() {
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suits = ['club', 'diamond', 'heart', 'spade'];
    
        for(let suit of suits) {
            for(let rank of ranks) {
                const imagePath = `images/${suit}_${rank}.png`;
                this.cards.push({rank, suit, imagePath});
            }
        }
        return this.cards;
    };

    // Shuffle algo comes from the Durstenfeld shuffle which is a modified version of the Fisher-Yates shuffle
    shuffleDeck() {
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    };

    addPlayer(playerName) {
        let player1 = new Player(playerName, this);
        this.players.push(player1);
    };

    addDealer() {
        let dealer = new Dealer;
        dealer.game = this;
        this.players.push(dealer);
    }

    startGame() {
        this.cards = this.createDeck();
        this.shuffleDeck();
        this.addDealer();
        this.addPlayer('bob');
        const dealer = this.players[0];
        const player1 = this.players[1];
        this.dealCards();

        console.log(this.cards);
        console.log(this.players);

        this.displayCards(dealer, 'dealer-hand', false);
        this.displayCards(player1, 'player-hand');

        this.playerTurn();
        
        //this.showButtons();
        //player1.hitMe();
        //console.log(this.players);
    }

    dealCards() {
        this.players.forEach(player => {
            for(let i = 0; i < 2; i++) {
                const card = this.cards.pop();
                 player.receiveCard(card);
            }
        });
    }

    displayCards(player, elementId, showAllCards = true) {
        const handElement = document.getElementById(elementId);
        const cardsElement = handElement.querySelector('#player-cards, #dealer-cards');
        const scoreElement = handElement.querySelector('#player-score, #dealer-score');

        // Clear previous cards and score
        cardsElement.innerHTML = '';
        scoreElement.textContent = `Total Score: ${player.score}`;

        // Display cards
        player.hand.forEach((card, index) => {

            // Hide dealer's second card
            if(!showAllCards && player.name === 'Dealer' && index === 1) {
                cardHidden.onload = function() {
                    cardsElement.appendChild(cardHidden);
                }
                cardHidden.style.width = '100px';
            } else{
                const cardImage = new Image();
                cardImage.src = card.imagePath;

                cardImage.onload = function() {
                    cardsElement.appendChild(cardImage);
                }

                cardImage.alt = `${card.rank} of ${card.suit}`;
                cardImage.style.width = '100px';
            }
        })
    }

    playerTurn() {
        btnContainer.style.display = 'block';

        if(this.players[1].score === 21) {
            console.log('BLACKJACK!!');
            btnContainer.style.display = 'none';
        }

        hitButton.addEventListener('click', () => {
            this.players[1].hitMe();
            this.displayCards(this.players[1], 'player-hand');

            if(this.players[1].score > 21) {
                console.log('BUST!');
                btnContainer.style.display = 'none';
                //player.isTurn = false;
            } else if(this.players[1].score === 21) {
                console.log('21');
                this.dealerTurn();
            }
        })

        standButton.addEventListener('click', () => {
            console.log('PLAYER STANDS');
            this.dealerTurn();
        })
    }

    dealerTurn() {

        dealerScore.style.display = 'block';

        while(this.players[0].score < this.players[1].score) {
            this.players[0].hitMe();
        }

        if(this.players[0].score > 21) {
            console.log('DEALER BUSTS. PLAYER WINS');
            this.displayCards(this.players[0], 'dealer-hand');
        } else if (this.players[0].score === this.players[1].score) {
            console.log('PUSH');
            this.displayCards(this.players[0], 'dealer-hand');
        } else {
            console.log('DEALER WINS');
            this.displayCards(this.players[0], 'dealer-hand');
        }
    }

}

// let deck1 = new Deck();
// deck1.createDeck();
// console.log(deck1.cards.slice());

// deck1.shuffle();
// console.log(deck1.cards);

let game1 = new Game;
game1.startGame();
