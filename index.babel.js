import Renderer from './src/renderer';
import RayTrace from './src/ray-trace';
import CSphere from './src/c-sphere';
import CTriangle from './src/c-triangle';
import Material from './src/material';
import {vec3} from 'gl-matrix';

const renderer = new Renderer('c');
const rayTracer = new RayTrace(renderer.x, renderer.y);

const redMaterial = new Material(vec3.fromValues(1, 0, 0), 1, 0, 0, 0);
const blueMaterial = new Material(vec3.fromValues(0, 0, 1), 1, 0, 0, 0);
const whiteMaterial = new Material(vec3.fromValues(1, 1, 1), 1, 0, 0, 0);
const emmisiveMaterial = new Material(vec3.fromValues(1, 0.90, 0.5), 0, 0, 0, 1);
// rayTracer.add(new CSphere(vec3.fromValues(0, 2, 0), 1, emmisiveMaterial));
const objects = [
  {
    type: CTriangle,
    args: [[-5, 5, 0], [-5, -5, 0], [-5, 5, -10], redMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, -5, 0], [-5, -5, -10], [-5, 5, -10], redMaterial],
  },
  {
    type: CTriangle,
    args: [[5, -5, 0], [5, 5, 0], [5, 5, -10], blueMaterial],
  },
  {
    type: CTriangle,
    args: [[5, -5, -10], [5, -5, 0], [5, 5, -10], blueMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, 5, -10], [-5, -5, -10], [5, 5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, -5, -10], [5, -5, -10], [5, 5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, -5, -10], [-5, -5, 0], [5, -5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, -5, 0], [5, -5, 0], [5, -5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[-5, 5, 0], [-5, 5, -10], [5, 5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[5, 5, 0], [-5, 5, 0], [5, 5, -10], whiteMaterial],
  },
  {
    type: CTriangle,
    args: [[-1, 4.99, -4], [-1, 4.99, -5], [1, 4.99, -5], emmisiveMaterial],
  },
  {
    type: CTriangle,
    args: [[1, 4.99, -4], [-1, 4.99, -4], [1, 4.99, -5], emmisiveMaterial],
  },
  {
    type: CSphere,
    args: [[-2, -3.5, -6], 1.5, whiteMaterial],
  },
  {
    type: CSphere,
    args: [[2, -3.5, -3], 1.5, whiteMaterial],
  },
];
objects.forEach((o) => {
  const args = [];
  o.args.forEach((a) => {
    if (Array.isArray(a)) {
      args.push(vec3.fromValues(a[0], a[1], a[2]));
    } else {
      args.push(a);
    }
  });
  rayTracer.add(new o.type(...args));
});

const count = 3;
let countRendered = 0;

// render and show one by one
// function render() {
//   if (count <= countRendered) {
//     return;
//   }
//   console.log(count);
//   rayTracer.run();
//   const data = rayTracer.getData();
//   for (let x = 0; x < rayTracer.x; x++) {
//     for (let y = 0; y < rayTracer.y; y++) {
//       const color = data[y][x];
//       renderer.setPixel(x, y, color[0], color[1], color[2], 1);
//     }
//   }
//   renderer.render();
//   countRendered += 1;
//   requestAnimationFrame(render);
// }
// render();

// render all and show one
for (let i = 0; i < count; i++) {
  console.log(i);
  rayTracer.run();
}
const data = rayTracer.getData();
for (let x = 0; x < rayTracer.x; x++) {
  for (let y = 0; y < rayTracer.y; y++) {
    const color = data[y][x];
    renderer.setPixel(x, y, color[0], color[1], color[2], 1);
  }
}
renderer.render();

// Download Button

const canvas = document.getElementById('c');
document.getElementById('download-button').href = canvas.toDataURL();
