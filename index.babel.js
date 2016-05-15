import Renderer from './src/renderer';
import RayTrace from './src/ray-trace';
import CSphere from './src/c-sphere';
import CTriangle from './src/c-triangle';
import {vec3} from 'gl-matrix';

const renderer = new Renderer('c');
const rayTracer = new RayTrace(renderer.x, renderer.y);

// rayTracer.add(new CSphere(vec3.fromValues(0, 0, 0), 1));
rayTracer.add(new CTriangle(vec3.fromValues(1, 1, 0), vec3.fromValues(-1, 0.5, 0), vec3.fromValues(0, 0, 0)));
rayTracer.run();

for (let x = 0; x < rayTracer.x; x++) {
  for (let y = 0; y < rayTracer.y; y++) {
    const color = rayTracer.data[y][x];
    renderer.setPixel(x, y, color[0], color[1], color[2], color[3]);
  }
}

renderer.render();
