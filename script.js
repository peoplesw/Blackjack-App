let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result',
            'div': '#your-box',
            'score': 0},
    
    'dealer': {'scoreSpan': '#dealer-blackjack-result',
               'div': '#dealer-box',
               'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
                 '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('blackjack_assets/sounds/cash.mp3');
const lossSound = new Audio('blackjack_assets/sounds/aww.mp3');


showResult = (winner) => {
    let message, messageColor;
    if(winner === YOU) {
        message = 'You won!';
        messageColor = 'green';
        document.querySelector('#wins').innerText = blackjackGame['wins'];
        winSound.play();
    } else if(winner === DEALER) {
        message = 'You lost!';
        messageColor = 'red';
        document.querySelector('#losses').innerText = blackjackGame['losses'];
        lossSound.play();
    } else {
        message = 'It\'s a draw!';
        messageColor = 'black';
        document.querySelector('#draws').innerText = blackjackGame['draws'];
    }
    
    document.querySelector('#blackjack-result').innerText = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}

// compute winner and who just won
// update the wins, draws, and losses
computeWinner = () => {
    let winner;
    if(YOU['score'] <= 21) {    
        // condition: higher score than dealer or when dealer busts but you're 21 or under 21.
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
            blackjackGame['wins'] += 1;
        } else if(YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjackGame['losses'] += 1;
        } else if(YOU['score'] === DEALER['score']) {
            blackjackGame['draws'] += 1;
        }
      // condition: when user busts but dealer doesn't  
    } else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
            winner = DEALER;
            blackjackGame['losses'] += 1;
      // condition: when you and the dealer get a bust      
    } else if(YOU['score'] > 21 && DEALER['score'] > 21) {
            blackjackGame['draws'] += 1;
    }
    
    return winner;
}

sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// asynchronous functionality allows the dealer's cards to come in 1 sec at a time.
dealerLogic = async () => {
    if(blackjackGame['turnsOver'] === false) {
        blackjackGame['isStand'] = true;
        // 16 is a subjective number that I thought made the game competitive. It can be increased or decreased.
        while(DEALER['score'] < 16) {
            const random_card = randomCard();
            showCard(random_card, DEALER);
            updateScore(random_card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }
        blackjackGame['turnsOver'] = true;
        showResult(computeWinner());
    }    
}

showScore = (activePlayer) => {
    if(activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
    } else {
        document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

updateScore = (random_card, activePlayer) => {
    // Handles Ace case. If adding 11 keeps me below 21, add 11. Otherwise, add 1.
    if(random_card == 'A' && activePlayer['score'] + 11 <= 21) {
        activePlayer['score'] += blackjackGame['cardsMap'][random_card][1];
    } else if(random_card == 'A' && activePlayer['score'] + 11 > 21) {
        activePlayer['score'] += blackjackGame['cardsMap'][random_card][0]; 
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][random_card]; 
    }
}

randomCard = () => {
    const randomCard = blackjackGame.cards[Math.floor(Math.random() * blackjackGame.cards.length)];
    return randomCard;
}

showCard = (random_card, activePlayer) => {
    if(activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `blackjack_assets/images/${random_card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

blackjackHit = () => {
    if(blackjackGame['isStand'] === false) {
        const random_card = randomCard();
        showCard(random_card, YOU);
        updateScore(random_card, YOU);
        showScore(YOU);
    }
}

blackjackDeal = () => {
    if(blackjackGame['turnsOver']) {    
        YOU['score'] = 0; // resets scores in our blackjackGame object
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).innerText = '0'; // resets displayed scores
        document.querySelector(DEALER['scoreSpan']).innerText = '0';
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector('#blackjack-result').innerText = 'Let\'s play!'; // resets result of the game
        document.querySelector('#blackjack-result').style.color = 'black';
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;

        // Removes all images on table
        const images = document.querySelectorAll('img'); // list of img tags on page
        for(let img of images) {
            img.remove();
        }
    }
}

// Hit Button Event Listener
document.getElementById('blackjack-hit-button').addEventListener('click', blackjackHit);
// Deal Button Event Listener
document.getElementById('blackjack-deal-button').addEventListener('click', blackjackDeal);
// Stand Button Event Listener
document.getElementById('blackjack-stand-button').addEventListener('click', dealerLogic);

