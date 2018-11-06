class Create {
  constructor() {}

  /* Clears the side container of all elements */
  clear() {}

  editQuestion(qu, index) {
    let content = document.getElementById("contentContainer");

    let editTemplate = `

    <div class="username">
        <label for="uname">Question ${index}</label>
        <input type="text" id="uname" name="uname" required
               minlength="4" maxlength="8"
               placeholder="4 to 8 characters long" />
        <span class="validity"></span>
    </div>`;

    content.insertAdjacentHTML("beforeend", editTemplate);
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

    sideContainer.insertAdjacentHTML("beforeend", titleTemplate);

    let titleSection = document.querySelector(".titleSection");

    if (titleSection === null) {
      modal.error(
        "Could not find class element titleSection. Please restart the program and try again."
      );
      this.clear();
      return;
    }

    titleSection.addEventListener("click", function(e) {
      document
        .querySelector(".currentSection")
        .classList.remove("currentSection");

      e.target.className += " currentSection";
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
        this.clear();
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
          this.clear();
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
