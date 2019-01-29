window.onbeforeunload = confirmExit;

function confirmExit() {
  if (!window.saved) {
    return "You have unsaved changes to the quiz. Are you sure you want to close the program and lose your progress?";
  }
  return null;
}

function enterClickHandler(el) {
  console.log(el);
}

function addCurrentDate() {}

function sortQuestions(data) {
  let sorted = [];

  let mindex = 0;

  for (let a = 0; a < data.length; a++) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined) {
        mindex = i;
        break;
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i] === undefined) {
        continue;
      }
      if (data[i].sortBy < data[mindex].sortBy) {
        mindex = i;
      }
    }

    let copy = JSON.parse(JSON.stringify(data[mindex]));
    delete copy.sortBy;

    sorted.push(copy);
    delete data[mindex];
  }

  return sorted;
}

function handleShiftedElements(localQuizObject) {
  let sideContainer = document.getElementById("sideContainer");

  if (sideContainer === null) {
    console.error("#sideContainer is null!");
    return;
  }

  for (let i = 1; i < sideContainer.children.length; i++) {
    let questionId = parseInt(sideContainer.children[i].id.match(/\d+/)[0]);

    if (window.quizObject.questions[questionId].marked) {
      continue;
    }

    localQuizObject.questions[questionId].sortBy = i - 1;
  }

  let finalQuizObject = JSON.parse(JSON.stringify(localQuizObject));
  finalQuizObject.questions = [];

  for (let question of localQuizObject.questions) {
    if (!question.hasOwnProperty("marked")) {
      finalQuizObject.questions.push(question);
    }
  }

  console.log(finalQuizObject);

  finalQuizObject.questions = sortQuestions(finalQuizObject.questions);
  downloadQuiz(finalQuizObject);
}

function downloadQuiz(finalQuizObject) {
  var a = window.document.createElement("a");

  a.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(finalQuizObject)], {type: "application/json"})
  );

  a.download = window.quizObject.name + ".json";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.saved = true;
}

function createNewQuiz() {
  window.quizObject = {
    name: "New Quiz",
    author: "",
    date: "",
    questions: [
      {
        text: "New Question",
        choices: [
          {text: "", correct: false},
          {text: "", correct: false},
          {text: "", correct: false},
          {text: "", correct: false}
        ]
      }
    ]
  };

  window.saved = false;

  create.fromJSON(window.quizObject);
}

function saveCreateNewQuiz() {
  let localQuizObject = JSON.parse(JSON.stringify(window.quizObject));

  handleShiftedElements(localQuizObject);
  createNewQuiz();
}

document.addEventListener("DOMContentLoaded", function(event) {
  window.quizFile = "";

  window.quizObject = {
    name: "New Quiz",
    author: "",
    date: "",
    questions: [
      {
        text: "New Question",
        choices: [
          {text: "", correct: false},
          {text: "", correct: false},
          {text: "", correct: false},
          {text: "", correct: false}
        ]
      }
    ]
  };

  window.saved = false;

  create.fromJSON(window.quizObject);

  window.undoStack = [];

  var fileupload = document.getElementById("inputfile");

  fileupload.addEventListener("input", function(e) {
    if (this.files[0].size > 3e6) {
      modal.error("Files must be under 3MB");
      return;
    } else if (
      this.files[0].type !== "application/json" &&
      this.files[0].type !== "text/plain"
    ) {
      modal.error("Not a valid JSON or text file");
      return;
    }

    if (!window.saved) {
      modal.confirmNew(
        "Are you sure you want to create a new quiz? You have unsaved changes to quiz:",
        window.quizObject.name,
        createNewQuiz,
        saveCreateNewQuiz
      );
    }

    var reader = new FileReader();

    reader.onload = function() {
      var text = reader.result;

      window.quizObject = JSON.parse(text);
      console.log(window.quizObject);

      create.fromJSON(window.quizObject);
    };

    reader.readAsText(this.files[0]);
  });

  var openbtn = document.querySelector(".control-open");
  var savebtn = document.querySelector(".control-save");
  var newbtn = document.querySelector(".control-new");

  openbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    fileupload.click();
  });

  savebtn.addEventListener("click", function(e) {
    addCurrentDate();
    let localQuizObject = JSON.parse(JSON.stringify(window.quizObject));
    handleShiftedElements(localQuizObject);
  });

  newbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!window.saved) {
      modal.confirmNew(
        "Are you sure you want to create a new quiz? You have unsaved changes to quiz:",
        window.quizObject.name,
        createNewQuiz,
        saveCreateNewQuiz
      );
    } else {
      createNewQuiz();
    }
  });

  let addQuestion = document.getElementById("addQuestion");

  addQuestion.addEventListener("click", function(e) {
    create.newQuestion();
  });

  let removeQuestion = document.getElementById("removeQuestion");

  removeQuestion.addEventListener("click", function(e) {
    create.removeQuestion();
  });

  let undoQuestion = document.getElementById("undoQuestion");

  undoQuestion.addEventListener("click", function(e) {
    create.undo();
  });

  let upQuestion = document.getElementById("upQuestion");

  upQuestion.addEventListener("click", function(e) {
    create.shiftUp();
  });

  let downQuestion = document.getElementById("downQuestion");

  downQuestion.addEventListener("click", function(e) {
    create.shiftDown();
  });

  let helpButton = document.getElementById("helpAnchor");

  helpButton.addEventListener("click", function(e) {
    window.open("/help.html", "_blank", "toolbar=0,location=0,menubar=0");
  });
});
