/* eslint class-methods-use-this: ["error", { "exceptMethods": ["_generateId"] }] */

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

  constructor(email, order, document, name) {
    this.text = email;
    this.order = order;
    this.document = document;
    this.name = name;
    this.dataKey = order;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default Shape;
