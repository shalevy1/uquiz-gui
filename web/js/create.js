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
      this.findParentFromClass(el.parentNode, className);
    }

    return el.parentNode;
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

  editQuestion(qu, index) {
    let content = document.getElementById("contentContainer");
    content.innerHTML = "";

    let editTemplate = `
    <div class="editElement editQuestionText">
        <label for="uname">Question Text</label>
        <input type="text" id="uname" name="uname" required="" minlength="4" maxlength="8" placeholder="4 to 8 characters long">
        <span class="validity"></span>
    </div>
    `;

    content.insertAdjacentHTML("beforeend", editTemplate);

    for (let i = 1; i < 5; i++) {
      let choiceTemplate = `
      <div class="editElement editChoice1" style="">
          <label for="uname">Choice ${i}</label>
          <input type="text" id="uname" name="uname" required="" minlength="4" maxlength="8" placeholder="4 to 8 characters long">
          <span class="validity"></span>
        
          <div class="choiceExtendedOptions">
              <div class="checkboxContainer">
                  <label for="correct1">Correct</label>
              	<input type="checkbox" name="correct${1}" value="Correct">
              </div>
          </div>
      </div>   
      `;

      content.insertAdjacentHTML("beforeend", choiceTemplate);
    }
  }

  fromJSON(json) {
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

    titleSection.addEventListener("click", function(e) {
      if (e.target.classList.contains("quizSection")) {
        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        e.target.className += " currentSection";
      } else {
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

      var self = this;

      questionElement.addEventListener("click", function(e) {
        let questionIndex = parseInt(e.target.id[e.target.id.length - 1]);

        var currentSection = document.querySelector(".currentSection");

        if (currentSection === null) {
          modal.error(
            "Could not find class element currentSection. Please restart the program and try again."
          );
          this.clearSide();
          return;
        }

        currentSection.classList.remove("currentSection");

        e.target.className += " currentSection";

        self.editQuestion(
          window.quizObject.questions[questionIndex],
          questionIndex
        );
      });
    }
  }
}

var create = new Create();
