class StructureSubscribers {
  constructor() {
    this.init();
  }

  init() {
    this.subscribers = {};
  }

  addSubscriber(id, x, y, page, name) {
    this.subscribers[`sub_${id}`] = { coordinates: { x, y }, page, name };
  }

  removeSubscriber(id) {
    delete this.subscribers[`sub_${id}`];
  }

  getSubscribersByPage(page) {
    return Object.keys(this.subscribers)
      .filter((c) => this.subscribers[c].page === page)
      .map((p) => this.subscribers[p]);
  }

  getNameSubscriber(id) {
    return this.subscribers[`sub_${id}`].name;
  }

  resetCoordinatesAndPage() {
    Object.keys(this.subscribers).map((s) => {
      this.subscribers[s].page = 0;
      this.subscribers[s].x = 0;
      this.subscribers[s].y = 0;
      return s;
    });
  }

  changeCoordinates(id, x, y, page) {
    this.subscribers[`sub_${id}`].coordinates.x = x;
    this.subscribers[`sub_${id}`].coordinates.y = y;
    this.subscribers[`sub_${id}`].page = page;
  }
}

const structureSubscribers = new StructureSubscribers();

export default structureSubscribers;
