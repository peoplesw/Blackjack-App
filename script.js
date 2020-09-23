let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result',
            'div': '#your-box',
            'score': 0},
    
    'dealer': {'scoreSpan': '#dealer-blackjack-result',
               'div': '#dealer-box',
               'score': 0}
};
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];


blackjackHit = () => {
    let cardImage = document.createElement('img');
    cardImage.src = 'blackjack_assets/images/new-9.png';
    document.querySelector(YOU['div']).appendChild(cardImage);
}

document.getElementById('blackjack-hit-button').addEventListener('click', blackjackHit);

