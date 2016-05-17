import {vec3} from 'gl-matrix';
import CObject from './c-object';
import Intersection from './intersection';

class CSphere extends CObject {
  constructor(pos, r, material) {
    super(material);
    this.pos = pos;
    this.r = r;
  }

  isAcross(ray) {
    const oc = vec3.sub(vec3.create(), ray.o, this.pos);
    const oclen = vec3.sqrLen(oc);
    const voc = vec3.dot(ray.v, oc);
    const d = Math.pow(voc, 2) - oclen + Math.pow(this.r, 2);
    if (d < 0) {
      return null;
    }
    const t = -voc - Math.sqrt(d);
    if (t <= 0) {
      return null;
    }
    const p = vec3.add(
      vec3.create(),
      ray.o,
      vec3.scale(vec3.create(), ray.v, t));
    const normal = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), p, this.pos));
    return new Intersection(p, t, normal, this);
  }
}

export default CSphere;
