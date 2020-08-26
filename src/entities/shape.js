/* eslint class-methods-use-this: ["error", { "exceptMethods": ["_generateId"] }] */
import shapeState from './shapes';

class Shape {
  x = 0;
  y = 0;
  width = 100;
  height = 30;
  fill = '#800080';
  text = '';
  order;
  document = '';
  tipo = '';
  role = '';
  page = 'indefinida';
  font = '20px Georgia';
  isDragging = false;
  isOK = false;
  dataKey = this.order;
  id = this._generateId();

  constructor(email, document, name, role, tipoAssinatura = 1) {
    debugger;
    const order = shapeState.shapes.length
      ? Math.max.apply(
          Math,
          shapeState.shapes.map((shape) => shape.order + 1),
        )
      : 1;

    this.text = email;
    this.order = order;
    this.document = document;
    this.name = name;
    this.dataKey = order;
    this.role = role;
    this.tipo = tipoAssinatura === 1 ? 'ELETRONICA' : 'DIGITAL';
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default Shape;
