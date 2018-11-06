class Create {
  constructor() {}

  fromJSON(json) {
    let template = `<div class="quizSection">
                    <img class="quizIndicator" src="/icon/chevron-right.svg" alt="selector"/>
                    <div class="quizTitle">
                    ${title}
                    </div>
                    </div>`;

    document.body.insertAdjacentHTML("beforeend", template);
  }
}

var create = new Create();
