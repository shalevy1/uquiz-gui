function enterClickHandler(el) {
  console.log(el);
}

function sortQuestions(localQuizObject) {
  //   currindex = 0
  let currIndex = 0;
  //   for a in range(0, 6):
  for (let i = 0; i < 6; i++) {}
  //   mindex = currindex
  //   for i in range(currindex + 1, 6):
  //   if test[i] < test[mindex]:
  //   mindex = i
  //   tmp = test[mindex]
  //   test[mindex] = test[currindex]
  //   test[currindex] = tmp
  //   print(test)
  //   currindex += 1
  //   sort(test)
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

  console.log(localQuizObject);
}

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  window.quizFile = "";

  window.quizObject = {
    name: "",
    author: "",
    date: "",
    questions: []
  };

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
  var uploadbtn = document.querySelector(".control-upload");

  openbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    fileupload.click();
  });

  savebtn.addEventListener("click", function(e) {
    var a = window.document.createElement("a");

    let localQuizObject = JSON.parse(JSON.stringify(window.quizObject));
    localQuizObject.questions = [];

    for (let question of window.quizObject.questions) {
      if (!question.hasOwnProperty("marked")) {
        localQuizObject.questions.push(question);
      }
    }

    handleShiftedElements(localQuizObject);

    a.href = window.URL.createObjectURL(
      new Blob([JSON.stringify(localQuizObject)], {type: "application/json"})
    );

    a.download = window.quizObject.name + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  newbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    alert("new!");
  });

  uploadbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    alert("upload!");
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
});
