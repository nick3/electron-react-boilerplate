import * as PIXI from 'pixi.js';
import 'pixi-tween';

class Elem {
  elem = null;
  x = 0;
  y = 0;
  moveTo(x = this.x, y = this.y, options = {}, animate = true) {
    const { time = 10000 } = options;
    if (this.elem) {
      if (animate) {
        const tween = PIXI.tweenManager.createTween(this.elem);
        tween.from().to({ x, y });
        tween.time = time;
        tween.start();
        // return tween;
      }
      this.elem.x = x;
      this.elem.y = y;
    }
    this.x = x;
    this.y = y;
  }
}

export default Elem;
