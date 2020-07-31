import React from "react";
import ControlPage from "../ControlPage";

export default function ModalEcert() {
  return (
    <>
      <div id="static-modal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title">Modal title</h4>
            </div>
            <div className="modal-body">
              <ControlPage />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import './index.scss';

// export class Modal {

//   id = 'my-modal';

//   constructor() {}

//   modal() {
//     return myModal = `
//       <div id="my-modal" class="modal on">
//         <canvas id="pdfCanvas"></canvas>
//       </div>
//     `;
//   }

//   showModal() {
//     let body = document.querySelector("body");
//     let bg = document.createElement("div");
//     bg.className = "modal-js-overlay";

//     body.appendChild(bg);

//     this.createContentModal();
//   }

//   createContentModal() {
//     // let div = document.createElement('div');
//     // div.appendChild(Form())
//     // div.classList.add('modal', 'on');
//     // div.id = this.id;
//     let body = document.querySelector("body");
//     body.innerHTML = this.modal();
//     this.createCloseButton(div);
//   }

//   createCloseButton(el) {
//     let close = document.createElement("span");
//     let body = document.querySelector("body");
//     close.className = "modal-js-close";
//     close.innerHTML = "x";
//     el.appendChild(close);
//     close.addEventListener('click', function () {
//         let overlay = body.querySelector(".modal-js-overlay");
//         let closebtn = el.querySelector(".modal-js-close");

//         body.removeChild(overlay);

//         el.classList.remove('on');
//         el.removeChild(closebtn);
//         body.removeChild(el);
//     });
//   }

//   closeModal() {
//     let body = document.querySelector("body");
//     let el = document.querySelector('my-modal');
//     let overlay = body.querySelector(".modal-js-overlay");

//     el.classList.remove('on');
//     body.removeChild(overlay);
//   }

// }
