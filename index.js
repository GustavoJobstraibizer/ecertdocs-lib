// import "bootstrap";
import Modal from 'modal-vanilla';
import './main.scss';
import { ControlPage } from './src/components/ControlPage';
import DocumentSignatureState from './src/entities/document-signature-state';
import Shape from './src/entities/shape';
import exibePdf from './src/helpers/helper';
import shapeState from './src/helpers/shapes';
import structureSubscribers from './src/helpers/subscribers';

((window) => {
  function myPackage() {
    const ecerDocstLib = {};

    const documentSignatureState = new DocumentSignatureState();
    const participantsSubscriber = structureSubscribers;

    const isRequired = (field, value) => {
      if (value) return value;
      throw new Error(`O Campo "${field}" é obrigatório`);
    };

    ecerDocstLib.createParticipantSignature = (participant = {}) => {
      const participanData = participant;
      const shape = new Shape(
        (participanData.email = isRequired('email', participanData.email)),
        (participanData.order = isRequired('order', participanData.order)),
        (participanData.document = isRequired(
          'document',
          participanData.document,
        )),
        (participanData.name = isRequired('name', participanData.name)),
      );

      shapeState.shapes.push(shape);

      participantsSubscriber.addSubscriber(shape.id, 0, 0, 1, participant.name);

      documentSignatureState.myModal.show();

      documentSignatureState.participant = shapeState.getElementByDataKey(
        shape.dataKey,
      );

      return new Promise((resolve) => {
        documentSignatureState.myModal.on('hidden', () => {
          // TODO Add participant
          console.log('Add Participant in list ');
          resolve(participant);
        });
      });
    };

    ecerDocstLib.updateParticipantSignature = (
      document = isRequired('document', document),
    ) => {
      const shape = shapeState.getParticipantByDocument(document);

      documentSignatureState.participant = shape;

      documentSignatureState.myModal.show();
    };

    ecerDocstLib.removeParticipant = (
      document = isRequired('document', document),
    ) => {
      const shape = shapeState.getParticipantByDocument(document);

      shapeState.shapes = shapeState.removeParticipantFromShapes(document);

      structureSubscribers.removeSubscriber(shape.id);

      // this.totalParticipants = this.shapes.length;

      setTimeout(() => {
        let order = 1;

        // const itemShapes = $("#tableParticipantes li");

        for (let i = 0; i < shapeState.shapes.length; i += 1) {
          const currentShape = this.shapes[i];

          currentShape.order = order;
          currentShape.dataKey = order;
          currentShape.order = order;
          currentShape.dataKey = order;
          // let shape = JSON.parse(itemShapes[i].dataset.shape);
          // itemShapes[i].id = `element_${order}`;
          // itemShapes[i].dataset.key = order;
          // itemShapes[i].dataset.shape = JSON.stringify(shape);
          // itemShapes[i].children[0].innerHTML = order;
          order += 1;
        }
      }, 300);
    };

    ecerDocstLib.getParticipants = () => shapeState.shapes;

    function closeModalSignature() {
      debugger;
      documentSignatureState.myModal.hide();

      // this.modalDocument.modal("hide");

      if (documentSignatureState.cropper != null) {
        const dataCropper = documentSignatureState.cropper.getData();

        shapeState.shapes.forEach((shape) => {
          if (documentSignatureState.participant.text === shape.text) {
            shape.x = dataCropper.x;
            shape.y = dataCropper.y;
            shape.width = dataCropper.width;
            shape.height = dataCropper.height;
            shape.page = documentSignatureState.pagina;
            shape.isOK = true;

            structureSubscribers.changeCoordinates(
              shape.id,
              shape.x,
              shape.y + 15,
              shape.page,
            );
          }
        });
      } else {
        shapeState.shapes.forEach((shape) => {
          shape.page = 'indefinida';
        });
      }

      documentSignatureState.participant = {};
    }

    /* eslint operator-linebreak: ["error", "after"] */
    function setCropperDataOnModalOpened() {
      if (
        documentSignatureState.cropper &&
        documentSignatureState.cropper.cropBoxData &&
        documentSignatureState.participant
      ) {
        documentSignatureState.pagina =
          documentSignatureState.participant.page === 'indefinida'
            ? 1
            : documentSignatureState.participant.page;

        documentSignatureState.cropper.reset();
        documentSignatureState.cropper.cropBoxData.width =
          documentSignatureState.participant.width;
        documentSignatureState.cropper.cropBoxData.height =
          documentSignatureState.participant.height;
        documentSignatureState.cropper.cropBoxData.left =
          documentSignatureState.participant.x;
        documentSignatureState.cropper.cropBoxData.top =
          documentSignatureState.participant.y;
        documentSignatureState.cropper.setCropBoxData(
          documentSignatureState.cropper.cropBoxData,
        );

        documentSignatureState.inputNumPageValue =
          documentSignatureState.pagina;
      }
    }

    function _init() {
      const inputFile = document.querySelector('#inputFile');
      const btnFile = document.querySelector('#btnTest');

      btnFile.addEventListener('click', () => inputFile.click());
      inputFile.addEventListener('change', (e) => {
        documentSignatureState.pdf = e.target.files;
        console.log(documentSignatureState.pdf);
      });

      documentSignatureState.myModal = new Modal({
        content: ControlPage(),
      });

      documentSignatureState.myModal.on('shown', () => {
        const previousBtn = document.querySelector('#previousBtn');
        previousBtn.addEventListener('click', () => console.log('previous'));

        const btnSelectAreaSignature = document.querySelector(
          '#btnSelectAreaSignature',
        );
        btnSelectAreaSignature.addEventListener('click', () =>
          closeModalSignature(),
        );

        setCropperDataOnModalOpened();

        exibePdf(
          documentSignatureState.pdf,
          document.querySelector('#pdfCanvas'),
          documentSignatureState,
        );
      });
    }

    _init();

    return ecerDocstLib;
  }

  if (typeof window.EcertDocsLib === 'undefined') {
    window.EcertDocsLib = myPackage();
  }
})(window);
