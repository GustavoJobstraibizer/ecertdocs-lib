const shapeState = {
  shapes: [],

  getElementByDataKey(key) {
    return this.shapes.find((shape) => shape.dataKey === key);
  },
};

export default shapeState;
