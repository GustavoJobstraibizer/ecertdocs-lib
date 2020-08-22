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

  getParticipants() {
    return this.shapes.map((shape) => {
      return {
        email: shape.text,
        document: shape.document,
        role: shape.role,
        posX: parseInt(shape.x),
        posY: parseInt(shape.y),
        tipo: shape.tipo,
        largura: parseInt(shape.width),
        altura: parseInt(shape.height),
        ordem: parseInt(shape.order),
        pagina: parseInt(shape.page),
      };
    });
  }
}

const shapeState = new ShapeState();

export default shapeState;
