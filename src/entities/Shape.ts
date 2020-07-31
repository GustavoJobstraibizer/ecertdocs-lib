export class Shape {
  x: number = 0;
  y: number = 0;
  width: number = 100;
  height: number = 30;
  fill: string = "#800080";
  text: string = "";
  order: string = "";
  document: string = "";
  tipo: string = "";
  role: string = "";
  page: string = "indefinida";
  font: string = "20px Georgia";
  isDragging: boolean = false;
  isOK: boolean = false;
  dataKey: string = this.order;
  id: string = this.generateId();
  name: string = "";

  constructor(email: string, order: string, document: string, name: string) {
    this.text = email;
    this.order = order;
    this.document = document;
    this.name = name;
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
