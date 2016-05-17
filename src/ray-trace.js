import {vec3, vec2} from 'gl-matrix';
import Ray from './ray';

class RayTrace {
  constructor(width, height) {
    this.x = width;
    this.y = height;
    this.objects = [];
    this._data = [];
    this.data = [];
    this.count = 0;
    this.depthMax = 3;
    this.bgColor = vec3.fromValues(0, 0, 0);
  }

  add(obj) {
    this.objects.push(obj);
  }

  getInteract(ray) {
    let nearInteract = null;
    for (let i = 0; i < this.objects.length; i++) {
      let interact = this.objects[i].isAcross(ray);
      if (interact && (!nearInteract || interact.t < nearInteract.t)) {
        nearInteract = interact;
      }
    }
    return nearInteract;
  }

  getColor(ray, depth) {
    if (depth >= this.depthMax) {
      return null;
    }
    const interact = this.getInteract(ray);
    if (!interact) {
      return this.bgColor;
    }
    let cd = interact.obj.mat.diffuse;
    let cr = interact.obj.mat.reflection;
    let cn = interact.obj.mat.refraction;
    let ce = interact.obj.mat.emmisive;
    const roulette = (cd + cr + cn + ce) * Math.random();
    let type = 'emmisive';
    if (roulette < cd) {
      // diffuse
      type = 'diffuse';
    } else if (roulette < cd + cr) {
      // reflection
      type = 'reflection';
    } else if (roulette < cd + cr + cn) {
      // refraction
      type = 'refraction';
    }
    const colors = {};

    // diffuse
    if (type === 'diffuse') {
      const theta = Math.PI * Math.random();
      const phi = 2 * Math.PI * Math.random();
      let v = vec3.fromValues(
        Math.sin(theta) * Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(theta));
      let vn = vec3.dot(v, interact.normal);
      if (vn < 0) {
        vn = -vn;
        v = vec3.scale(vec3.create(), v, -1);
      }
      const newRay = new Ray();
      newRay.v = v;
      newRay.o = vec3.add(vec3.create(), interact.p, vec3.scale(vec3.create(), v, 0.01));
      let color = this.getColor(newRay, depth + 1);
      if (!color) {
        color = vec3.fromValues(0, 0, 0);
      }
      colors.diffuse = vec3.fromValues(
        color[0] * interact.obj.mat.color[0] * vn,
        color[1] * interact.obj.mat.color[1] * vn,
        color[2] * interact.obj.mat.color[2] * vn);
    } else {
      colors.diffuse = vec3.fromValues(0, 0, 0);
    }

    // reflection
    if (type === 'reflection') {
      const newRay = new Ray();
      newRay.v = vec3.sub(
        vec3.create(),
        ray.v,
        vec3.scale(
          vec3.create(),
          interact.normal,
          2 * vec3.dot(interact.normal, ray.v)));
      newRay.o = vec3.add(vec3.create(), interact.p, vec3.scale(vec3.create(), newRay.v, 0.01));
      let color = this.getColor(newRay, depth);
      if (!color) {
        color = vec3.fromValues(0, 0, 0);
        cr = 0;
      }
      colors.reflection = color;
    } else {
      colors.reflection = vec3.fromValues(0, 0, 0);
    }

    // refraction
    if (type === 'refraction') {
      // TODO
    } else {
      colors.refraction = vec3.fromValues(0, 0, 0);
    }

    // emmisive
    colors.emmisive = interact.obj.mat.color;

    let out;
    if (type === 'emmisive') {
      out = vec3.scale(vec3.create(), colors.emmisive, ce);
    } else {
      out = vec3.scale(vec3.create(), colors[type], cd + cr + cn);
    }
    return out;
  }

  trace(x, y) {
    const r = vec2.fromValues(this.x, this.y);
    const p = vec2.scale(
      vec2.create(),
      vec2.sub(
        vec2.create(),
        vec2.scale(vec2.create(), vec2.fromValues(x, y), 2), r), 1 / Math.min(this.x, this.y));
    const ray = new Ray();
    ray.o = vec3.fromValues(0, 0, 15);
    ray.v = vec3.normalize(vec3.create(), vec3.fromValues(p[0], p[1], -3));
    return this.getColor(ray, 0);
  }

  run() {
    this.count += 1;
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this._data[y] = this._data[y] || [];
        const d = this.trace(x, y);
        if (this._data[y][x]) {
          this._data[y][x] = vec3.add(vec3.create(), this._data[y][x], d);
        } else {
          this._data[y][x] = d;
        }
      }
    }
  }

  resetData() {
    this.count = 0;
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this._data[y] = this._data[y] || [];
        this._data[y][x] = null;
      }
    }
  }

  clamp(vec) {
    return vec3.fromValues(Math.min(Math.max(vec[0], 0), 1), Math.min(Math.max(vec[1], 0), 1), Math.min(Math.max(vec[2], 0), 1));
  }

  getData() {
    const data = [];
    // let sumPower = 0;
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        data[y] = data[y] || [];
        data[y][x] = this.clamp(vec3.scale(vec3.create(), this._data[y][x], 1 / this.count));
        // const power = data[y][x][0] + data[y][x][1] + data[y][x][2];
        // sumPower += power;
      }
    }
    // const avePower = sumPower / (this.x * this.y);
    // const toneMappingFuncExp = Math.log(0.5) / Math.log(avePower);
    // function toneMappingFunc(x) { // 0.0 <= x <= 1.0
    //   return Math.pow(x, toneMappingFuncExp);
    // }
    // for (let x = 0; x < this.x; x++) {
    //   for (let y = 0; y < this.y; y++) {
    //     data[y][x] = vec3.fromValues(toneMappingFunc(data[y][x][0]), toneMappingFunc(data[y][x][1]), toneMappingFunc(data[y][x][2]));
    //   }
    // }
    return data;
  }
}

export default RayTrace;
