// import * as pdfjsLib from "../../static/pdf.js";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import * as pdfjsLib from 'pdfjs-dist';
import '../../worker';
import structureSubscribers from './subscribers';

function createElementToShowSubscriber(docSignState) {
  if (Object.entries(docSignState.participant).length > 0) {
    const span = document.createElement('span');
    span.innerHTML = structureSubscribers.getNameSubscriber(
      docSignState.participant.id,
    );
    span.classList.add('subscriber');

    const cropperBox = document.querySelector('.cropper-view-box');

    if (cropperBox) {
      cropperBox.appendChild(span);
    }
  }
}

function createElementToShowSubscribers() {
  const subscribersOnPage = structureSubscribers.getSubscribersByPage(1);

  if (subscribersOnPage.length > 0) {
    const cropperCanvas = document.querySelector('.cropper-canvas');

    subscribersOnPage.forEach((s) => {
      let text = null;
      text = document.createElement('span');
      text.classList.add('subscribed');
      text.innerHTML = s.name;
      text.style.transform = `translate(${s.coordinates.x}px, ${s.coordinates.y}px)`;

      cropperCanvas.appendChild(text);
    });
  }
}

function roleParticipant(role) {
  const roles = {
    CONTRATANTE: 'Contratante',
    CONTRATADO: 'Contratado',
    PARTE: 'Parte',
    TESTEMUNHA: 'Testemunha',
    TESTEMUNHA_CONTRATANTE: 'Testemunha Contratante',
    TESTEMUNHA_CONTRATADO: 'Testemunha Contratado',
  };

  return roles[role] || '';
}

function selectArea(pdfElement, docSignState) {
  if (docSignState.cropper) {
    docSignState.cropper.destroy();
    docSignState.cropper = null;
  }

  let textWidth = 0;

  if (Object.entries(docSignState.participant).length > 0) {
    const dummyElement = document.createElement('canvas');
    const ctxDummy = dummyElement.getContext('2d');
    ctxDummy.font = '15px Arial';

    debugger;
    const name = `${docSignState.participant.name} / ${roleParticipant(
      docSignState.participant.role,
    )}`;
    ctxDummy.fillText(name, 0, 0);

    textWidth = ctxDummy.measureText(name).width;

    dummyElement.remove();
  }

  const cropper = new Cropper(pdfElement, {
    minCanvasWidth: docSignState.width,
    minCanvasHeight: docSignState.height,
    minContainerWidth: docSignState.width * 2,
    minContainerHeight: docSignState.height * 2,
    cropBoxResizable: false,
    dragMode: 'move',
    zoomable: false,
    background: false,
    movable: false,
    minCropBoxWidth: textWidth,
  });

  docSignState.cropper = cropper;

  setTimeout(() => {
    createElementToShowSubscriber(docSignState);
    createElementToShowSubscribers();
  }, 1);
}

async function exibePdf(docSignState, pdfElement) {
  return new Promise((resolve, reject) => {
    this.nameFile = docSignState.pdf[0].name;
    this.fileSize = docSignState.pdf[0].size;

    // if (this.validateFileSize(pdf[0].size)) {
    //   fileInput.val('');
    //   toastr.warn('Selecione um arquivo com o tamanho máximo de 15MB');
    //   return;
    // }
    const reader = new FileReader();

    reader.onloadend = async function () {
      const typedArray = new Uint8Array(this.result);

      // pdfjsLib.PDFWorker = false;
      const getDocument = await pdfjsLib.getDocument(typedArray).promise;

      docSignState.totalPages = getDocument.numPages;

      // if (!MEUS_DOCUMENTOS._validateTotalPageInDocument()) {
      //   loading();
      //   return;
      // }
      const page = await getDocument.getPage(docSignState.pagina);

      const viewport = page.getViewport({ scale: 1 });

      const context = pdfElement.getContext('2d');

      docSignState.width = viewport.width / 2;
      docSignState.height = viewport.height / 2;

      pdfElement.width = viewport.width;
      pdfElement.height = viewport.height;

      const pdf = page.render({
        canvasContext: context,
        viewport,
      });

      pdf.promise
        .then(async () => {
          resolve(true);
        })
        .catch((err) => reject(err))
        .finally(() => docSignState);
    };

    reader.readAsArrayBuffer(docSignState.pdf[0]);
  });
}

export { exibePdf, selectArea };
