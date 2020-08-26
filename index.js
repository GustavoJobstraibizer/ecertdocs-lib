import Modal from 'modal-vanilla';
import './main.scss';
import ControlPage from './src/components/ControlPage';
import docSignState from './src/entities/document-signature-state';
import Shape from './src/entities/shape';
import shapeState from './src/entities/shapes';
import structureSubscribers from './src/entities/subscribers';
import EcertDocsError from './src/errors/ecert-lib';
import {
  capitalizeFirstLetter,
  isRequired,
  isValidEmail,
} from './src/helpers/helpers';
import showPDF from './src/pdf-area-select';

const ENTER_CODE = 13;

((window) => {
  'use strict';

  function ecertDocsSignature() {
    const ecertDocstLib = {};
    const _packageState = {
      modal: null,
      canvas: '<canvas id="pdfCanvas" width="55%" height="55%"></canvas>',
      data: {
        file: null,
        titulo: '',
        participants: [],
      },
    };

    const participantsSubscriber = structureSubscribers;

    function validateInputFile(pdf) {
      if (
        pdf instanceof File &&
        pdf.size > 0 &&
        pdf.type === 'application/pdf'
      ) {
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

    /**
     * @typedef {EcertDocsError} EcertDocsError
     * @property {string} message - Mensagem generica do erro.
     * @property {string} type - Tipo do erro validation_error.
     * @property {Object} errors - erros ocosinados ao passar parâmetros inválidos.
     */

    /**
     * @description Adiciona o documento com a extensão .pdf
     * onde serão feito as assinaturas.
     *
     * @param {File} pdfFile Arquivo pdf onde serão feitas selecionado as areas das assinaturas.
     * @returns {Promise} Promise boolean caso o arquivo for válido.
     *
     * @method addPDFDocument
     * @throws {EcertDocsError} Erro ao setar o documento PDF para a assinatura.
     */
    ecertDocstLib.addPDFDocument = (pdfFile) => {
      return Promise.resolve(validateInputFile(pdfFile))
        .then((file) => {
          eraseData();
          docSignState.pdf = file;
        })
        .then(() => Promise.resolve(true))
        .catch(throwApplicationError);
    };

    /**
     * @description Adiciona um participante a assinatura do documento.
     *
     * @property {string} email Email do participante.
     * @property {string} document CPF do participante.
     * @property {string} name Nome do participante.
     * @property {string} role Perfil do participante na assinatura.
     * @property {number} tipoAssinatura Tipo da assinatura 1 - 'ELETRÔNICA' ou 2 - 'DIGITAL'.
     *
     * @throws {Error} propriedade obrigatória
     * @method createParticipantSignature
     */
    ecertDocstLib.createParticipantSignature = ({
      email,
      document,
      name,
      role,
      tipoAssinatura,
    }) => {
      const shape = new Shape(
        (email = isRequired('email', email)),
        (document = isRequired('document', document)),
        (name = isRequired('name', name)),
        (role = isRequired('role', role)),
        tipoAssinatura,
      );

      shapeState.emailAlreadyExists(email);
      if (!isValidEmail(email)) {
        throw new Error('O email informado não é válido');
      }

      shapeState.shapes.push(shape);

      const nameCapitalized = `${name} / ${capitalizeFirstLetter(role)}`;

      participantsSubscriber.addSubscriber(shape.id, 0, 0, 1, nameCapitalized);

      _packageState.modal.show();

      docSignState.participant = shapeState.getElementByDataKey(shape.dataKey);
    };

    /**
     * @description Permite a alteração da posição da assinatura do participante.
     *
     * @param {string} document cpf do participante.
     * @method updateParticipantSignaturePos
     */
    ecertDocstLib.updateParticipantSignaturePos = (
      document = isRequired('document', document),
    ) => {
      const shape = shapeState.getParticipantByDocument(document);

      docSignState.participant = shape;

      _packageState.modal.show();
    };

    /**
     * @description Remove o participante da assinatura do documento.
     *
     * @param {string} document cpf do participante.
     * @method removeParticipantSignature
     */
    ecertDocstLib.removeParticipantSignature = (
      document = isRequired('document', document),
    ) => {
      return new Promise((resolve) => {
        const shape = shapeState.getParticipantByDocument(document);

        shapeState.shapes = shapeState.removeParticipantFromShapes(document);

        structureSubscribers.removeSubscriber(shape.id);

        setTimeout(() => {
          let order = 1;

          for (let i = 0; i < shapeState.shapes.length; i += 1) {
            const currentShape = shapeState.shapes[i];

            currentShape.order = order;
            currentShape.dataKey = order;
            currentShape.order = order;
            currentShape.dataKey = order;
            order += 1;
          }

          resolve(true);
        }, 300);
      });
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

    /**
     * @description Permite apagar os dados dos participantes configurados e o documento
     * selecionado para a assinatura.
     *
     * @returns {Promise} Promise boolean.
     * @method resetData
     */
    ecertDocstLib.resetData = () => {
      return Promise.resolve(eraseData()).then(() => Promise.resolve(true));
    };

    /**
     * @typedef {Participant} Participant
     * @property {string} document - CPF do participante.
     * @property {string} role - Perfil escolhido para o participante.
     * @property {number} posX - posição do eixo X da assinatura.
     * @property {number} posY - posição do eixo Y da assinatura.
     * @property {string} tipo - Tipo assinatura Eletrônica ou digital.
     * @property {number} largura - Medida da largura do nome / tipo na assinatura.
     * @property {number} altura - Medida da altura do nome / tipo na assinatura.
     * @property {number} orgem - Ordem em que sera feita a assinatura.
     * @property {number} pagina - Pagina que sera feita a assinatura.
     *
     */

    /**
     * @typedef {ResultParticipant} ResultParticipant
     * @property {File} file - Arquivo selecionado para as assinaturas.
     * @property {string} titulo - Nome arquivo selecionado.
     * @property {Participant} participants - Informações dos Participantes configurados para a assinatura.
     *
     */

    /**
     * @description Lista com todos os participantes configurados para assinatura do documento.
     *
     * @returns {ResultParticipant} Lista de participantes configurados.
     * @method getParticipants
     *
     */
    ecertDocstLib.getParticipants = () => {
      _packageState.data.file = docSignState.pdf;
      _packageState.data.titulo = _packageState?.data?.file?.name.replace(
        '.pdf',
        '',
      );
      _packageState.data.participants = shapeState.getParticipants();
      const { data } = _packageState;
      return Object.seal(data);
    };

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
        function nextPage() {
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
            showPDF();
          } catch (e) {
            console.error(e);
          }
        }
        function previousPage() {
          if (docSignState.pagina > 1) {
            docSignState.pagina -= 1;
          }

          setNumPageValue(docSignState.pagina);

          if (docSignState.cropper != null) {
            docSignState.cropper.destroy();
          }

          try {
            showPDF();
          } catch (e) {
            console.error(e);
          } finally {
            pageCounter();
          }
        }
        function goToPage(e) {
          if (
            e.keyCode === ENTER_CODE &&
            this.value &&
            this.value > 0 &&
            this.value <= docSignState.totalPages
          ) {
            docSignState.pagina = parseInt(this.value);
            showPDF();
          }
        }

        const previousBtn = document.querySelector('#previousBtn');
        previousBtn.addEventListener('click', previousPage);

        const nextBtn = document.querySelector('#nextBtn');
        nextBtn.addEventListener('click', nextPage);

        const numPageButton = document.querySelector('#numPage');
        numPageButton.addEventListener('keyup', goToPage);

        const btnSelectAreaSignature = document.querySelector(
          '#btnSelectAreaSignature',
        );

        btnSelectAreaSignature.addEventListener('click', () =>
          closeModalSignature(),
        );

        setCropperDataOnModalOpened();

        showPDF();
      });
    }

    function _init() {
      createModal();
    }

    _init();

    return ecertDocstLib;
  }

  /* eslint-disable no-param-reassign */
  if (typeof window.EcertDocsLib === 'undefined') {
    window.EcertDocsLib = ecertDocsSignature();
  }
})(window);
