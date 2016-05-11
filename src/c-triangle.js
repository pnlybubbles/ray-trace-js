import CObject from './c-object';

class CTriangle extends CObject {
  constructor(pos0, pos1, pos2, material) {
    super(material);
    this.pos0 = pos0;
    this.pos1 = pos1;
    this.pos2 = pos2;
  }

  isAcross(ray) {

  }
}

export default CTriangle;
