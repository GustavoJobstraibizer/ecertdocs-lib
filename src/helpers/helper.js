// import * as pdfjsLib from "../../static/pdf.js";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import * as pdfjsLib from 'pdfjs-dist';
import '../../worker';
import docSignState from '../entities/document-signature-state';
import roleParticipant from './roles';
import structureSubscribers from './subscribers';

function createElementToShowSubscriber() {
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
  const subscribersOnPage = structureSubscribers.getSubscribersByPage(
    docSignState.pagina,
  );

  if (subscribersOnPage.length > 0) {
    const cropperCanvas = document.querySelector('.cropper-canvas');

    if (cropperCanvas) {
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
}

function setNumPageValue(value) {
  document.querySelector('#numPage').value = value;
}

function pageCounter() {
  const pageCount = document.querySelector('.page-count');
  pageCount.innerHTML = `/ ${docSignState.totalPages}`;
}

function selectArea() {
  const pdfCanvas = document.querySelector('#pdfCanvas');
  if (docSignState.cropper) {
    docSignState.cropper.destroy();
    docSignState.cropper = null;
  }

  let textWidth = 0;

  if (Object.entries(docSignState.participant).length > 0) {
    const dummyElement = document.createElement('canvas');
    const ctxDummy = dummyElement.getContext('2d');
    ctxDummy.font = '15px Arial';

    const name = `${docSignState.participant.name} / ${roleParticipant(
      docSignState.participant.role,
    )}`;
    ctxDummy.fillText(name, 0, 0);

    textWidth = ctxDummy.measureText(name).width;

    dummyElement.remove();
  }

  const cropper = new Cropper(pdfCanvas, {
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
    rotatable: false,
  });

  docSignState.cropper = cropper;

  setTimeout(() => {
    createElementToShowSubscriber(docSignState);
    createElementToShowSubscribers(docSignState);
  }, 1);
}

async function successResolverPDF() {
  pageCounter(docSignState);

  selectArea();

  if (
    Object.entries(docSignState.participant).length > 0 &&
    docSignState.participant.isOK &&
    docSignState.participant.page != docSignState.pagina
  ) {
    docSignState.participant.page =
      docSignState.participant.page != 'indefinida'
        ? docSignState.pagina
        : docSignState.participant.page;

    exibePdf();
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

  setNumPageValue(docSignState.pagina);
  const controlPage = document.querySelector('#controlPage');
  controlPage.style.display = docSignState.totalPages === 1 ? 'none' : 'block';
}

// const renderPDF = {
//   renderInProgress: false,
// };

function doRender(page, context, viewport) {
  docSignState.renderInProgress = true;

  if (docSignState.renderInProgress) {
    const pdf = page.render({
      canvasContext: context,
      viewport,
    });

    pdf.promise
      .then(async () => {
        successResolverPDF(docSignState);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        docSignState.renderInProgress = false;
      });
  }
}

async function exibePdf() {
  const pdfCanvas = document.querySelector('#pdfCanvas');
  const context = pdfCanvas.getContext('2d');

  this.nameFile = docSignState.pdf.name;
  this.fileSize = docSignState.pdf.size;

  const reader = new FileReader();

  reader.onloadend = async function () {
    const typedArray = new Uint8Array(this.result);

    // pdfjsLib.PDFWorker = false;
    const getDocument = await pdfjsLib.getDocument(typedArray).promise;

    docSignState.totalPages = getDocument.numPages;

    const page = await getDocument.getPage(docSignState.pagina);

    const viewport = page.getViewport({ scale: 1 });

    docSignState.width = viewport.width / 2;
    docSignState.height = viewport.height / 2;

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    if (!docSignState.renderInProgress) {
      doRender(page, context, viewport);
    }
  };

  reader.readAsArrayBuffer(docSignState.pdf);
}

export default exibePdf;
