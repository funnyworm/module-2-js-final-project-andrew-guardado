const startBtn = document.getElementById('start-button');
const btnContainer = document.getElementById('buttons');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealerScore = document.getElementById('dealer-score');
const inputContainer = document.getElementById('name-input');
const againButton = document.getElementById('again-button');
const againContainer = document.getElementById('again-container');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const nameInput = document.getElementById('player-name');
const wagerContainer = document.getElementById('wager-buttons');
const lilWager = document.getElementById('lil-button');
const quarterWager = document.getElementById('quarter-button');
const halfWager = document.getElementById('half-button');
const fullWager = document.getElementById('all-button');
const playerWager = document.getElementById('player-wager');
const playerCash = document.getElementById('player-cash');
const playerTitle = document.getElementById('player-title');
const highScoreList = document.getElementById('high-score-list');
const clearButton = document.getElementById('clear-scores-button');

// Backside of card used to hide Dealer's second card
// const cardHidden = new Image();
// cardHidden.src = 'images/backside.png';

class Player {
    constructor(name, game) {
        this.name = name;
        this.hand = [];
        this.score = 0;
        this.cash = 0;
        this.wager = 0;
        this.game = game;
        this.highScore = 0;
    }

    receiveCard(card) {
        this.hand.push(card);
        this.updateScore(card);
    }

    hitMe() {
        const hit = this.game.cards.pop();
        this.receiveCard(hit);
    }

    updateScore(card) {
       
        // Reset the score
        this.score = 0;
        let aceCount = 0;


        // Calculate initial score
        this.hand.forEach(card => {
            const rank = card.rank;
    
            // Assigns a score based on a card's rank
            if (['J', 'Q', 'K'].includes(rank)) {
                this.score += 10;
            } else if (rank === 'A') {
                // Initially treat the Ace as 11 points
                aceCount += 1;
                this.score += 11;
            } else {
                this.score += parseInt(rank);
            }
        });

        // Adjust the score if there are Aces and the score is over 21
        while (this.score > 21 && aceCount > 0) {
            this.score -= 10;
            aceCount -= 1;
        }
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
        this.hitButtonClickListener = () => {
            const player = this.players[1];

            player.hitMe();
            this.displayCards(player, 'player-hand');

            if (player.score > 21) {
                console.log('BUST!');
                btnContainer.style.display = 'none';
                againContainer.style.display = 'block';

                // Remove wager and update display
                player.wager = 0;

                playerCash.textContent = `Cash: $${player.cash}`;
                playerWager.textContent = `Wager: $${player.wager}`;

                // Check if player is out of cash
                if (player.cash === 0) {
                    console.log('GAME OVER');
                    againContainer.style.display = 'none';

                    setTimeout(() => {
                        this.gameOver();
                    }, 5000);
                }

                // Add event listener for play again button
                againButton.addEventListener('click', this.playAgainButtonClickListener);
                
                // Remove the event listener
                this.removeHitButtonListener(); 
            } else if (player.score === 21) {
                console.log('21');
                btnContainer.style.display = 'none';
                this.dealerTurn();

                // Remove the event listener
                this.removeHitButtonListener(); 
            }
        };

        this.standButtonClickListener = () => {
            btnContainer.style.display = 'none';
            console.log('PLAYER STANDS');
            this.dealerTurn();
            this.removeStandButtonListener();
        }

        this.playAgainButtonClickListener = () => {
            
            this.playAgain();
            //this.removePlayAgainButtonListener();
        }

        this.wagerLilButtonClickListener = () => {
            const player = this.players[1];

            player.wager = Math.round(0.1 * player.cash);
            player.cash -= player.wager;
            wagerContainer.style.display = 'none';
            dealerHand.style.display = 'block';

            this.dealCards();

            console.log(this.cards);
            console.log(this.players);

            this.displayCards(this.players[0], 'dealer-hand', false);
            this.displayCards(player, 'player-hand');

            playerCash.textContent = `Cash: $${player.cash}`;
            playerWager.textContent = `Wager: $${player.wager}`;
            playerTitle.textContent = `${player.name}'s Hand`;

            this.playerTurn();
        }

        this.wagerQuarterButtonClickListener = () => {
            const player = this.players[1];

            player.wager = Math.round(0.25 * player.cash);
            player.cash -= player.wager;
            wagerContainer.style.display = 'none';
            dealerHand.style.display = 'block';

            this.dealCards();

            console.log(this.cards);
            console.log(this.players);

            this.displayCards(this.players[0], 'dealer-hand', false);
            this.displayCards(player, 'player-hand');

            playerCash.textContent = `Cash: $${player.cash}`;
            playerWager.textContent = `Wager: $${player.wager}`;
            playerTitle.textContent = `${player.name}'s Hand`;

            this.playerTurn();
        }

        this.wagerHalfButtonClickListener = () => {
            const player = this.players[1];

            player.wager = Math.round(0.5 * player.cash);
            player.cash -= player.wager;
            wagerContainer.style.display = 'none';
            dealerHand.style.display = 'block';

            this.dealCards();

            console.log(this.cards);
            console.log(this.players);

            this.displayCards(this.players[0], 'dealer-hand', false);
            this.displayCards(player, 'player-hand');

            playerCash.textContent = `Cash: $${player.cash}`;
            playerWager.textContent = `Wager: $${player.wager}`;
            playerTitle.textContent = `${player.name}'s Hand`;

            this.playerTurn();
        }

        this.wagerAllButtonClickListener = () => {
            const player = this.players[1];

            player.wager = player.cash;
            player.cash -= player.wager;
            wagerContainer.style.display = 'none';
            dealerHand.style.display = 'block';

            this.dealCards();

            console.log(this.cards);
            console.log(this.players);

            this.displayCards(this.players[0], 'dealer-hand', false);
            this.displayCards(player, 'player-hand');

            playerCash.textContent = `Cash: $${player.cash}`;
            playerWager.textContent = `Wager: $${player.wager}`;
            playerTitle.textContent = `${player.name}'s Hand`;

            this.playerTurn();
        }
    }

    // Remove event listener functions
    // The functions added to event listners call these to remove themselves
    removeHitButtonListener() {
        hitButton.removeEventListener('click', this.hitButtonClickListener);
    }

    removeStandButtonListener() {
        standButton.removeEventListener('click', this.standButtonClickListener);
    }

    removePlayAgainButtonListener() {
        againButton.removeEventListener('click', this.playAgainButtonClickListener);
    }

    createDeck() {
        this.cards = [];
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
        player1.cash = 1000;
        player1.highScore = 1000;
        this.players.push(player1);
    };

    addDealer() {
        let dealer = new Dealer;
        dealer.game = this;
        this.players.push(dealer);
    }

    startGame(playerName) {
        inputContainer.style.display = 'none';
        dealerHand.style.display = 'none';
        playerHand.style.display = 'block';

        // Clear players array for use when getting Game Over
        this.players = [];
        
        this.cards = this.createDeck();
        this.shuffleDeck();
        this.addDealer();
        this.addPlayer(playerName);
        const dealer = this.players[0];
        const player = this.players[1];

        playerCash.textContent = `Cash: $${player.cash}`;
        playerWager.textContent = `Wager: $${player.wager}`;
        
        this.wager();
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


        // Preload card images
        // Was having issues with images loading async. so I needed to make sure all image were loaded before appending to DOM
        const cardImages = [];
        let loadedCount = 0;
        const totalCount = player.hand.length;

        player.hand.forEach((card, index) => {
            const cardImage = new Image();

            // Checks if this is the dealer's second card, so it can be hidden
            if (!showAllCards && player.name === 'Dealer' && index === 1) {
                cardImage.src = 'images/backside.png';
            } else {
                cardImage.src = card.imagePath;
            }
            cardImages.push(cardImage);
            cardImage.onload = function() {
                loadedCount++;

                // Appends the cardImages array to DOM only after loadedCount is equal to hand length
                if (loadedCount === totalCount) {
                    // All images loaded, append to the DOM
                    cardImages.forEach((image) => {
                        cardsElement.appendChild(image);
                    });
                }
            };
            cardImage.style.width = '100px';
        });
    }

    clearCards(elementId) {
        const cardsElement = document.getElementById(elementId);
        cardsElement.innerHTML = '';
    }

    playerTurn() {
        btnContainer.style.display = 'block';
        const player = this.players[1];

        if(player.score === 21) {
            
            againContainer.style.display = 'block';

            // Pay out 3:2
            player.cash = player.cash + (2.5 * player.wager);
            player.wager = 0;

            playerCash.textContent = `Cash: $${player.cash}`;
            playerWager.textContent = `Wager: $${player.wager}`;

            // Add event listener for play again button
            againButton.addEventListener('click', this.playAgainButtonClickListener);
            
            console.log('BLACKJACK!!');
            btnContainer.style.display = 'none';
            
        }

        
        hitButton.addEventListener('click', this.hitButtonClickListener);
        standButton.addEventListener('click', this.standButtonClickListener);
    }

     dealerTurn() {
        const dealer = this.players[0];
        const player = this.players[1];

        dealerScore.style.display = 'block';

        while(dealer.score < player.score) {
            dealer.hitMe();
        }

        if(dealer.score > 21) {
            console.log('DEALER BUSTS. PLAYER WINS');
            this.displayCards(dealer, 'dealer-hand');

            // Payout 2:1
            player.cash = player.cash + (2 * player.wager);

        } else if (dealer.score === player.score) {
            console.log('PUSH');
            this.displayCards(dealer, 'dealer-hand');

            // Return the wager to cash pool
            player.cash += player.wager;
        } else {
            console.log('DEALER WINS');
            this.displayCards(dealer, 'dealer-hand');
        }

        // Reset wager and update cash/wager display
        player.wager = 0;

        playerCash.textContent = `Cash: $${player.cash}`;
        playerWager.textContent = `Wager: $${player.wager}`;

        againContainer.style.display = 'block';

        // Check if player is out of cash
        if (player.cash === 0) {
            console.log('GAME OVER');
            againContainer.style.display = 'none';

            setTimeout(() => {
                this.gameOver();
            }, 5000);
        }

        againButton.addEventListener('click', this.playAgainButtonClickListener);
    }


    playAgain() {
        //inputContainer.style.display = 'none';
        againContainer.style.display = 'none';
        dealerHand.style.display = 'none';

        // Reset player and dealer hands/scores
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand = []; // Reset hand to an empty array
            this.players[i].score = 0;
        }

        // Clears card HTML
        this.clearCards('player-cards');
        this.clearCards('dealer-cards');

        this.createDeck();
        this.shuffleDeck();

        dealerScore.style.display = 'none';

        this.wager();
    }

    wager() {
        const player = this.players[1];
        wagerContainer.style.display = 'block';

        playerTitle.textContent = 'Enter Your Wager';

        // Check high score
        if(player.cash > player.highScore) {
            player.highScore = player.cash;
        }

        lilWager.addEventListener('click', this.wagerLilButtonClickListener);
        quarterWager.addEventListener('click', this.wagerQuarterButtonClickListener);
        halfWager.addEventListener('click', this.wagerHalfButtonClickListener);
        fullWager.addEventListener('click', this.wagerAllButtonClickListener);
    }

    gameOver() {
        const player = this.players[1];
        saveHighScore(player.name, player.highScore);
        updateHighScoreList();
        location.reload();
    }
}


// Used when starting a new game
startBtn.addEventListener('click', () => {
    const playerName = nameInput.value;
    if(playerName) {
        const game1 = new Game();
        game1.startGame(playerName);

    } else {
        alert('Please enter your name.');
    }
});


// Utility functions for high scores
function saveHighScore(playerName, score) {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score); // Sort by score descending
    highScores = highScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function getHighScores() {
    return JSON.parse(localStorage.getItem('highScores')) || [];
}

// Function to update the high score list in the HTML
function updateHighScoreList() {
    const highScores = getHighScores();
    const highScoreList = document.getElementById('high-score-list');

    // Clear the current list
    highScoreList.innerHTML = '';

    // Add high scores to the list
    highScores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score.name}: $${score.score}`;
        highScoreList.appendChild(li);
    });
}

// Function to clear high scores
function clearHighScores() {
    localStorage.removeItem('highScores'); // Clear the high scores from local storage
    const highScoreList = document.getElementById('high-score-list');
    highScoreList.innerHTML = ''; // Clear the high scores list display
}

// Call updateHighScoreList on page load
updateHighScoreList();

// Event listener for clear high scores button
clearButton.addEventListener('click', clearHighScores);