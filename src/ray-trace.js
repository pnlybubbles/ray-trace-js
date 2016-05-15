import {vec3, vec2} from 'gl-matrix';
import Ray from './ray';

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
    const r = vec2.fromValues(this.x, this.y);
    const p = vec2.scale(
      vec2.create(),
      vec2.sub(
        vec2.create(),
        vec2.scale(vec2.create(), vec2.fromValues(x, y), 2), r), 1 / Math.min(this.x, this.y));
    const ray = new Ray();
    ray.o = vec3.fromValues(0, 0, 5);
    ray.v = vec3.normalize(vec3.create(), vec3.fromValues(p[0], p[1], -1));
    let realInteract = null;
    for (let i = 0; i < this.objects.length; i++) {
      let interact = this.objects[i].isAcross(ray);
      if (!realInteract || vec3.sqrLen(interact.hitPos) < vec3.sqrLen(realInteract.hitPos)) {
        realInteract = interact;
      }
    }
    if (realInteract) {
      return [realInteract.color[0], realInteract.color[1], realInteract.color[2], 1];
    } else {
      return [0, 0, 0, 1];
    }
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
