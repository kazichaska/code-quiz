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

let shuffledQuestions;
let currentQuestionIndex = 0;
var score = 0;
var myButtonCounter = 0;
let initials;
var timeleft = 75;
var timeDeduct = 5;
var myScore = JSON.parse(localStorage.getItem('user'));
console.log(myScore);

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
    resultScoreEl.textContent = 'Score: 0';
    questionContainerEl.classList.remove('hide');
    highScoresEl.textContent = "";
    highScoresEl.classList.add('hide');
    nextQuestion();
}

// start timer function
function startTimer() {
    timerContain = setInterval(function() {
        timeleft --;
        timeCount.textContent = timeleft;
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
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// showQuestion function
function showQuestion(question) {
    questionEl.innerHTML = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.correct = answer.correct.toString(); // Explicitly set true/false as string
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
    const buttonSelected = e.target;
    
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
    if (correct === true) { // Explicitly check for true
        score += 10;
        resultScoreEl.textContent = '🎯 Score: ' + score + ' (Correct! +10)';
        resultScoreEl.classList.add('score-update');
        setTimeout(() => resultScoreEl.classList.remove('score-update'), 300);
    } else {
        score = Math.max(0, score - 5); // Prevent negative scores
        timeleft = Math.max(0, timeleft - timeDeduct);
        timeCount.textContent = timeleft;
        resultScoreEl.textContent = '❌ Score: ' + score + ' (Incorrect -5)';
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
        scoreItem.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="initials">${score.initials}</span>
            <span class="score">${score.tempscore} points</span>
            <span class="date">${score.date}</span>
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
    highScoresEl.textContent = `High Score: ${scores[0].tempscore}`;
}

// endGame function
function endGame() {
    clearInterval(timerContain);
    resetState();
    questionContainerEl.classList.add('hide');
    startButton.classList.remove('hide');
    startButton.innerText = 'Start Over';
    highScoresEl.classList.remove('hide');
    finalScore();
    score = 0;
    currentQuestionIndex = 0;
    timeleft = 75; // Reset timer
    timeCount.textContent = timeleft;
}

// finalScore function
function finalScore() {
    const modal = document.getElementById('score-modal');
    const finalScoreEl = document.getElementById('final-score');
    const submitBtn = document.getElementById('submit-score');
    const initialsInput = document.getElementById('initials');

    finalScoreEl.textContent = score;
    modal.classList.remove('hide');
    initialsInput.value = ''; // Clear previous input

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
            tempscore: score,
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
    }
];
