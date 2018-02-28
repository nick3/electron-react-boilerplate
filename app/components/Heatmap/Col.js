import * as PIXI from 'pixi.js';
import 'pixi-layers';
import 'pixi-tween';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import Elem from './Elem';

const { Container } = PIXI;

class Col extends Elem {
  constructor() {
    super();
    this.elem = new Container();
    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 0;
    this.shadowFilter = new DropShadowFilter(0, 0, 6);
    this.shadowFilter.alpha = 0.75;
    this.elems = [];
    this.elem.interactive = true;
    this.elem.filters = [this.shadowFilter];
  }

  addChild(elem) {
    this.elems.push(elem);
    this.elem.addChild(elem.elem);
  }

  setParentGroup(group) {
    this.oldGroup = this.elem.parentGroup;
    this.elem.parentGroup = group;
  }

  resetParentGroup() {
    this.elem.parentGroup = this.oldGroup;
    this.oldGroup = null;
  }

  setBlur(blur = 0, options = {}) {
    const { time = 10000 } = options;
    const tween = PIXI.tweenManager.createTween(this.blurFilter);
    tween.from().to({ blur });
    tween.time = time;
    tween.start();
  }

  setShadow(blur = 0, options = {}, animate = true) {
    if (animate) {
      const { time = 10000 } = options;
      const tween = PIXI.tweenManager.createTween(this.shadowFilter);
      tween.from().to({ blur, alpha: blur && 1 });
      tween.time = time;
      tween.start();
    } else {
      this.blurFilter.blur = blur;
    }
  }
}

export default Col;
