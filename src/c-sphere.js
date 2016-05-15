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
    const ac = vec3.sub(vec3.create(), ray.o, this.pos);
    const aclen = vec3.sqrLen(ac);
    const vac = vec3.dot(ray.v, ac);
    const d = Math.pow(vac, 2) - vec3.sqrLen(ray.v) * (aclen - Math.pow(this.r, 2));
    if (d < 0) {
      return null;
    }
    const hitPos = vec3.add(
      vec3.create(),
      ray.o,
      vec3.scale(vec3.create(), ray.v, (-vac - Math.sqrt(d)) / aclen));
    const normal = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), hitPos, this.pos));
    return new Intersection(hitPos, normal, vec3.fromValues(1, 1, 1));
  }
}

export default CSphere;
