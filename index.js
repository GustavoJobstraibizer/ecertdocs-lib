// import "bootstrap";
import Modal from 'modal-vanilla';
import './main.scss';
import ControlPage from './src/components/ControlPage';
import docSignState from './src/entities/document-signature-state';
import Shape from './src/entities/shape';
import EcertDocsError from './src/errors/ecert-lib';
import exibePdf from './src/helpers/helper';
import {
  capitalizeFirstLetter,
  isRequired,
  isValidEmail,
} from './src/helpers/helpers';
import shapeState from './src/helpers/shapes';
import structureSubscribers from './src/helpers/subscribers';

((window) => {
  function myPackage() {
    const ecertDocstLib = {};
    const _packageState = {
      modal: null,
      canvas: '<canvas id="pdfCanvas" width="55%" height="55%"></canvas>',
    };

    const participantsSubscriber = structureSubscribers;

    function validateInputFile(pdf) {
      if (pdf instanceof File) {
        return pdf;
      }

      throw new EcertDocsError({
        message: 'Erro ao setar o documento PDF para a assinatura.',
        type: 'validation_error',
        errors: [
          {
            message: 'Você deve informar um arquivo com o formato pdf.',
          },
        ],
      });
    }

    function throwApplicationError({ message, type, errors }) {
      throw new EcertDocsError({ message, type, errors });
    }

    ecertDocstLib.addPDFDocument = (pdfFile) => {
      return Promise.resolve(validateInputFile(pdfFile))
        .then((file) => {
          docSignState.pdf = file;
        })
        .then(() => Promise.resolve(true))
        .catch(throwApplicationError);
    };

    ecertDocstLib.createParticipantSignature = (participant = {}) => {
      const data = participant;
      const shape = new Shape(
        (data.email = isRequired('email', data.email)),
        (data.document = isRequired('document', data.document)),
        (data.name = isRequired('name', data.name)),
        (data.role = isRequired('role', data.role)),
        data.tipoAssinatura,
      );

      shapeState.emailAlreadyExists(data.email);
      if (!isValidEmail(data.email)) {
        throw new Error('O email informado não é válido');
      }

      shapeState.shapes.push(shape);

      const name = `${data.name} / ${capitalizeFirstLetter(data.role)}`;

      participantsSubscriber.addSubscriber(shape.id, 0, 0, 1, name);

      _packageState.modal.show();

      docSignState.participant = shapeState.getElementByDataKey(shape.dataKey);
    };

    ecertDocstLib.updateParticipantSignaturePos = (
      document = isRequired('document', document),
    ) => {
      const shape = shapeState.getParticipantByDocument(document);

      docSignState.participant = shape;

      _packageState.modal.show();
    };

    ecertDocstLib.removeParticipantSignature = (
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

    function eraseData() {
      docSignState.init();
      shapeState.init();
      structureSubscribers.init();
      const canvas =
        '<canvas id="pdfCanvas" width="55%" height="55%"></canvas>';
      _packageState.canvas = canvas;
      _packageState.modal = null;
      createModal();
      return true;
    }

    ecertDocstLib.resetData = () => {
      return Promise.resolve(eraseData()).then(() => Promise.resolve(true));
    };

    ecertDocstLib.getParticipants = () => shapeState.shapes;

    function closeModalSignature() {
      const pdfElement = document.querySelector('#pdfCanvas');
      while (pdfElement.firstChild) {
        pdfElement.removeChild(pdfElement.lastChild);
      }
      _packageState.modal.hide();

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

    function setNumPageValue(value) {
      document.querySelector('#numPage').value = value;
    }

    function createModal() {
      _packageState.modal = new Modal({
        content: ControlPage(_packageState.canvas),
      });

      _packageState.modal.on('shown', () => {
        function proximo() {
          if (docSignState.pagina < docSignState.totalPages) {
            docSignState.pagina += 1;
          }

          setNumPageValue(docSignState.pagina);

          // MEUS_DOCUMENTOS.cropper.reset();
          if (docSignState.cropper != null) {
            docSignState.cropper.destroy();
          }

          pageCounter();

          try {
            exibePdf();
          } catch (e) {
            console.error(e);
          }
        }
        function anterior() {
          if (docSignState.pagina > 1) {
            docSignState.pagina -= 1;
          }

          setNumPageValue(docSignState.pagina);

          if (docSignState.cropper != null) {
            docSignState.cropper.destroy();
          }

          try {
            exibePdf();
          } catch (e) {
            console.error(e);
          } finally {
            pageCounter();
          }
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

        exibePdf();
      });
    }

    function _init() {
      const inputFile = document.querySelector('#inputFile');
      const btnFile = document.querySelector('#btnTest');

      btnFile.addEventListener('click', () => inputFile.click());
      inputFile.addEventListener('click', (e) => {
        e.target.value = '';
      });
      inputFile.addEventListener('change', (e) => {
        const [files] = e.target.files;
        docSignState.pdf = files;
      });

      createModal();
    }

    _init();

    return ecertDocstLib;
  }

  /* eslint-disable no-param-reassign */
  if (typeof window.EcertDocsLib === 'undefined') {
    window.EcertDocsLib = myPackage();
  }
})(window);
