const DocumentSignatureState = {
  pdf: null,
  cropper: null,
  width: 0,
  height: 0,
  myModal: null,
  participant: null,
  role: null,
  totalPages: 0,
  pagina: 1,

  setPage(page) {
    this.pagina = page;
  },

  setTotalPages(total) {
    this.totalPages = total;
  },
};

export default DocumentSignatureState;
