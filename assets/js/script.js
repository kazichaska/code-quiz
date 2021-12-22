// creating all variables here using getElementById
var body = document.body;
var btnQuestion1El = document.getElementById("question-1");
var btnQuestion2El = document.getElementById("question-2");
var btnQuestion3El = document.getElementById("question-3");
var btnQuestion4El = document.getElementById("question-4");
var btnAnswer1El = document.getElementById("answer-1");
var btnAnswer2El = document.getElementById("answer-2");
var btnAnswer3El = document.getElementById("answer-3");
var btnAnswer4El = document.getElementById("answer-4");

var timerEl = document.getElementById("countdown");
var scoreEl = document.getElementById("viewscore");

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
    countDown();
    populateQuestion();
});


var secondsLeft = 76;
var questionCount = 0;
//Timer starts when the user clicks startQuiz 
function countDown() {
    // buildQuiz();
    let timerInterval = setInterval(function() {
      secondsLeft--;
      timerEl.textContent = "";
      timerEl.textContent = secondsLeft;
      if (secondsLeft <= 0 || questionCount === questions.length) {
        clearInterval(timerInterval);
        // captureUserScore();
      } 
    }, 1000);
  }

// countDown();

// function buildQuiz() {
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
// };
// const totalQuestion = questions.length;
// console.log(totalQuestion);

// function startQuiz() {
//     startQuizEl.addEventListener("click", )
//     console.log();
// }

function populateQuestion() {
    btnQuestion1El.textContent = questions[0].title;
    btnAnswer1El.textContent = questions[0].multiChoice[0];
    btnAnswer2El.textContent = questions[0].multiChoice[1];
    btnAnswer3El.textContent = questions[0].multiChoice[2];
    btnAnswer4El.textContent = questions[0].multiChoice[3];
    // add event listner for each btn answer
    btnAnswer1El.addEventListener('click', (e)=>{
        // console.log(e.target.id);
    });
    btnAnswer2El.addEventListener('click', (e)=>{
        // console.log(e.target.id);
    });
    btnAnswer3El.addEventListener('click', (e)=>{
        // console.log(e.target.id);
    });
    btnAnswer4El.addEventListener('click', (e)=>{
        // console.log(e.target.id);
    });

    // compare text content of btn with answer
    // if 
    // if it is correct answer display next question
    // if it is the incorrect answer minus time and then display next question
};

// function viewScore() {
//     var iniScore = 0;
//     var correctAnswer = 0;
    
//     if (correctAnswer) {
//         iniScore += 10;
//         scoreEl.textContent = iniScore;
//     }
//     else {
//         iniScore -= 10;
//         scoreEl.textContent = iniScore;
//     }
//         console.log(iniScore);
// return correctAnswer;
// };

// viewScore();
