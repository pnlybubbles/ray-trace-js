import CObject from './c-object';
import Intersection from './intersection';
import {vec3} from 'gl-matrix';

class CTriangle extends CObject {
  constructor(pos0, pos1, pos2, material) {
    super(material);
    this.pos0 = pos0;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.n = vec3.normalize(
      vec3.create(),
      vec3.cross(
        vec3.create(),
        vec3.sub(vec3.create(), this.pos1, this.pos0),
        vec3.sub(vec3.create(), this.pos2, this.pos0)));
    console.log(this.n);
  }

  isAcross(ray) {
    const vn = vec3.dot(ray.v, this.n);
    if (vn === 0) {
      return null;
    }
    const t = vec3.dot(vec3.sub(vec3.create(), this.pos0, ray.o), this.n) / vn;
    if (t < 0) {
      return null;
    }
    const p = vec3.add(vec3.create(), ray.o, vec3.scale(vec3.create(), ray.v, t));
    const c0 = vec3.cross(
      vec3.create(),
      vec3.sub(vec3.create(), this.pos1, this.pos0),
      vec3.sub(vec3.create(), p, this.pos0));
    if (vec3.dot(c0, this.n) < 0) {
      return null;
    }
    const c1 = vec3.cross(
      vec3.create(),
      vec3.sub(vec3.create(), this.pos2, this.pos1),
      vec3.sub(vec3.create(), p, this.pos1));
    if (vec3.dot(c1, this.n) < 0) {
      return null;
    }
    const c2 = vec3.cross(
      vec3.create(),
      vec3.sub(vec3.create(), this.pos0, this.pos2),
      vec3.sub(vec3.create(), p, this.pos2));
    if (vec3.dot(c2, this.n) < 0) {
      return null;
    }
    return new Intersection(p, this.n, vec3.fromValues(1, 1, 1));
  }
}

export default CTriangle;
