class RayTrace {
  constructor(width, height) {
    this.x = width;
    this.y = height;
    this.objects = [];
    this.data = [];
  }

  add(obj) {
    this.objects.push(obj);
  }

  trace(x, y) {
    return [x / this.x, y / this.y, (x + y) / (this.x + this.y), 1];
  }

  run() {
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this.data[y] = this.data[y] || [];
        this.data[y][x] = this.trace(x, y);
      }
    }
  }
}

export default RayTrace;
