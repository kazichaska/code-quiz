// creating all variables here using getElementById
let right = 0;
let state = 0; 
var body = document.body;
var btnQuestion1El = document.getElementById("question-1");
var btnQuestion2El = document.getElementById("question-2");
var btnQuestion3El = document.getElementById("question-3");
var btnQuestion4El = document.getElementById("question-4");
var btnQuestion4El = document.getElementById("question-5");

var btnAnswer1El = document.getElementById("answer-1");
var btnAnswer2El = document.getElementById("answer-2");
var btnAnswer3El = document.getElementById("answer-3");
var btnAnswer4El = document.getElementById("answer-4");

var resultScoreEl = document.getElementById("score");

var timerEl = document.getElementById("countdown");
var scoreEl = document.getElementById("viewscore");
var timeleft = 5;

// body.setAttribute("style", " color:white; background: #666666; padding: 5px; margin-left: 35px;");

// Placeholder where question and answer would go
// btnQuestion1El.textContent = "This is question one";
// btnQuestion2El.textContent = "This is question two";
// btnQuestion3El.textContent = "This is question three";
// btnQuestion4El.textContent = "This is question four";
// btnAnswer1El.textContent = "This is answer one";
// btnAnswer2El.textContent = "This is answer two";
// btnAnswer3El.textContent = "This is answer three";
// btnAnswer4El.textContent = "This is answer four";

// Start button click
var startQuizEl = document.getElementById("startquiz");
startQuizEl.addEventListener("click", function(){
    startGame();
});

function startGame(){
    // resultScoreEl.innerHTML=`View High Scores: ${right}`;
    scoreEl.innerText=`View High Scores: ${right}`;
    countDown();
    if (state === 0) {
        populateQuestion(0);
    }
    if (state === 1) {
        populateQuestion(1);
    }
    if (state === 2) {
        populateQuestion(2);
    }
    if (state === 3) {
        populateQuestion(3);
    }
    if (state === 4) {
        populateQuestion(4);
    }
    // resultScoreEl.innerHTML=`View High Scores: ${right}`;
    scoreEl.innerText=`View High Scores: ${right}`;
}


var secondsLeft = 75;
var questionCount = 0;
let timerInterval;
//Timer starts when the user clicks startQuiz 
function countDown() {
    // buildQuiz();
    let timerInterval = setInterval(function() {
      secondsLeft--;
      timerEl.textContent = "";
      timerEl.textContent = secondsLeft;
      if (secondsLeft < 0 || questionCount === questions.length) {
        console.log(questions.length);
        clearInterval(timerInterval);
        // captureUserScore();
      } 
    }, 1000);
  }

// function quizEnd() {
//     clearInterval(timerInterval);
// }
// countDown();

// Array with the question and answers
const questions = [
    {
        title: "______ JavaScript is also called client-side JavaScript.",
        multiChoice: ["Microsoft", "Navigator", "LiveWire", "Native"],
        answer: "Navigator"
    },
    
    {
        title: "What are variables used for in JavaScript Programs?",
        multiChoice: ["Storing numbers, dates, or other values", "Varying randomly", "Causing high-school algebra flashbacks", "None of the above"],
        answer: "Storing numbers, dates, or other values"
    },
    
    {
        title: "hich of the following is not a valid JavaScript variable name?",
        multiChoice: ["2names", "_first_and_last_names", "FirstAndLast", "None of the above"],
        answer: "2names"
    },
    
    {
        title: "______ tag is an extension to HTML that can enclose any number of JavaScript statements.",
        multiChoice: ["<SCRIPT>", "<BODY>", "<HEAD>", "<TITLE>"],
        answer: "<SCRIPT>"
    },
    
    {
        title: "Inside which HTML element do we put the JavaScript?",
        multiChoice: ["<javascript>", "<scripting>", "<script>", "<js>"],
        answer: "<script>"
    }
    ];
    // return questions;
    // console.log();

function populateQuestion(question) {
    btnQuestion1El.textContent = questions[question].title;
    btnAnswer1El.textContent = questions[question].multiChoice[0];
    btnAnswer2El.textContent = questions[question].multiChoice[1];
    btnAnswer3El.textContent = questions[question].multiChoice[2];
    btnAnswer4El.textContent = questions[question].multiChoice[3];
    // add event listner for each btn answer
    btnAnswer1El.addEventListener('click', function(event){
        event.preventDefault();
        var element = event.target;
        // console.log(event.target);
        if (questions[question].multiChoice[0] === questions[question].answer[1]) {
            // right++;
            right += 10;
            console.log("correct");
            // alert("This is correct");
        } else {
            // right--;
            right -= 10;
            console.log("incorrect");
            // alert("This is incorrect");
        }

            state += 1;
            startGame();
 
        // if (element.matches(".btn")){
        //  var state = element.getAttribute("id");
        //  console.log(state);
        // }
        // // if (state === "answer-1" {
        // //     element.textContent = element.
        // // }
        // else {
        //     element.textContent=";"
        // }
    });

    // compare text content of btn with answer
     
    // if it is correct answer display next question
    
    // if it is the incorrect answer minus time and then display next question
};

// End game
var endGame = function() {
    correctWrongEl.remove();
    stopCountDown()
    resultScoreEl.textContent = 'Final score is ' + timeleft; 
};

// stop countdown
var stopCountDown = function() {
    clearInterval(timerInterval);
    timerEl.textContent = "Time: " + timeleft;
}

// verify answer is correct or wrong
var correctWrongEl = document.createElement(h3);
var answerRes = function() {
    correctWrongEl.id = 'correctWrong';

    if (correctAnswer === true) {
        correctWrongEl.textContent = "correct"
        document.body.appendChild(correctWrongEl);
    } else if (correctAnswer === false) {
        correctWrongEl.textContent = "wrong"
        document.body.appendChild(correctWrongEl);
    }
};