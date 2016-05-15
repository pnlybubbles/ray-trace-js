class Intersection {
  constructor(hitPosition, t, normal, object) {
    this.p = hitPosition;
    this.t = t;
    this.normal = normal;
    this.obj = object;
  }
}

export default Intersection;
