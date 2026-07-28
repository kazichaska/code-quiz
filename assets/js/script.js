// creating all variables
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerEl = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const answerBtnEl = document.getElementById('answer-buttons');
var resultScoreEl = document.getElementById("viewscore");
var timerContain = document.querySelector(".timer-container");
var timeCount = document.querySelector(".time-count")
var highScoresEl = document.getElementById("highscores");
highScoresEl.classList.add('hide');

// modern UI elements
const scoreValueEl = document.getElementById('score-value');
const streakBadgeEl = document.getElementById('streak-badge');
const streakCountEl = document.getElementById('streak-count');
const soundToggleBtn = document.getElementById('sound-toggle');
const soundIconEl = document.getElementById('sound-icon');
const startScreenEl = document.getElementById('start-screen');
const timerContainerEl = document.querySelector('.timer-container');
const timerFillEl = document.getElementById('timer-fill');
const progressFillEl = document.getElementById('progress-fill');
const questionCounterEl = document.getElementById('question-counter');
const modalTitleEl = document.getElementById('modal-title');
const modalSubtitleEl = document.getElementById('modal-subtitle');
const TOTAL_TIME = 75;

let shuffledQuestions;
let currentQuestionIndex = 0;
var score = 0;
var streak = 0;
var myButtonCounter = 0;
let initials;
var timeleft = 75;
var timeDeduct = 5;
var myScore = JSON.parse(localStorage.getItem('user'));
console.log(myScore);

// ---------- Sound effects (Web Audio, no external assets) ----------
let audioCtx = null;
let soundMuted = localStorage.getItem('quizSoundMuted') === 'true';
soundIconEl.textContent = soundMuted ? '🔇' : '🔊';
soundToggleBtn.setAttribute('aria-pressed', String(!soundMuted));

function getAudioCtx() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'sine', delay = 0, volume = 0.15) {
    if (soundMuted) return;
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const startTime = ctx.currentTime + delay;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playCorrectSound() {
    playTone(523.25, 0.12, 'sine', 0);
    playTone(783.99, 0.16, 'sine', 0.1);
}

function playWrongSound() {
    playTone(160, 0.25, 'sawtooth', 0, 0.1);
}

function playClickSound() {
    playTone(700, 0.05, 'square', 0, 0.05);
}

soundToggleBtn.addEventListener('click', () => {
    soundMuted = !soundMuted;
    localStorage.setItem('quizSoundMuted', String(soundMuted));
    soundIconEl.textContent = soundMuted ? '🔇' : '🔊';
    soundToggleBtn.setAttribute('aria-pressed', String(!soundMuted));
    if (!soundMuted) playClickSound();
});

// ---------- Click ripple feedback on every .btn ----------
document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    if (!btn.classList.contains('answer-btn') && btn.id !== 'sound-toggle') {
        playClickSound();
    }
});

// ---------- Animated score readout ----------
let displayedScore = 0;
function setScoreDisplay(newScore, delta) {
    const start = displayedScore;
    const change = newScore - start;
    const duration = 350;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 2);
        scoreValueEl.textContent = Math.round(start + change * eased);
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            scoreValueEl.textContent = newScore;
            displayedScore = newScore;
        }
    }
    requestAnimationFrame(tick);

    if (typeof delta === 'number' && delta !== 0) {
        const chip = document.createElement('span');
        chip.className = 'score-delta ' + (delta > 0 ? 'positive' : 'negative');
        chip.textContent = (delta > 0 ? '+' : '') + delta;
        resultScoreEl.appendChild(chip);
        setTimeout(() => chip.remove(), 900);
    }
}

// ---------- Streak indicator ----------
function updateStreak(correct) {
    if (correct) {
        streak++;
    } else {
        streak = 0;
    }

    if (streak >= 2) {
        streakCountEl.textContent = streak;
        streakBadgeEl.classList.remove('hide');
        streakBadgeEl.classList.remove('pop');
        void streakBadgeEl.offsetWidth; // restart animation
        streakBadgeEl.classList.add('pop');
    } else {
        streakBadgeEl.classList.add('hide');
    }
}

// ---------- Keyboard shortcuts ----------
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!startScreenEl.classList.contains('hide') && !startButton.classList.contains('hide') && key === 'Enter') {
        e.preventDefault();
        startButton.click();
        return;
    }

    if (questionContainerEl.classList.contains('hide')) return;

    if (!nextButton.classList.contains('hide') && (key === 'Enter' || key === ' ')) {
        e.preventDefault();
        nextButton.click();
        return;
    }

    const answerButtons = Array.from(answerBtnEl.children);
    if (answerButtons.length === 0 || answerButtons[0].classList.contains('answered')) return;

    let index = -1;
    if (/^[1-4]$/.test(key)) {
        index = Number(key) - 1;
    } else if (/^[a-dA-D]$/.test(key)) {
        index = key.toUpperCase().charCodeAt(0) - 65;
    }

    if (index >= 0 && answerButtons[index]) {
        answerButtons[index].click();
    }
});

// Start button click
startButton.addEventListener('click', startGame);

// High scores button click
document.getElementById('highscores').addEventListener('click', () => {
    if (myScore) {
        showHighScores(myScore);
    }
});
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= questions.length) {
        endGame();
    } else {
        nextButton.classList.add('hide');
        nextQuestion();
    }
})

// startGame function
function startGame() {
    console.log('Game Started!');
    getAudioCtx(); // warm up on a genuine user gesture
    startScreenEl.classList.add('hide');
    startTimer();
    startButton.classList.add('hide');
    nextButton.classList.add('hide');

    // Create a copy and shuffle the questions
    shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    currentQuestionIndex = 0;
    score = 0; // Reset score at start
    streak = 0;
    displayedScore = 0;
    scoreValueEl.textContent = '0';
    streakBadgeEl.classList.add('hide');
    questionContainerEl.classList.remove('hide');
    highScoresEl.textContent = "";
    highScoresEl.classList.add('hide');
    timeleft = TOTAL_TIME;
    timeCount.textContent = timeleft;
    timerFillEl.style.width = '100%';
    timerContainerEl.classList.remove('low');
    nextQuestion();
}

// start timer function
function startTimer() {
    timerContain = setInterval(function() {
        timeleft --;
        timeCount.textContent = timeleft;
        timerFillEl.style.width = Math.max(0, (timeleft / TOTAL_TIME) * 100) + '%';
        timerContainerEl.classList.toggle('low', timeleft <= 15);
        if(timeleft <= 0){
          clearInterval(timerContain);
          endGame();
        }
    }, 1000)
}

// Function for nextQuestion
function nextQuestion() {
    // myButtonCounter = 0
    resetState();
    updateProgress();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// updateProgress function - drives the "Question x of y" progress bar
function updateProgress() {
    const total = shuffledQuestions.length;
    const current = currentQuestionIndex + 1;
    progressFillEl.style.width = (current / total) * 100 + '%';
    questionCounterEl.textContent = `Question ${current} of ${total}`;
}

// showQuestion function
const ANSWER_LETTERS = ['A', 'B', 'C', 'D'];
function showQuestion(question) {
    questionEl.innerHTML = question.question;
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('btn', 'answer-btn');
        button.dataset.correct = answer.correct.toString(); // Explicitly set true/false as string
        button.innerHTML = `<span class="answer-letter">${ANSWER_LETTERS[index]}</span><span class="answer-text"></span>`;
        button.querySelector('.answer-text').textContent = answer.text;
        button.addEventListener('click', pickAnswer);
        answerBtnEl.appendChild(button);
    })
}

// resetState function
function resetState() {
    clearStatusClass(document.body);
    // nextButton.classList.add('hide')
    while (answerBtnEl.firstChild) {
        answerBtnEl.removeChild(answerBtnEl.firstChild);
    }
}

// pickAnswer function
function pickAnswer(e) {
    const buttonSelected = e.currentTarget;

    // Prevent multiple clicks on answers
    if (buttonSelected.classList.contains('answered')) {
        return;
    }
    
    const correct = buttonSelected.dataset.correct === 'true'; // Convert string to boolean
    statusClass(document.body, correct);
    
    // Mark all buttons as answered and show correct/wrong
    Array.from(answerBtnEl.children).forEach(button => {
        button.classList.add('answered');
        const isCorrect = button.dataset.correct === 'true';
        statusClass(button, isCorrect);
    });
    
    nextButton.classList.remove('hide');
    
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        nextButton.innerText = 'Finish Quiz';
    }
    
    scoreTotal(correct);
}

// statusClass function
function statusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// Score total function
function scoreTotal(correct) {
    updateStreak(correct);

    if (correct === true) { // Explicitly check for true
        score += 10;
        setScoreDisplay(score, 10);
        playCorrectSound();
        resultScoreEl.classList.add('score-update');
        setTimeout(() => resultScoreEl.classList.remove('score-update'), 300);
    } else {
        score = Math.max(0, score - 5); // Prevent negative scores
        timeleft = Math.max(0, timeleft - timeDeduct);
        timeCount.textContent = timeleft;
        timerFillEl.style.width = Math.max(0, (timeleft / TOTAL_TIME) * 100) + '%';
        timerContainerEl.classList.toggle('low', timeleft <= 15);
        setScoreDisplay(score, -5);
        playWrongSound();
        resultScoreEl.classList.add('score-update');
        setTimeout(() => resultScoreEl.classList.remove('score-update'), 300);

        if (timeleft <= 0) {
            endGame();
            return;
        }
    }
}

// clearStatusClass function
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// highScores function
const MEDALS = ['🥇', '🥈', '🥉'];
function showHighScores(scores) {
    if (!Array.isArray(scores) || scores.length === 0) return;

    const scoresContainer = document.getElementById('scores-display');
    const scoresList = document.getElementById('scores-list');
    const closeBtn = document.getElementById('close-scores');

    // Sort scores in descending order
    scores.sort((a, b) => b.tempscore - a.tempscore);

    // Clear previous scores
    scoresList.innerHTML = '';

    // Add each score to the list
    scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('score-item');
        if (index < 3) scoreItem.classList.add(`top-${index + 1}`);
        const rank = index < 3 ? MEDALS[index] : `#${index + 1}`;
        scoreItem.innerHTML = `
            <span class="rank">${rank}</span>
            <span class="initials">${score.initials}</span>
            <span class="meta">
                <span class="score">${score.tempscore} points</span>
                <span class="date">${score.date}</span>
            </span>
        `;
        scoresList.appendChild(scoreItem);
    });

    // Show the scores container
    scoresContainer.classList.remove('hide');

    // Handle close button
    closeBtn.onclick = function() {
        scoresContainer.classList.add('hide');
    }

    // Update the view score button text
    highScoresEl.textContent = `🏆 High Score: ${scores[0].tempscore}`;
}

// endGame function
function endGame() {
    clearInterval(timerContain);
    resetState();
    questionContainerEl.classList.add('hide');
    startScreenEl.classList.remove('hide');
    startButton.classList.remove('hide');
    startButton.innerHTML = '<span>&#8635;</span> Start Over';
    highScoresEl.classList.remove('hide');
    finalScore();
    score = 0;
    streak = 0;
    streakBadgeEl.classList.add('hide');
    currentQuestionIndex = 0;
    timeleft = TOTAL_TIME; // Reset timer
    timeCount.textContent = timeleft;
    timerFillEl.style.width = '100%';
    timerContainerEl.classList.remove('low');
}

// launchConfetti function - lightweight celebratory burst for the game-over modal
function launchConfetti(container, intense = false) {
    const colors = ['#8b6bff', '#34e0ff', '#ff5da2', '#ffb020', '#2fe6a7'];
    const layer = document.createElement('div');
    layer.classList.add('confetti-layer');
    const pieceCount = intense ? 55 : 28;

    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement('span');
        piece.classList.add('confetti-piece');
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * (intense ? 0.7 : 0.4)) + 's';
        layer.appendChild(piece);
    }

    container.appendChild(layer);
    setTimeout(() => layer.remove(), 2200);
}

// finalScore function
function finalScore() {
    const modal = document.getElementById('score-modal');
    const modalContent = modal.querySelector('.modal-content');
    const finalScoreEl = document.getElementById('final-score');
    const submitBtn = document.getElementById('submit-score');
    const initialsInput = document.getElementById('initials');

    // Capture the score now — endGame() resets the global `score` to 0
    // right after calling this function, but the user submits asynchronously.
    const capturedScore = score;

    const previousBest = (Array.isArray(myScore) && myScore.length > 0)
        ? Math.max(...myScore.map(s => s.tempscore))
        : 0;
    const isNewHighScore = capturedScore > 0 && capturedScore > previousBest;

    if (isNewHighScore) {
        modalTitleEl.textContent = '🏆 New High Score!';
        modalSubtitleEl.textContent = `You beat your previous best of ${previousBest}!`;
        modalSubtitleEl.classList.remove('hide');
        modalContent.classList.add('new-high-score');
    } else {
        modalTitleEl.textContent = '🎉 Game Over!';
        modalSubtitleEl.classList.add('hide');
        modalContent.classList.remove('new-high-score');
    }

    finalScoreEl.textContent = capturedScore;
    modal.classList.remove('hide');
    initialsInput.value = ''; // Clear previous input
    launchConfetti(modalContent, isNewHighScore);

    // Remove any existing event listeners by cloning and replacing the button
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', function() {
        const initials = initialsInput.value.trim();

        if (!initials || initials.length < 2 || initials.length > 3) {
            alert("Please enter 2-3 characters for your initials");
            return;
        }

        const user = {
            initials: initials.toUpperCase(),
            tempscore: capturedScore,
            date: new Date().toLocaleDateString()
        };

        if (myScore === null) {
            myScore = [];
        }

        myScore.push(user);
        localStorage.setItem("user", JSON.stringify(myScore));
        modal.classList.add('hide');
        showHighScores(myScore);
    });
}

// Array with the question and answers
const questions = [
    {
        question: "🤔 What happens to a JavaScript variable if you declare it but don't initialize it?",
        answers: [
            { text: 'It becomes undefined', correct: true },
            { text: 'It throws an error', correct: false },
            { text: 'It gets set to null', correct: false },
            { text: 'It creates a black hole in your code', correct: false },
        ]
    },
    {
        question: "🎮 Which of these would you use to get a random number between 1 and 10?",
        answers: [
            { text: 'Math.random() * 10 + 1', correct: false },
            { text: 'Math.floor(Math.random() * 10) + 1', correct: true },
            { text: 'Math.ceiling(Math.random() * 10)', correct: false },
            { text: 'Random.nextInt(10)', correct: false },
        ]
    },    
    {
        question: "🐛 Why did the JavaScript developer quit his job?",
        answers: [
            { text: 'He didn\'t get arrays', correct: true },
            { text: 'The coffee machine broke', correct: false },
            { text: 'His code compiled first try', correct: false },
            { text: 'He found a better debugger', correct: false },
        ]
    },
    {
        question: "🤖 What would be the result of: 3 + 2 + '7'",
        answers: [
            { text: '57', correct: true },
            { text: '12', correct: false },
            { text: '327', correct: false },
            { text: 'undefined', correct: false },
        ]
    },
    {
        question: "🎭 Which of these is NOT a JavaScript data type?",
        answers: [
            { text: 'Undefined', correct: false },
            { text: 'Integer', correct: true },
            { text: 'Boolean', correct: false },
            { text: 'Symbol', correct: false },
        ]
    },
    {
        question: "🎨 What color would RGB(255, 0, 255) give you?",
        answers: [
            { text: 'Blue', correct: false },
            { text: 'Red', correct: false },
            { text: 'Magenta', correct: true },
            { text: 'Yellow', correct: false },
        ]
    },
    {
        question: "🌟 What's the opposite of a CSS 'display: none'?",
        answers: [
            { text: 'display: yes', correct: false },
            { text: 'display: show', correct: false },
            { text: 'display: block', correct: true },
            { text: 'display: visible', correct: false },
        ]
    },
    {
        question: "🎪 What does the '===' operator check for?",
        answers: [
            { text: 'Value only', correct: false },
            { text: 'Value and type', correct: true },
            { text: 'Reference only', correct: false },
            { text: 'Nothing, it\'s just for style', correct: false },
        ]
    },
    {
        question: "📦 What's the value of: typeof []",
        answers: [
            { text: 'array', correct: false },
            { text: 'object', correct: true },
            { text: 'list', correct: false },
            { text: 'undefined', correct: false },
        ]
    },
    {
        question: "🎯 How do you catch all the fish in JavaScript?",
        answers: [
            { text: 'With a try...catch block!', correct: true },
            { text: 'With a fishing rod', correct: false },
            { text: 'Using jQuery', correct: false },
            { text: 'You don\'t, they swim away', correct: false },
        ]
    },
    {
        question: "🔒 Which keyword declares a variable that can't be reassigned?",
        answers: [
            { text: 'var', correct: false },
            { text: 'let', correct: false },
            { text: 'const', correct: true },
            { text: 'final', correct: false },
        ]
    },
    {
        question: "🧮 What's the value of: typeof NaN",
        answers: [
            { text: "'NaN'", correct: false },
            { text: "'undefined'", correct: false },
            { text: "'number'", correct: true },
            { text: "'object'", correct: false },
        ]
    },
    {
        question: "📚 Which method checks if something is an array?",
        answers: [
            { text: 'Array.isArray()', correct: true },
            { text: 'typeof array', correct: false },
            { text: 'array.isArray()', correct: false },
            { text: 'Array.check()', correct: false },
        ]
    },
    {
        question: "💾 Which storage is cleared when the browser tab closes?",
        answers: [
            { text: 'localStorage', correct: false },
            { text: 'cookies', correct: false },
            { text: 'sessionStorage', correct: true },
            { text: 'indexedDB', correct: false },
        ]
    },
    {
        question: "🥪 Why do programmers prefer dark mode?",
        answers: [
            { text: 'Because light attracts bugs', correct: true },
            { text: 'It saves battery on every screen', correct: false },
            { text: 'It compiles faster', correct: false },
            { text: 'Because the CSS told them to', correct: false },
        ]
    },
    {
        question: "🧱 In the CSS box model, what does 'box-sizing: border-box' include in an element's width?",
        answers: [
            { text: 'Content only', correct: false },
            { text: 'Content and padding only', correct: false },
            { text: 'Content, padding, and border', correct: true },
            { text: 'Margin only', correct: false },
        ]
    },
    {
        question: "🌀 What does the spread operator '...' do to an array?",
        answers: [
            { text: 'Deletes it', correct: false },
            { text: 'Expands it into individual elements', correct: true },
            { text: 'Reverses it', correct: false },
            { text: 'Converts it to a string', correct: false },
        ]
    },
    {
        question: "🍞 What does JSON stand for?",
        answers: [
            { text: 'JavaScript Object Notation', correct: true },
            { text: 'Java Standard Object Network', correct: false },
            { text: 'JavaScript Ordered Numbers', correct: false },
            { text: 'Just Some Old Numbers', correct: false },
        ]
    },
    {
        question: "🔍 What does the '==' operator do differently from '==='?",
        answers: [
            { text: 'Nothing, they are identical', correct: false },
            { text: "'==' coerces types before comparing", correct: true },
            { text: "'===' coerces types before comparing", correct: false },
            { text: "'==' only works on numbers", correct: false },
        ]
    },
    {
        question: "🐞 A programmer's spouse says 'buy a loaf of bread, and if they have eggs, buy a dozen.' What did they come home with?",
        answers: [
            { text: 'A dozen loaves of bread', correct: true },
            { text: 'A loaf of bread and a dozen eggs', correct: false },
            { text: 'A dozen eggs', correct: false },
            { text: 'Nothing, the store was closed', correct: false },
        ]
    }
];
