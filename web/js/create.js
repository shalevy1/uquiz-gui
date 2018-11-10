class Create {
  constructor() {}

  /* Makes use of recursion */
  findParentFromClass(el, className) {
    if (el.parentNode === null || el.parentNode === undefined) {
      return null;
    }

    if (
      el.parentNode.classList === undefined ||
      !el.parentNode.classList.contains(className)
    ) {
      return this.findParentFromClass(el.parentNode, className);
    } else {
      return el.parentNode;
    }
  }

  /* Clears the side container of all elements */
  clearSide() {
    let sideContainer = document.getElementById("sideContainer");

    if (sideContainer === null) {
      console.error("Cannot clear side as #sideContainer cannot be located!");
      return;
    }

    sideContainer.innerHTML = "";
  }

  newQuestion() {
    var self = this;

    let questionElements = document.querySelectorAll(".questionSection");
    let questionNo = 0;

    for (let el of questionElements) {
      let elementId = parseInt(el.id[2]);

      if (elementId === NaN) {
        continue;
      }

      if (elementId > questionNo) {
        questionNo = elementId;
      }
    }

    questionNo += 2;

    let blankQuestion = {
      text: "",
      choices: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false}
      ]
    };

    window.quizObject.questions.push(blankQuestion);

    let id = "qu" + (questionNo - 1);

    let questionTemplate = `<div class="quizSection questionSection" id="${id}">

                            <div class="indicatorContainer">
                            <img class="quizIndicator" src="/icon/chevron-right.svg" alt="selector"/>
                            </div>

                            <div class="questionName">
                            Question ${questionNo}
                            </div>

                            </div>`;

    sideContainer.insertAdjacentHTML("beforeend", questionTemplate);

    let questionElement = document.getElementById(id);

    if (questionElement === null) {
      modal.error(
        "Could not find current questionElement ID. Please restart the program and try again."
      );
      this.clearSide();
      return;
    }

    questionElement.addEventListener("click", function(e) {
      let quizSection = e.target;

      if (!e.target.classList.contains("quizSection")) {
        quizSection = self.findParentFromClass(e.target, "quizSection");

        if (quizSection === null) {
          modal.error(
            "Failed to update edit section. Please restart the program and try again."
          );
          return;
        }
      }

      let questionIndex = parseInt(quizSection.id[quizSection.id.length - 1]);

      var currentSection = document.querySelector(".currentSection");

      if (currentSection === null) {
        modal.error(
          "Could not find class element currentSection. Please restart the program and try again."
        );
        this.clearSide();
        return;
      }

      currentSection.classList.remove("currentSection");

      quizSection.className += " currentSection";

      self.editQuestion(
        window.quizObject.questions[questionIndex],
        questionIndex
      );
    });
  }

  editQuiz() {
    let content = document.getElementById("contentContainer");
    content.innerHTML = "";

    let editTemplate = `
    <div class="editElement editQuestionText">
        <label for="uname">Quiz Name</label>
        <input type="text" id="qname" name="qname" required="" minlength="1" maxlength="28" placeholder="1 to 28 characters long">
        <span class="validity"></span>
    </div>

    <div class="editElement editQuestionText">
        <label for="uname">Author</label>
        <input type="text" id="author" name="author" required="" minlength="1" maxlength="28" placeholder="1 to 28 characters long">
        <span class="validity"></span>
    </div>
    `;

    content.insertAdjacentHTML("beforeend", editTemplate);

    let quizName = document.getElementById("qname");
    quizName.value = window.quizObject.name;

    quizName.addEventListener("input", function(e) {
      window.quizObject.name = e.target.value;

      let quizTitle = document.querySelector(".quizTitle");

      if (quizTitle === null) {
        console.error("Cannot locate quizTitle when updating quiz name!");
        return;
      }

      quizTitle.innerHTML = e.target.value;
    });

    let author = document.getElementById("author");
    author.value = window.quizObject.author;

    author.addEventListener("input", function(e) {
      window.quizObject.author = e.target.value;
    });
  }

  editQuestion(qu, index) {
    let content = document.getElementById("contentContainer");
    content.innerHTML = "";

    let editTemplate = `
    <div class="editElement editQuestionText">
        <label for="uname">Question Text</label>
        <input type="text" id="qtext" name="qtext" required="" minlength="1" maxlength="56" placeholder="1 to 56 characters long">
        <span class="validity"></span>
    </div>
    `;

    content.insertAdjacentHTML("beforeend", editTemplate);

    let questionText = document.getElementById("qtext");
    questionText.value = qu.text;

    questionText.addEventListener("input", function(e) {
      let questionId = parseInt(
        document.querySelector(".currentSection").id[2]
      );

      window.quizObject.questions[questionId].text = e.target.value;
    });

    for (let i = 1; i < 5; i++) {
      let choiceTemplate = `
      <div class="editElement editChoice1" style="">
          <label for="uname">Choice ${i}</label>
          <input type="text" id="choice${i}" name="choice${i}" required="" minlength="1" maxlength="28" placeholder="1 to 28 characters long">
          <span class="validity"></span>
        
          <div class="choiceExtendedOptions">
              <div class="checkboxContainer">
                  <label for="correct1">Correct</label>
              	  <input type="checkbox" name="correct${i}" id="correct${i}" value="Correct">
              </div>
          </div>
      </div>   
      `;

      content.insertAdjacentHTML("beforeend", choiceTemplate);

      let choice = document.getElementById("choice" + i);

      if (choice === null) {
        modal.error(
          "Could not find ID element choice" +
            i +
            ". Please restart the program and try again."
        );
        return;
      }

      choice.value = qu.choices[i - 1].text;

      let correct = document.getElementById("correct" + i);

      if (correct === null) {
        modal.error(
          "Could not find ID element correct" +
            i +
            ". Please restart the program and try again."
        );
        return;
      }

      correct.checked = qu.choices[i - 1].correct;

      correct.addEventListener("change", function(e) {
        if (e.target.id.indexOf("correct") === -1) {
          modal.error(
            "Could not update from correct element. Please restart the program and try again"
          );
          return;
        }

        let choiceId = parseInt(e.target.id[7]) - 1;

        if (choiceId === NaN) {
          console.error("Choice ID is NaN!");
          return;
        }

        let questionId = parseInt(
          document.querySelector(".currentSection").id[2]
        );

        window.quizObject.questions[questionId].choices[choiceId].correct =
          e.target.checked;
      });

      choice.addEventListener("input", function(e) {
        if (e.target.id.indexOf("choice") === -1) {
          modal.error(
            "Could not update from choice element. Please restart the program and try again"
          );
          return;
        }

        let choiceId = parseInt(e.target.id[6]) - 1;

        if (choiceId === NaN) {
          console.error("Choice ID is NaN!");
          return;
        }

        let questionId = parseInt(
          document.querySelector(".currentSection").id[2]
        );

        window.quizObject.questions[questionId].choices[choiceId].text =
          e.target.value;
      });
    }
  }

  fromJSON(json) {
    this.clearSide();

    let title = "";

    if (!json.name) {
      title = "New Quiz";
    } else {
      title = json.name;
    }

    let titleTemplate = `<div class="quizSection currentSection titleSection">

                         <div class="indicatorContainer">
                         <img class="quizIndicator" src="/icon/chevron-right.svg" alt="selector"/>
                         </div>

                         <div class="quizTitle">
                         ${title}
                         </div>


                         </div>`;

    let sideContainer = document.getElementById("sideContainer");

    if (sideContainer === null) {
      modal.error(
        "Could not find ID element sideContainer. Please restart the program and try again."
      );
      this.clearSide();
      return;
    }

    sideContainer.insertAdjacentHTML("beforeend", titleTemplate);

    let titleSection = document.querySelector(".titleSection");

    if (titleSection === null) {
      modal.error(
        "Could not find class element titleSection. Please restart the program and try again."
      );
      this.clearSide();
      return;
    }

    var self = this;

    titleSection.addEventListener("click", function(e) {
      self.editQuiz();

      if (e.target.classList.contains("quizSection")) {
        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        e.target.className += " currentSection";
      } else {
        let quizSection = self.findParentFromClass(e.target, "quizSection");

        if (quizSection === null) {
          modal.error(
            "Failed to update edit section. Please restart the program and try again."
          );
          return;
        }

        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        quizSection.className += " currentSection";
      }
    });

    for (let question in json.questions) {
      let questionNo = parseInt(question) + 1;
      let id = "qu" + question;

      let questionTemplate = `<div class="quizSection questionSection" id="${id}">

                              <div class="indicatorContainer">
                              <img class="quizIndicator" src="/icon/chevron-right.svg" alt="selector"/>
                              </div>

                              <div class="questionName">
                              Question ${questionNo}
                              </div>

                              </div>`;

      sideContainer.insertAdjacentHTML("beforeend", questionTemplate);

      let questionElement = document.getElementById(id);

      if (questionElement === null) {
        modal.error(
          "Could not find current questionElement ID. Please restart the program and try again."
        );
        this.clearSide();
        return;
      }

      questionElement.addEventListener("click", function(e) {
        let quizSection = e.target;

        if (!e.target.classList.contains("quizSection")) {
          quizSection = self.findParentFromClass(e.target, "quizSection");

          if (quizSection === null) {
            modal.error(
              "Failed to update edit section. Please restart the program and try again."
            );
            return;
          }
        }

        let questionIndex = parseInt(quizSection.id[quizSection.id.length - 1]);

        var currentSection = document.querySelector(".currentSection");

        if (currentSection === null) {
          modal.error(
            "Could not find class element currentSection. Please restart the program and try again."
          );
          this.clearSide();
          return;
        }

        currentSection.classList.remove("currentSection");

        quizSection.className += " currentSection";

        self.editQuestion(
          window.quizObject.questions[questionIndex],
          questionIndex
        );
      });

      self.editQuiz();
    }
  }
}

var create = new Create();
