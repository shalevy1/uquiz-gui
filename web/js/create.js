class Create {
  constructor() {}

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

      questionElement.addEventListener("click", function(e) {
        let questionIndex = parseInt(e.target.id[e.target.id.length - 1]);
        console.log(window.quizObject.questions[questionIndex].text);

        document
          .querySelector(".currentSection")
          .classList.remove("currentSection");

        e.target.className += " currentSection";
      });
    }
  }
}

var create = new Create();
