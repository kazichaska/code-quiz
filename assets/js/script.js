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
highScoresEl.style.visibility = 'hidden';

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
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex == (questions.length -1)) {
        console.log(questions.length);
        endGame();
    } else {
        myButtonCounter++;
        currentQuestionIndex++;
        console.log(myButtonCounter);
        console.log(currentQuestionIndex);
        nextQuestion();
    }
})

// startGame function
function startGame() {
    console.log('Game Started!');
    startTimer();
    startButton.style.visibility = 'hidded';
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerEl.classList.remove('hide');
    highScoresEl.textContent = " ";
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
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
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
    if (myButtonCounter > 0) {
        myButtonCounter = 0;
        // return false;
    } 
    // myButtonCounter++
    const buttonSelected = e.target;
    console.log(e.target);
    const correct = buttonSelected.dataset.correct;
    statusClass(document.body, correct);
    Array.from(answerBtnEl.children).forEach(button => {
        statusClass(button, button.dataset.correct);
    })
    if (shuffledQuestions.length > currentQuestionIndex +1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Start Over';
        startButton.classList.remove('hide');
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
    if (correct) {
        score += 10;
    } else {
        score -= 10;
    }

    if (!correct) {
        timeleft = timeleft - timeDeduct;
        timeCount.textContext = timeleft;
    }
    console.log(score)
    resultScoreEl.textContent = 'View Score ' + score;
}

// clearStatusClass function
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// highScores function
function highScores(myScore) {

    var highScore = myScore;
    console.log(myScore);
    // console.log(myScore[i].tempscore);
    for (i = 0; i < myScore.length; i ++) {
        if (highScore.tempscore >= myScore[i].tempscore) {
            highScoresEl.textContent = "High Score so far is : " + highScore.tempscore + " your initials : " + myScore[i].initials;
            console.log(myScore[i].initials);
        }
        else {
            highScore.tempscore = myScore[i].tempscore;
            highScoresEl.textContent = "High Score so far is : " + highScore.tempscore + "  your initials : " + myScore[i].initials;
        // console.log(newHighScore);
        } 
    }
}

// endGame function
function endGame() {
    
    clearInterval(timerContain);
    resetState();
    startButton.classList.remove('hide');
    highScoresEl.style.visibility = 'visible';
    finalScore();
    score = 0;
    currentQuestionIndex = 0;
    questionEl.remove();
}

// finalScore function
function finalScore() {
        const initials = prompt("Enter initials")    
        var user = {
            initials: initials,
            tempscore: score
        }; 
        // console.log(user.initials, user.tempscore)
        if (myScore === null) {
            myScore = [];
        }
        myScore.push(user)
        localStorage.setItem("user", JSON.stringify(myScore));
        
        JSON.parse(localStorage.getItem('user', myScore));
        highScores(myScore);
}

// Array with the question and answers
const questions = [
    {
        question: "______ JavaScript is also called client-side JavaScript.",
        answers: [
            { text: 'Microsoft', correct: false },
            { text: 'Navigator', correct: true },
            { text: 'LiveWire', correct: false },
            { text: 'Native', correct: false },
        ]
    },
    {
        question: "What are variables used for in JavaScript Programs?",
        answers: [
            { text: 'Storing numbers dates, or other values', correct: true },
            { text: 'Varying randomly', correct: false },
            { text: 'Causing high-school algebra flashbacks', correct: false },
            { text: 'None of the above', correct: false },
        ]
    },    
    {
        question: "Which of the following is not a valid JavaScript variable name?",
        answers: [
            { text: '2names', correct: true },
            { text: '_first_and_last_names', correct: false },
            { text: 'FirstAndLast', correct: false },
            { text: 'None of the above', correct: false },
        ]
    },
    {
        question: "______ tag is an extension to HTML that can enclose any number of JavaScript statements.",
        answers: [
            { text: '<SCRIPT>', correct: true },
            { text: '<BODY>', correct: false },
            { text: '<HEAD>', correct: false },
            { text: '<TITLE>', correct: false },
        ]
    }, 
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            { text: '<javascript>', correct: false },
            { text: '<scripting>', correct: false },
            { text: '<script>', correct: true },
            { text: '<js>', correct: false },
        ]
    }
]
