export const ControlPage = () => {
  return `
  <div class="text-center" style="margin-bottom: 15px" id="controlPage">
    <div class="btn-group">
      <button type="button" class="btn btn-white" id="previousBtn">
        <i class="fa fa-long-arrow-left"></i>
        <span class="d-sm-inline">Anterior</span>
      </button>
      <button type="button" class="btn btn-white" id="nextBtn">
        <i class="fa fa-long-arrow-right"></i>
        <span class="d-sm-inline">Próximo</span>
      </button>
      <span class="btn btn-white">Página: </span>
      <div class="input-group" style="position: relative; display: flex;">
        <input
          type="number"
          class="form-control"
          min="1"
          id="numPage"
          style="width: 35% !important"
        />
        <div style="display: flex; margin-left: -1px;">
          <button type="button" class="btn btn-white page-count">
            / 2
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xs-12 canvas-content">
    <div class="fallback-font-canvas">.</div>
    <canvas id="pdfcanvas" width="55%" height="55%"></canvas>
  </div>
  `;
};
