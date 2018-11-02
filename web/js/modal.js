
function removeModalFromBtn(e) {
  e.stopPropagation();
  e.preventDefault();

  e.target.removeEventListener("click", removeModalFromBtn);
  e.target.parentNode.parentNode.outerHTML = "";
}

class Modal {
  constructor() {}

  error(msg) {
    let template = `<div class="modalBackground">
                    <div class="modal errorModal">
                         <div class="modalIcon">
                             <img src="/icon/alert-circle-outline.svg" alt="error"/>
                         </div>
                         <div class="modalContent">${msg}</div>

                         <button class="modalBtn">OK</button>
                    </div>
                    </div>`;

    document.body.insertAdjacentHTML("beforeend", template);

    let button = document.querySelector(".modalBtn");

    button.addEventListener("click", removeModalFromBtn);

  }
}

var modal = new Modal();
