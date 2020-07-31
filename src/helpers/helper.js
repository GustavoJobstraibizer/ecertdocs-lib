import * as pdfjsLib from "../../pdf";

async function exibePdf(pdf, pdfElement) {
  // loading('Carregando Arquivo... Por favor, Aguarde');

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

    pdfjsLib.PDFWorker = false;

    debugger;
    const getDocument = await pdfjsLib.getDocument(typedArray);

    console.log(getDocument.numPages);
    // MEUS_DOCUMENTOS.totalPages = getDocument.numPages;

    // if (!MEUS_DOCUMENTOS._validateTotalPageInDocument()) {
    //   loading();
    //   return;
    // }

    debugger;
    const page = await getDocument.getPage(1);

    const viewport = page.getViewport({ scale: 1 });
    const scale = 100 / viewport.width;

    // textContent = await page.getTextContent({ normalizeWhitespace: true });
    // textContent.items.push({ str: 'teste', width: 100, dir: 'ltr', fontName: 'g_d1_f2', transform: textContent.items[0].transform });

    var context = pdfElement.getContext("2d");

    WIDTH = viewport.width / 2;
    HEIGHT = viewport.height / 2;

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
        // MEUS_DOCUMENTOS.selectArea();
        // if (Object.entries(MEUS_DOCUMENTOS.participant).length > 0 && (MEUS_DOCUMENTOS.participant.isOK && MEUS_DOCUMENTOS.participant.page != MEUS_DOCUMENTOS.pagina)) {
        //   MEUS_DOCUMENTOS.participant.page = MEUS_DOCUMENTOS.participant.page != 'indefinida' ? MEUS_DOCUMENTOS.pagina : MEUS_DOCUMENTOS.participant.page
        //   MEUS_DOCUMENTOS.exibePdf();
        // }
        // if (MEUS_DOCUMENTOS.cropper && MEUS_DOCUMENTOS.participant) {
        //   MEUS_DOCUMENTOS.cropper.reset();
        //   MEUS_DOCUMENTOS.cropper.options.data = { x: MEUS_DOCUMENTOS.participant.x, y: MEUS_DOCUMENTOS.participant.y, width: MEUS_DOCUMENTOS.participant.width, height: MEUS_DOCUMENTOS.participant.height };
        // }
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

export { exibePdf };
