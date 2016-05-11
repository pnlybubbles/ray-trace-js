class Renderer {
  constructor(canvasId) {
    this.c = document.getElementById(canvasId);
    this.x = this.c.clientWidth;
    this.y = this.c.clientHeight;
    this.ctx = this.c.getContext('2d');
    this.cData = this.ctx.getImageData(0, 0, this.x, this.y);
  }

  setPixel(x, y, r, g, b, a) {
    const index = (x + y * this.x) * 4;
    this.cData.data[index + 0] = r * 255;
    this.cData.data[index + 1] = g * 255;
    this.cData.data[index + 2] = b * 255;
    this.cData.data[index + 3] = a * 255;
  }

  render() {
    this.ctx.putImageData(this.cData, 0, 0);
  }
}

export default Renderer;
