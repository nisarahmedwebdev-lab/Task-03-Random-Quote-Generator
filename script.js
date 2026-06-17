const quotesData = [
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "Strive not to be a success, but rather to be of value.",
        author: "Albert Einstein"
    },
    {
        quote: "Do not go where the path may lead, go instead where there is no path and leave a trail.",

        author: "Ralph Waldo Emerson"
    },
    {
        quote: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },
    {
        quote: "Whether you think you can or you think you can't, you're right.",
        author: "Henry Ford"
    },
    {
        quote: "You have your way. I have my way. As for the right way, the correct way, and the only way, it does not exist.",
        author: "Friedrich Wilhelm Nietzsche"
    },
    {
        quote: "I have not failed. I've just found 10,000 ways that won't work.",
        author: "Thomas Edison"
    },
    {
        quote: "In the middle of every difficulty lies opportunity.",
        author: "Albert Einstein"
    }
];

let currentQuote = null;
let quoteHistory = [];
let favorites = JSON.parse(localStorage.getItem('quoteFavorites')) || [];

const textEl = document.getElementById('text');
const authorEl = document.getElementById('author');
const quoteWrapper = document.getElementById('quote-wrapper');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const favBtn = document.getElementById('fav-btn');
const favIcon = document.getElementById('fav-icon');
const favoritesListEl = document.getElementById('favorites-list');
const toastEl = document.getElementById('toast');

function getNewQuote() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quotesData.length);
    } while (quoteHistory.includes(randomIndex));

    quoteHistory.push(randomIndex);
    if (quoteHistory.length > 2) {
        quoteHistory.shift();
    }

    currentQuote = quotesData[randomIndex];
    quoteWrapper.classList.add('fade-out');

    setTimeout(() => {
        textEl.textContent = currentQuote.quote;
        authorEl.textContent = currentQuote.author;
        updateTweetUrl();
        updateFavButtonState();
        quoteWrapper.classList.remove('fade-out');
    }, 300);
}

function copyToClipboard() {
    if (!currentQuote) return;
    const textToCopy = `"${currentQuote.quote}" — ${currentQuote.author}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        toastEl.classList.add('show');
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function updateTweetUrl() {
    const tweetText = encodeURIComponent(`"${currentQuote.quote}" — ${currentQuote.author}`);
    tweetBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
}

function toggleFavorite() {
    const index = favorites.findIndex(fav => fav.quote === currentQuote.quote && fav.author === currentQuote.author);

    if (index === -1) {
        favorites.push(currentQuote);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('quoteFavorites', JSON.stringify(favorites));
    updateFavButtonState();
    renderFavorites();
}

function updateFavButtonState() {
    const isFav = favorites.some(fav => fav.quote === currentQuote.quote && fav.author === currentQuote.author);
    if (isFav) {
        favBtn.classList.add('active');
        favIcon.className = 'bi bi-star-fill';
    } else {
        favBtn.classList.remove('active');
        favIcon.className = 'bi bi-star';
    }
}

function renderFavorites() {
    favoritesListEl.innerHTML = '';
    if (favorites.length === 0) {
        favoritesListEl.innerHTML = '<li class="fav-item" style="color: #999; text-align: center;">No favourites saved yet.</li>';
        return;
    }

    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.className = 'fav-item';
        li.innerHTML = `<span class="fav-item-text">“${fav.quote}”</span> <span class="fav-item-author">— ${fav.author}</span>`;
        favoritesListEl.appendChild(li);
    });
}

newQuoteBtn.addEventListener('click', getNewQuote);
copyBtn.addEventListener('click', copyToClipboard);
favBtn.addEventListener('click', toggleFavorite);

getNewQuote();
renderFavorites();

setInterval(() => {
    getNewQuote();
}, 5000);
