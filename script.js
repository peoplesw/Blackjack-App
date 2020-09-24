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
};
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('blackjack_assets/sounds/swish.m4a');


showScore = (activePlayer) => {
    if(activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
    }else {
        document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

updateScore = (random_card, activePlayer) => {
    // Handles Ace case. If adding 11 keeps me below 21, add 11. Otherwise, add 1.
    if(random_card == 'A' && activePlayer['score'] + 11 <= 21) {
        activePlayer['score'] += blackjackGame['cardsMap'][random_card][1];
    }else if(random_card == 'A' && activePlayer['score'] + 11 > 21) {
        activePlayer['score'] += blackjackGame['cardsMap'][random_card][0]; 
    }else {
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
    const random_card = randomCard();
    showCard(random_card, YOU);
    updateScore(random_card, YOU);
    showScore(YOU);
}

blackjackDeal = () => {
    YOU['score'] = 0; // resets values in our blackjackGame object
    DEALER['score'] = 0;
    document.querySelector(YOU['scoreSpan']).innerText = '0'; // resets visible values
    document.querySelector(DEALER['scoreSpan']).innerText = '0';
    document.querySelector(YOU['scoreSpan']).style.color = 'white';
    document.querySelector(DEALER['scoreSpan']).style.color = 'white';
    document.querySelector('#blackjack-result').innerText = 'Let\'s play!';

    // Removes all images on table
    const images = document.querySelectorAll('img'); // list of img tags on page
    for(let img of images) {
        img.remove();
    }
}

// Hit Button Event Listener
document.getElementById('blackjack-hit-button').addEventListener('click', blackjackHit);
// Deal Button Event Listener
document.getElementById('blackjack-deal-button').addEventListener('click', blackjackDeal);

