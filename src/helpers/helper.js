// import * as pdfjsLib from "../../static/pdf.js";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import * as pdfjsLib from 'pdfjs-dist';
import '../../worker';
import { structureSubscribers } from './subscribers';
// window.pdfjsWorker = require("pdfjs-dist/build/pdf.worker");
// pdfjsLib.GlobalWorkerOptions.workerSrc = ''

async function exibePdf(pdf, pdfElement, documentSignatureState) {
  // loading('Carregando Arquivo... Por favor, Aguarde ');

  this.nameFile = pdf[0].name;
  this.fileSize = pdf[0].size;

  // if (this.validateFileSize(pdf[0].size)) {
  //   fileInput.val('');
  //   toastr.warn('Selecione um arquivo com o tamanho máximo de 15MB');
  //   return;
  // }
  var reader = new FileReader();

  reader.onloadend = async function () {
    var typedArray = new Uint8Array(this.result);

    // pdfjsLib.PDFWorker = false;
    debugger;

    const getDocument = await pdfjsLib.getDocument(typedArray).promise;

    console.log(getDocument.numPages);
    // MEUS_DOCUMENTOS.totalPages = getDocument.numPages;

    // if (!MEUS_DOCUMENTOS._validateTotalPageInDocument()) {
    //   loading();
    //   return;
    // }
    const page = await getDocument.getPage(1);

    const viewport = page.getViewport({ scale: 1 });
    const scale = 100 / viewport.width;

    // textContent = await page.getTextContent({ normalizeWhitespace: true });
    // textContent.items.push({ str: 'teste', width: 100, dir: 'ltr', fontName: 'g_d1_f2', transform: textContent.items[0].transform });

    var context = pdfElement.getContext('2d');

    documentSignatureState.width = viewport.width / 2;
    // MyPackage.WIDTH = viewport.width / 2;
    documentSignatureState.height = viewport.height / 2;
    // MyPackage.HEIGHT = viewport.height / 2;

    pdfElement.width = viewport.width;
    pdfElement.height = viewport.height;

    const pdf = page.render({
      canvasContext: context,
      viewport: viewport,
    });

    pdf.promise
      .then(async () => {
        // MEUS_DOCUMENTOS.totalPage = MEUS_DOCUMENTOS.totalPages;
        // MEUS_DOCUMENTOS.pageCounter();
        selectArea(pdfElement, documentSignatureState);
        // if (Object.entries(MEUS_DOCUMENTOS.participant).length > 0 && (MEUS_DOCUMENTOS.participant.isOK && MEUS_DOCUMENTOS.participant.page != MEUS_DOCUMENTOS.pagina)) {
        //   MEUS_DOCUMENTOS.participant.page = MEUS_DOCUMENTOS.participant.page != 'indefinida' ? MEUS_DOCUMENTOS.pagina : MEUS_DOCUMENTOS.participant.page
        //   MEUS_DOCUMENTOS.exibePdf();
        // }
        if (
          documentSignatureState.cropper &&
          documentSignatureState.participant
        ) {
          documentSignatureState.cropper.reset();
          documentSignatureState.cropper.options.data = {
            x: documentSignatureState.participant.x,
            y: documentSignatureState.participant.y,
            width: documentSignatureState.participant.width,
            height: documentSignatureState.participant.height,
          };
        }
        // MEUS_DOCUMENTOS.inputNumPageValue = MEUS_DOCUMENTOS.pagina;
        // if (MEUS_DOCUMENTOS.totalPages == 1) {
        //   MEUS_DOCUMENTOS.controlPage.style.display = 'none';
        // } else {
        //   MEUS_DOCUMENTOS.controlPage.style.display = 'block';
        // }
      })
      .finally(() => {
        // loading()
      });
  };

  reader.readAsArrayBuffer(pdf[0]);
}

function createElementToShowSubscriber(documentSignatureState) {
  if (Object.entries(documentSignatureState.participant).length > 0) {
    const span = document.createElement('span');
    span.innerHTML = structureSubscribers.getNameSubscriber(
      documentSignatureState.participant.id
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

function selectArea(pdfElement, documentSignatureState) {
  if (documentSignatureState.cropper) {
    documentSignatureState.cropper.destroy();
    documentSignatureState.cropper = null;
    // MyPackage.cropper.destroy();
    // MyPackage.cropper = null;
  }

  let textWidth = 0;

  if (Object.entries(documentSignatureState.participant).length > 0) {
    const dummyElement = document.createElement('canvas');
    const ctxDummy = dummyElement.getContext('2d');
    ctxDummy.font = '15px Arial';

    // const name = `${myObject.participant.name.match(/(.*)(?:\@)/)[1]} / ${this.roleParticipant(myObject.participant.role)}`;
    // const name = `${myObject.participant.name} / ${this.roleParticipant(myObject.participant.role)}`;
    const name = 'Teste';
    ctxDummy.fillText(name, 0, 0);

    textWidth = ctxDummy.measureText(name).width;

    dummyElement.remove();
  }

  const cropper = new Cropper(pdfElement, {
    //        aspectRatio: 21 / 9,
    minCanvasWidth: documentSignatureState.width,
    minCanvasHeight: documentSignatureState.height,
    minContainerWidth: documentSignatureState.width * 2,
    minContainerHeight: documentSignatureState.height * 2,
    cropBoxResizable: false,
    dragMode: 'move',
    zoomable: false,
    background: false,
    movable: false,
    minCropBoxWidth: textWidth,
    //        minCropBoxHeight: textHeight,
  });

  documentSignatureState.cropper = cropper;

  setTimeout(() => {
    createElementToShowSubscriber(documentSignatureState);
    createElementToShowSubscribers();
  }, 1);
}

export default exibePdf;
