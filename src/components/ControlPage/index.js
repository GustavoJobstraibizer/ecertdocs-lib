const ControlPage = (pdfCanvas) =>
  `
  <div style="max-width: 620px;
  margin: 0 auto;
">
    <div class="content-header-modal-document">
      <button type="button" class="btn btn__primary" id="btnSelectAreaSignature">Selecionar área</button>
    </div>
    <div class="text-center" style="margin-bottom: 15px" id="controlPage">
      <div class="btn-group">
        <button type="button" class="btn btn__white btn--sm" id="previousBtn">
          <i class="fa fa-long-arrow-left"></i>
          <span class="d-sm-inline">&#11013;&nbsp;&nbsp;Anterior</span>
        </button>
        <button type="button" class="btn btn__white btn--sm" id="nextBtn">
          <i class="fa fa-long-arrow-right"></i>
          <span class="d-sm-inline">Próximo&nbsp;&nbsp;&#10145;</span>
        </button>
        <span class="btn btn__white btn--sm">Página: </span>
        <div class="input-group" style="position: relative; display: flex;">
          <input
            type="number"
            class="form-control"
            min="1"
            id="numPage"
            style="width: 35% !important"
          />
          <div style="display: flex; margin-left: -1px;">
            <button type="button" class="btn btn__white page-count">
              / 2
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 canvas-content">
      <div class="fallback-font-canvas">.</div>
      ${pdfCanvas}
    </div>
  </div>
`;

export default ControlPage;
