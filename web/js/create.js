/*
  Contains most functions for making changes to the quizObject and HTML of the
  editor
 */
class Create {
  constructor() {}

  /*
    [Makes use of recursion]
    This function takes in a DOM element and a class name of the parent element
    to be found. It calls itself by passing in the DOM element's parentNode
    and checking whether the element contains the given className. If it does
    not, the function calls itself again until the element is found or if
    the parent element does not exist (reaches top-level <html> tag).
   */
  findParentFromClass(el, className) {
    /* Return null if no parent element could be found */
    if (el.parentNode === null || el.parentNode === undefined) {
      return null;
    }

    /* If the parent node exists but does not contain the className (or has
       no HTML classes at all), make the function call itself with it's parent
       node as the reference. */
    if (
      el.parentNode.classList === undefined ||
      !el.parentNode.classList.contains(className)
    ) {
      return this.findParentFromClass(el.parentNode, className);
      /* If the className inside of the classList could be found, return
         the element */
    } else {
      return el.parentNode;
    }
  }

  /*
    Clears the sideContainer of all elements
   */
  clearSide() {
    let sideContainer = document.getElementById("sideContainer");

    /* Handle case if sideContainer could not be found */
    if (sideContainer === null) {
      console.error("Cannot clear side as #sideContainer cannot be located!");
      return;
    }

    /* Set the inner HTML to empty */
    sideContainer.innerHTML = "";
  }

  /*
    Gets the currently selected section and swaps it with the previous, moving
    it up by 1
   */
  shiftUp() {
    let currentSection = document.querySelector(".currentSection");

    if (currentSection === null) {
      console.error("Cannot shift question, .currentSection cannot be found.");
      return;
    }

    let sideContainer = document.getElementById("sideContainer");

    let index = 0;

    for (let section of sideContainer.children) {
      if (section.id === currentSection.id) {
        break;
      }
      index++;
    }

    if (currentSection.id !== sideContainer.children[index].id) {
      console.error(
        "Could not find currentSection element in sideContainer children!"
      );
      return;
    }

    /* Make sure it doesn't swap places with the titleSection */
    if (index <= 1) {
      return;
    }

    sideContainer.insertBefore(
      currentSection,
      sideContainer.children[index - 1]
    );
  }

  /*
    Gets the currently selected section and swaps it with the next, moving
    it down by 1
  */
  shiftDown() {
    let currentSection = document.querySelector(".currentSection");

    if (currentSection === null) {
      console.error("Cannot shift question, .currentSection cannot be found.");
      return;
    }

    if (currentSection.classList.contains("titleSection")) {
      return;
    }

    let sideContainer = document.getElementById("sideContainer");

    let index = 0;

    for (let section of sideContainer.children) {
      if (section.id === currentSection.id) {
        break;
      }
      index++;
    }

    if (currentSection.id !== sideContainer.children[index].id) {
      console.error(
        "Could not find currentSection element in sideContainer children!"
      );
      return;
    }

    if (index >= sideContainer.children.length - 1) {
      return;
    }

    sideContainer.insertBefore(
      currentSection,
      sideContainer.children[index + 2]
    );
  }

  undo() {
    let questionId = window.undoStack.pop();

    if (questionId === undefined) {
      let undoQuestion = document.getElementById("undoQuestion");
      undoQuestion.style.display = "none";
      return;
    }

    delete window.quizObject.questions[questionId].marked;

    let questionSection = document.getElementById("qu" + questionId);

    console.log(questionSection);

    if (!questionSection) {
      console.error("Could not find element " + questionId + " to undo!");
      return;
    }

    questionSection.style.display = "flex";

    let currentSection = document.querySelector(".currentSection");
    currentSection.classList.remove("currentSection");

    questionSection.classList += " currentSection";

    this.editQuestion(window.quizObject.questions[questionId], questionId);

    if (window.undoStack.length === 0) {
      let undoQuestion = document.getElementById("undoQuestion");
      undoQuestion.style.display = "none";
    }
  }

  removeQuestionCallback(self, questionId) {
    let currentSection = document.querySelector(".currentSection");

    if (currentSection.classList.contains("titleSection")) {
      return;
    }

    currentSection.style.display = "none";
    currentSection.classList.remove("currentSection");

    let titleSection = document.querySelector(".titleSection");
    titleSection.className += " currentSection";

    window.quizObject.questions[questionId].marked = true;
    window.undoStack.push(questionId);

    self.editQuiz();

    let undoQuestion = document.getElementById("undoQuestion");

    undoQuestion.style.display = "flex";
  }

  removeQuestion() {
    let currentSection = document.querySelector(".currentSection");

    if (currentSection.classList.contains("titleSection")) {
      return;
    }

    let questionId = parseInt(currentSection.id.match(/\d+/)[0]);

    modal.confirmDelete(
      "Are you sure you want to delete question:",
      questionId,
      this.removeQuestionCallback,
      this
    );
  }

  newQuestion() {
    var self = this;

    let questionElements = document.querySelectorAll(".questionSection");
    let questionNo = 0;

    for (let el of questionElements) {
      let elementId = parseInt(el.id.match(/\d+/)[0]);

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
                            New Question
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

      let questionIndex = parseInt(quizSection.id.match(/\d+/)[0]);

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
        <span id="quizNameLimit" class="charLimit">0/28</span>
    </div>

    <div class="editElement editQuestionText">
        <label for="uname">Author</label>
        <input type="text" id="author" name="author" required="" minlength="1" maxlength="28" placeholder="1 to 28 characters long">
        <span id="authorLimit" class="charLimit">0/28</span>
    </div>
    `;

    content.insertAdjacentHTML("beforeend", editTemplate);

    let quizName = document.getElementById("qname");
    quizName.value = window.quizObject.name;

    let quizNameLimit = document.getElementById("quizNameLimit");
    quizNameLimit.innerHTML = quizName.value.length + "/28";

    quizName.addEventListener("input", function(e) {
      window.saved = false;

      window.quizObject.name = e.target.value;

      let quizTitle = document.querySelector(".quizTitle");

      if (quizTitle === null) {
        console.error("Cannot locate quizTitle when updating quiz name!");
        return;
      }

      quizTitle.innerHTML = e.target.value;

      let quizNameLimit = document.getElementById("quizNameLimit");
      quizNameLimit.innerHTML = e.target.value.length + "/28";
    });

    let author = document.getElementById("author");
    author.value = window.quizObject.author;

    let authorLimit = document.getElementById("authorLimit");
    authorLimit.innerHTML = author.value.length + "/28";

    author.addEventListener("input", function(e) {
      window.saved = false;
      window.quizObject.author = e.target.value;

      let authorLimit = document.getElementById("authorLimit");
      authorLimit.innerHTML = e.target.value.length + "/28";
    });
  }

  editQuestion(qu, index) {
    var self = this;

    let content = document.getElementById("contentContainer");
    content.innerHTML = "";

    let editTemplate = `
    <div class="editElement editQuestionText">
        <label for="uname">Question Text</label>
        <input type="text" id="qtext" name="qtext" required="" minlength="1" maxlength="56" placeholder="1 to 56 characters long">
        <span id="questionTextLimit" class="charLimit">0/56</span>
    </div>
    `;

    content.insertAdjacentHTML("beforeend", editTemplate);

    let questionText = document.getElementById("qtext");
    questionText.value = qu.text;

    let questionTextLimit = document.getElementById("questionTextLimit");
    questionTextLimit.innerHTML = questionText.value.length + "/56";

    questionText.addEventListener("input", function(e) {
      window.saved = false;

      let questionId = parseInt(
        document.querySelector(".currentSection").id.match(/\d+/)[0]
      );

      let currentQuestionName = document.querySelector(
        ".currentSection .questionName"
      );

      if (currentQuestionName === null) {
        console.error("Failed to update current section text!");
        return;
      }

      /* If the input is not empty, set the currentSection text to the trucated
         input value, else set it to "New Question" */
      if (e.target.value) {
        currentQuestionName.innerHTML = self.truncate(e.target.value);
      } else {
        currentQuestionName.innerHTML = "New Question";
      }

      window.quizObject.questions[questionId].text = e.target.value;

      let questionTextLimit = document.getElementById("questionTextLimit");
      questionTextLimit.innerHTML = e.target.value.length + "/56";
    });

    for (let i = 1; i < 5; i++) {
      let choiceTemplate = `
      <div class="editElement editChoice1" style="">
          <label for="uname">Choice ${i}</label>
          <input type="text" id="choice${i}" name="choice${i}" required="" minlength="1" maxlength="28" placeholder="1 to 28 characters long">
          <span id="choice${i}Limit" class="charLimit"></span>
        
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

      let choiceLimit = document.getElementById("choice" + i + "Limit");
      choiceLimit.innerHTML = choice.value.length + "/28";

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
        window.saved = false;

        if (e.target.id.indexOf("correct") === -1) {
          modal.error(
            "Could not update from correct element. Please restart the program and try again"
          );
          return;
        }

        let choiceId = parseInt(e.target.id.match(/\d+/)[0]) - 1;

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
        window.saved = false;

        if (e.target.id.indexOf("choice") === -1) {
          modal.error(
            "Could not update from choice element. Please restart the program and try again"
          );
          return;
        }

        let choiceId = parseInt(e.target.id.match(/\d+/)[0]) - 1;

        if (choiceId === NaN) {
          console.error("Choice ID is NaN!");
          return;
        }

        let questionId = parseInt(
          document.querySelector(".currentSection").id.match(/\d+/)[0]
        );

        window.quizObject.questions[questionId].choices[choiceId].text =
          e.target.value;

        let choiceLimit = document.getElementById(
          "choice" + (choiceId + 1) + "Limit"
        );
        choiceLimit.innerHTML = e.target.value.length + "/28";
      });
    }
  }

  /*
    Takes in a string and appends an ellipse Unicode character if the length is
    greater than 46, allowing the text to fit inside of a .quizSection
   */
  truncate(text) {
    if (text.length <= 46) {
      return text;
    }
    return text.substring(0, 45) + "…";
  }

  /*
    Takes in a JavaScript object variable (global window.quizObject) and
    generates the appropriate HTML and JavaScript events for the sideContainer
    and all child sections
   */
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

    /* Handle case if sideContainer is not found */
    if (sideContainer === null) {
      modal.error(
        "Could not find ID element sideContainer. Please restart the program and try again."
      );
      this.clearSide();
      return;
    }

    /* Create titleSection HTML element */
    sideContainer.insertAdjacentHTML("beforeend", titleTemplate);

    let titleSection = document.querySelector(".titleSection");

    /* Handle case if titleSection is not found */
    if (titleSection === null) {
      modal.error(
        "Could not find class element titleSection. Please restart the program and try again."
      );
      this.clearSide();
      return;
    }

    /* `self` is used to reference the Create class from inside of the event
       function, as the keyword `this` would refer to the function and not
       the class */
    var self = this;

    /* When titleSection clicked... */
    titleSection.addEventListener("click", function(e) {
      self.editQuiz();

      /* Check if user clicked on .quizSection element, or a child element of
        .quizSection */
      if (e.target.classList.contains("quizSection")) {
        /* Add currentSection class to current element and remove class
           existing element */
        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        e.target.className += " currentSection";
      } else {
        /* Find parent class matching .quizSection */
        let quizSection = self.findParentFromClass(e.target, "quizSection");

        /* Handle case when parent element is not found */
        if (quizSection === null) {
          modal.error(
            "Failed to update edit section. Please restart the program and try again."
          );
          return;
        }

        /* Add currentSection class to current element and remove class
           existing element */
        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        quizSection.className += " currentSection";
      }
    });

    /* Iterate over each question in provided JSON data */
    for (let question in json.questions) {
      let questionNo = parseInt(question) + 1;
      let id = "qu" + question;

      /* Create inline template using truncated version of the question text if
         applicable */
      let questionTemplate = `<div class="quizSection questionSection" id="${id}">

                              <div class="indicatorContainer">
                              <img class="quizIndicator" src="/icon/chevron-right.svg" alt="selector"/>
                              </div>

                              <div class="questionName">
                              ${self.truncate(
                                window.quizObject.questions[question].text
                              )}
                              </div>

                              </div>`;

      /* Append template to sideContainer */
      sideContainer.insertAdjacentHTML("beforeend", questionTemplate);

      let questionElement = document.getElementById(id);

      /* Handle case if question element is not found */
      if (questionElement === null) {
        modal.error(
          "Could not find current questionElement ID. Please restart the program and try again."
        );
        this.clearSide();
        return;
      }

      /* When question element is clicked... */
      questionElement.addEventListener("click", function(e) {
        let quizSection = e.target;

        /* Handle case if user clicks on child elemnt of .quizSection */
        if (!e.target.classList.contains("quizSection")) {
          /* Find parent .quizSection */
          quizSection = self.findParentFromClass(e.target, "quizSection");

          /* Handle case if quizSection is not found */
          if (quizSection === null) {
            modal.error(
              "Failed to update edit section. Please restart the program and try again."
            );
            return;
          }
        }

        /* Get questionIndex from ID */
        let questionIndex = parseInt(quizSection.id.match(/\d+/)[0]);

        var currentSection = document.querySelector(".currentSection");

        /* Handle case if currentSection is not found */
        if (currentSection === null) {
          modal.error(
            "Could not find class element currentSection. Please restart the program and try again."
          );
          this.clearSide();
          return;
        }

        /* Add currentSection to clicked element and remove it from the
           previous */
        currentSection.classList.remove("currentSection");

        quizSection.className += " currentSection";

        /* Call editQuestion, passing the current question data and index */
        self.editQuestion(
          window.quizObject.questions[questionIndex],
          questionIndex
        );
      });

      /* After loading quiz, set the editor to edit the quiz metadata */
      self.editQuiz();
    }
  }
}

/* Create global create object from create class */
var create = new Create();
