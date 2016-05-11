import Renderer from './src/renderer';
import RayTrace from './src/ray-trace';

const renderer = new Renderer('c');
const rayTracer = new RayTrace(renderer.x, renderer.y);

rayTracer.run();

for (let x = 0; x < rayTracer.x; x++) {
  for (let y = 0; y < rayTracer.y; y++) {
    const color = rayTracer.data[x][y];
    renderer.setPixel(x, y, color[0], color[1], color[2], color[3]);
  }
}

renderer.render();
