// import "bootstrap";
import Modal from 'modal-vanilla';
import './main.scss';
import { ControlPage } from './src/components/ControlPage';
import DocumentSignatureState from './src/entities/document-signature-state';
import Shape from './src/entities/shape';
import * as helper from './src/helpers/helper';
import { shapeState } from './src/helpers/shapes';
import { structureSubscribers } from './src/helpers/subscribers';

((window) => {
  function myPackage() {
    const _myLib = {};

    const documentSignatureState = new DocumentSignatureState();
    const participantsSubscriber = structureSubscribers;

    const isRequired = (field, value) => {
      if (value) return value;
      throw new Error(`O Campo "${field}" é obrigatório`);
    };

    _myLib.createParticipantSignature = (participant = {}) => {
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

      documentSignatureState.participant = shapeState.getElementByDataKey(1);

      return new Promise((resolve) => {
        documentSignatureState.myModal.on('hidden', () => {
          // TODO Add participant
          console.log('Add Participant in list ');
          resolve(participant);
        });
      });
    };

    _myLib.updateParticipantSignature = (
      document = isRequired('document', document),
    ) => {
      console.log('Parameter has been present');
    };

    _myLib.remoteParticipant = (
      document = isRequired('document', document),
    ) => {
      console.log('Parameter has been present');

      debugger;

      const shape = shapeState.shapes.find((sh) => sh.document === document);

      if (!shape) {
        throw new Error(`Participante com o cpf ${document} não existente`);
      }

      shapeState.shapes = shapeState.shapes.filter(
        (sh) => sh.document !== document,
      );

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

    _myLib.getParticipants = () => null;

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

        helper.exibePdf(
          documentSignatureState.pdf,
          document.querySelector('#pdfCanvas'),
          documentSignatureState,
        );
      });
    }

    _init();

    return _myLib;
  }

  if (typeof window.EcertDocsLib === 'undefined') {
    window.EcertDocsLib = myPackage();
  }
})(window);
