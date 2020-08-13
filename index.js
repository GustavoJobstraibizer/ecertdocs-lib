// import "bootstrap";
import Modal from 'modal-vanilla';
import './main.scss';
import ControlPage from './src/components/ControlPage';
import DocumentSignatureState from './src/entities/document-signature-state';
import Shape from './src/entities/shape';
import { exibePdf, selectArea } from './src/helpers/helper';
import shapeState from './src/helpers/shapes';
import structureSubscribers from './src/helpers/subscribers';

((window) => {
  function myPackage() {
    const ecertDocstLib = {};

    const docSignState = DocumentSignatureState;
    const participantsSubscriber = structureSubscribers;

    const isRequired = (field, value) => {
      if (value) return value;
      throw new Error(`O Campo "${field}" é obrigatório`);
    };

    ecertDocstLib.createParticipantSignature = (participant = {}) => {
      const data = participant;
      const shape = new Shape(
        (data.email = isRequired('email', data.email)),
        (data.order = isRequired('order', data.order)),
        (data.document = isRequired('document', data.document)),
        (data.name = isRequired('name', data.name)),
        (data.role = isRequired('role', data.role)),
      );

      shapeState.emailAlreadyExists(data.email);

      shapeState.shapes.push(shape);

      participantsSubscriber.addSubscriber(shape.id, 0, 0, 1, participant.name);

      docSignState.myModal.show();

      docSignState.participant = shapeState.getElementByDataKey(shape.dataKey);

      return new Promise((resolve) => {
        docSignState.myModal.on('hidden', () => {
          // TODO Add participant
          console.log('Add Participant in list ');
          resolve(participant);
        });
      });
    };

    ecertDocstLib.updateParticipantSignature = (
      document = isRequired('document', document),
    ) => {
      const shape = shapeState.getParticipantByDocument(document);

      docSignState.participant = shape;

      docSignState.myModal.show();
    };

    ecertDocstLib.removeParticipant = (
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

    ecertDocstLib.getParticipants = () => shapeState.shapes;

    function closeModalSignature() {
      docSignState.myModal.hide();

      if (docSignState.cropper != null) {
        const dataCropper = docSignState.cropper.getData();

        shapeState.shapes.forEach((shape) => {
          if (docSignState.participant.text === shape.text) {
            shape.x = dataCropper.x;
            shape.y = dataCropper.y;
            shape.width = dataCropper.width;
            shape.height = dataCropper.height;
            shape.page = docSignState.pagina;
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

      docSignState.participant = {};
    }

    /* eslint operator-linebreak: ["error", "after"] */
    function setCropperDataOnModalOpened() {
      if (
        docSignState.cropper &&
        docSignState.cropper.cropBoxData &&
        docSignState.participant
      ) {
        docSignState.pagina =
          docSignState.participant.page === 'indefinida'
            ? 1
            : docSignState.participant.page;

        docSignState.cropper.reset();
        docSignState.cropper.cropBoxData.width = docSignState.participant.width;
        docSignState.cropper.cropBoxData.height =
          docSignState.participant.height;
        docSignState.cropper.cropBoxData.left = docSignState.participant.x;
        docSignState.cropper.cropBoxData.top = docSignState.participant.y;
        docSignState.cropper.setCropBoxData(docSignState.cropper.cropBoxData);

        docSignState.inputNumPageValue = docSignState.pagina;
      }
    }

    function pageCounter() {
      const pageCount = document.querySelector('.page-count');
      pageCount.innerHTML = `/ ${docSignState.totalPages}`;
    }

    async function successResolverPDF() {
      // docSignState.totalPage = docSignState.totalPages;
      docSignState.pageCounter();

      selectArea(document.querySelector('#pdfCanvas'), docSignState);

      if (
        Object.entries(docSignState.participant).length > 0 &&
        docSignState.participant.isOK &&
        docSignState.participant.page != docSignState.pagina
      ) {
        docSignState.participant.page =
          docSignState.participant.page != 'indefinida'
            ? docSignState.pagina
            : docSignState.participant.page;
        exibePdf(docSignState, document.querySelector('#pdfCanvas'));
      }

      if (docSignState.cropper && docSignState.participant) {
        docSignState.cropper.reset();
        docSignState.cropper.options.data = {
          x: docSignState.participant.x,
          y: docSignState.participant.y,
          width: docSignState.participant.width,
          height: docSignState.participant.height,
        };
      }
      // docSignState.inputNumPageValue = docSignState.pagina;
      // if (docSignState.totalPages == 1) {
      //   docSignState.controlPage.style.display = 'none';
      // } else {
      //   docSignState.controlPage.style.display = 'block';
      // }
    }

    function _init() {
      const inputFile = document.querySelector('#inputFile');
      const btnFile = document.querySelector('#btnTest');

      btnFile.addEventListener('click', () => inputFile.click());
      inputFile.addEventListener('change', (e) => {
        docSignState.pdf = e.target.files;
        console.log(docSignState.pdf);
      });

      docSignState.myModal = new Modal({
        content: ControlPage(),
      });

      docSignState.myModal.on('shown', () => {
        function proximo() {
          if (docSignState.pagina < docSignState.totalPages) {
            docSignState.pagina += 1;
          }

          docSignState.inputNumPageValue = docSignState.pagina;

          // MEUS_DOCUMENTOS.cropper.reset();
          if (docSignState.cropper != null) {
            docSignState.cropper.destroy();
          }

          pageCounter();

          exibePdf(docSignState, document.querySelector('#pdfCanvas'));
        }

        function anterior() {
          if (docSignState.pagina > 1) {
            docSignState.pagina -= 1;
          }

          docSignState.inputNumPageValue = docSignState.pagina;

          if (docSignState.cropper != null) {
            docSignState.cropper.destroy();
          }

          exibePdf(docSignState, document.querySelector('#pdfCanvas'));

          pageCounter();
        }

        const previousBtn = document.querySelector('#previousBtn');
        previousBtn.addEventListener('click', anterior);

        const nextBtn = document.querySelector('#nextBtn');
        nextBtn.addEventListener('click', proximo);

        const btnSelectAreaSignature = document.querySelector(
          '#btnSelectAreaSignature',
        );

        btnSelectAreaSignature.addEventListener('click', () =>
          closeModalSignature(),
        );

        setCropperDataOnModalOpened();

        exibePdf(docSignState, document.querySelector('#pdfCanvas')).then(
          successResolverPDF,
        );
      });
    }

    _init();

    return ecertDocstLib;
  }

  if (typeof window.EcertDocsLib === 'undefined') {
    window.EcertDocsLib = myPackage();
  }
})(window);
