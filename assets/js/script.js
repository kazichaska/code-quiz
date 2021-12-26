// creating all variables here using getElementById
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerEl = document.getElementById('question-container')

const questionEl = document.getElementById('question')
const answerBtnEl = document.getElementById('answer-buttons')
// var resultScoreEl = document.getElementById("score");
let shuffledQuestions, currentQuestionIndex;
var timerEl = document.getElementById("countdown");
// var scoreEl = document.getElementById("viewscore");
let timeLeft = 75;
let secondLeft;
var score;

// const heading = document.createElement("h1");
// const heading_text = document.createTextNode("Code Quiz Challenge!");
// heading.appendChild(heading_text);
// document.head.appendChild(heading);

// const heading_timer = document.createElement("button");
// const heading_timer_text = document.createTextNode("Time:");
// heading.appendChild(heading_timer);
// document.head.appendChild(heading_timer_text);


// Start button click
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    NextQuestion()
})

function startGame() {
    console.log('Game Started!')
    // startTimer()
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerEl.classList.remove('hide')
    NextQuestion()
}

// // start timer function
// function startTimer() {
//     interval = setInterval(countDown, 1000)
// }

// // countdown function
// function countDown() {
//     if (timeLeft <= 0) return renderResult()
//     timeLeft--
//     document.getElementById("timerEl").innerText = `Time remaining: ${timeLeft}`
// }

// // stop timer function
// function stopTimer() {
//     clearInterval(interval)
// }

function NextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionEl.innerHTML = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', pickAnswer)
        answerBtnEl.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerBtnEl.firstChild) {
        answerBtnEl.removeChild(answerBtnEl.firstChild)
    }
}

function pickAnswer(e) {
    const buttonSelected = e.target
    const correct = buttonSelected.dataset.correct
    statusClass(document.body, correct)
    Array.from(answerBtnEl.children).forEach(button => {
        statusClass(button, button.dataset.correct)
    })
    if (shuffledQuestions.length > currentQuestionIndex +1) {
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'Start Over'
        startButton.classList.remove('hide')
    }
}

function statusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
    // scoreTotal()
}

function scoreTotal() {
    if (scoreTemp = (document.body.innerText = "correct")) {
        score += 10;
    } else {
        score -= 10;
    }
    console.log(score);
    return score;
    // console.log(score)
    // return score;
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
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


