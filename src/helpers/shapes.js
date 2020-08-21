class ShapeState {
  constructor() {
    this.init();
  }

  init() {
    this.shapes = [];
  }

  getElementByDataKey(key) {
    return this.shapes.find((shape) => shape.dataKey === key);
  }

  getParticipantByDocument(document) {
    const shape = this.shapes.find((sh) => sh.document === document);

    if (!shape) {
      throw new Error(`Participante com o cpf ${document} não existente`);
    }

    return shape;
  }

  removeParticipantFromShapes(document) {
    return this.shapes.filter((sh) => sh.document !== document);
  }

  emailAlreadyExists(email) {
    const emailExists = this.shapes.some(
      (shape) => shape.text.trim() === email.trim(),
    );

    if (emailExists) {
      throw new Error('E-mail ja informado');
    }
  }
}

const shapeState = new ShapeState();

export default shapeState;
