class DocumentSignatureState {
  constructor() {
    this.init();
  }

  init() {
    this.pdf = null;
    this.cropper = null;
    this.width = 0;
    this.height = 0;
    this.myModal = null;
    this.participant = null;
    this.role = null;
    this.totalPages = 0;
    this.pagina = 1;
  }
}

const documentSignatureState = new DocumentSignatureState();

export default documentSignatureState;
