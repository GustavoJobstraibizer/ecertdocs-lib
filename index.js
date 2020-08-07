// import "bootstrap";
import Modal from "modal-vanilla";
import "./main.scss";
import { ControlPage } from "./src/components/ControlPage";
import { DocumentSignatureState } from "./src/entities/document-signature-state";
import { Shape } from "./src/entities/shape";
import * as helper from "./src/helpers/helper";
import { shapeState } from "./src/helpers/shapes";
import { structureSubscribers } from "./src/helpers/subscribers";

((window) => {
  "use strict";

  function myPackage() {
    let _myLib = {};

    let documentSignatureState = new DocumentSignatureState();
    let participantsSubscriber = structureSubscribers;

    _myLib.createParticipantSignature = (participante) => {
      const shape = new Shape(
        "teste@teste.com.br",
        1,
        "123.123.123-22",
        "Teste"
      );

      shapeState.shapes.push(shape);

      participantsSubscriber.addSubscriber(shape.id, 0, 0, 1, "Teste");

      documentSignatureState.myModal.show();

      documentSignatureState.participant = shapeState.getElementByDataKey(1);

      return new Promise((resolve) => {
        documentSignatureState.myModal.on("hidden", () => {
          // TODO Add participant
          console.log("Add Participant in list ");
          resolve(participant);
        });
      });
    };

    _myLib.getParticipants = function () {
      return null;
    };

    function closeModalSignature() {
      documentSignatureState.myModal.hide();
    }

    function init() {
      const inputFile = document.querySelector("#inputFile");
      const btnFile = document.querySelector("#btnTest");

      btnFile.addEventListener("click", () => inputFile.click());
      inputFile.addEventListener("change", (e) => {
        documentSignatureState.pdf = e.target.files;
        console.log(documentSignatureState.pdf);
      });

      documentSignatureState.myModal = new Modal({
        content: ControlPage(),
      });

      documentSignatureState.myModal.on("shown", () => {
        const previousBtn = document.querySelector("#previousBtn");
        previousBtn.addEventListener("click", () => console.log("previous"));

        const btnSelectAreaSignature = document.querySelector(
          "#btnSelectAreaSignature"
        );
        btnSelectAreaSignature.addEventListener("click", () =>
          closeModalSignature()
        );

        helper.exibePdf(
          documentSignatureState.pdf,
          document.querySelector("#pdfCanvas"),
          documentSignatureState
        );
      });
    }

    init();

    return _myLib;
  }

  if (typeof window.EcertDocsLib == "undefined") {
    window.EcertDocsLib = myPackage();
  }
})(window);
