// ========================
// Quiz Application:
// ========================

// General Element:
// ----------------
let lang = document.querySelector(".quiz_header h2");
let question_area = document.querySelector(".question_area .question");
let main_area = document.querySelector(".question_area");
let choices_container = document.querySelector(".choices_container");
let myBtn = document.querySelector(".btn");
let totalNumber = document.querySelector(".total-Number");
let CompleteQuestionsNumber = document.querySelector(".complete_Question");
let bulletsContainer = document.querySelector(".bullets");
let resultContainer = document.querySelector(".result");
let desResult = document.querySelector(".result .des");
let TimerContainer = document.querySelector(".timer");
let currentQuestion = 0;
let rightAnswer = 0;
let intervalTimer;
let duration = 17;

// Get The Question And The Choices From json File:
// -----------------------------------------------

let myRequist = new XMLHttpRequest();
myRequist.open("GET", "./json/html.json", true);
myRequist.send();

myRequist.onreadystatechange = () => {
  if (myRequist.readyState === 4 && myRequist.status === 200) {
    let questionInfo = JSON.parse(myRequist.responseText).questions;

    let numberOfQuestion = JSON.parse(myRequist.responseText).questions.length;

    lang.innerHTML = JSON.parse(myRequist.responseText).quiz_title;

    SetQuestion(questionInfo[currentQuestion], numberOfQuestion);

    GetTheTotalNumber(numberOfQuestion);

    createBullets(numberOfQuestion);

    CheckBullets();

    NumberOfCompleteQuestions(currentQuestion + 1);

    CountdownTimer(duration, numberOfQuestion);

    myBtn.addEventListener("click", () => {
      if (currentQuestion < questionInfo.length) {
        checkTheRightAnswer(
          questionInfo[currentQuestion].correct_answer,
          numberOfQuestion,
        );
      } else {
        return false;
      }

      currentQuestion++;

      if (currentQuestion < questionInfo.length) {
        CheckBullets();
      }

      question_area.innerHTML = "";

      choices_container.innerHTML = "";

      SetQuestion(questionInfo[currentQuestion], numberOfQuestion);

      clearInterval(intervalTimer);
      CountdownTimer(duration, numberOfQuestion);

      if (currentQuestion === questionInfo.length) {
        resultContainer.style.display = "block";
        showResult(numberOfQuestion);
      }
    });
  }
};

// Get The Total Number Of Questions:
// ---------------------------------
function GetTheTotalNumber(NumberOfQuestions) {
  totalNumber.textContent = NumberOfQuestions;
}

// Get The Complete Number Of Questions:
// -------------------------------------
function NumberOfCompleteQuestions(NumberOfCompleteQuestions) {
  CompleteQuestionsNumber.textContent = NumberOfCompleteQuestions;
}

// create Question with Choices:
// -----------------------------

function SetQuestion(obj, len) {
  if (currentQuestion < len) {
    NumberOfCompleteQuestions(currentQuestion + 1);

    let currentQuestionContainer = document.createElement("div");
    currentQuestionContainer.innerHTML = obj.question;

    question_area.appendChild(currentQuestionContainer);

    for (let i = 0; i < Object.keys(obj.choices).length; i++) {
      let choice = document.createElement("div");
      choice.classList = "choice";

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.dataset.key = Object.keys(obj.choices)[i];
      radioInput.id = `choice_${i + 1}`;
      radioInput.name = `choice`;

      choice.appendChild(radioInput);

      let choiceText = document.createElement("label");
      choiceText.textContent = Object.values(obj.choices)[i];
      choiceText.htmlFor = `choice_${i + 1}`;

      choice.appendChild(choiceText);
      choices_container.appendChild(choice);
    }
  }
}

// create Bullets:
// ---------------

function createBullets(len) {
  for (let i = 0; i < len; i++) {
    let bullet = document.createElement("span");

    bullet.dataset.index = i + 1;

    bulletsContainer.appendChild(bullet);
  }
}

// check The Right Answer:
// ----------------------

function checkTheRightAnswer(rAnswer, totalNumber) {
  let answers = document.getElementsByName("choice");

  if (currentQuestion < totalNumber) {
    answers.forEach((answer) => {
      if (answer.checked) {
        if (answer.dataset.key === rAnswer) {
          rightAnswer++;
        }
      }
    });
  } else {
    return false;
  }
}

function showResult(numberOfQuestion) {
  main_area.remove();

  let result = document.createElement("div");
  result.className = "resultContainer";

  let rightAnswerNumer = document.createElement("p");
  rightAnswerNumer.innerHTML = `The Right Answers: ${rightAnswer} `;
  rightAnswerNumer.style.margin = "10px 0";

  result.appendChild(rightAnswerNumer);

  let perc = document.createElement("p");
  let percentage = ((parseInt(rightAnswer) / numberOfQuestion) * 100).toFixed(
    1,
  );
  perc.innerHTML = `Your Result: ${percentage}%`;
  result.appendChild(perc);

  resultContainer.appendChild(result);

  if (percentage < 50) {
    desResult.innerHTML = `Sorry, Bad Score:`;
  } else if (percentage >= 50 && percentage < 75) {
    desResult.innerHTML = `Good:`;
  } else if (percentage >= 75 && percentage < 85) {
    desResult.innerHTML = `Very Good:`;
  } else if (percentage >= 85) {
    desResult.innerHTML = `Perfect:`;
  }
}

// Create Bullets aAcording to The Number Of Question:
// ----------------------------------------------------

function CheckBullets() {
  let bulletsList = document.querySelectorAll(".info .bullets span");

  bulletsList[currentQuestion].classList.add("done");

  myBtn.addEventListener("click", () => {
    bulletsList.forEach((bullet) => {
      if (parseInt(bullet.dataset.index) === currentQuestion) {
        bullet.classList.add("done");
      }
    });
  });
}

// Create Countdown Timer:
// -----------------------

function CountdownTimer(duration, numberOfQuestion) {
  if (currentQuestion < numberOfQuestion) {
    let minutes, seconds;

    intervalTimer = setInterval(() => {
      // --duration;

      minutes = parseInt(duration / 60);

      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;

      seconds = seconds < 10 ? `0${seconds}` : seconds;

      TimerContainer.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(intervalTimer);
        myBtn.click();
      }
    }, 1000);
  }
}
