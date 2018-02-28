import * as PIXI from 'pixi.js';
import 'pixi-layers';
import 'pixi-tween';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import Elem from './Elem';

const { Graphics } = PIXI;

export const RankType = {
  Good: 'excellent',
  Right: 'correct',
  Wrong: 'wrong',
  None: 'missing'
};

function getColorFromType(type) {
  let backgroundColor = 0xededed;
  switch (type) {
    case RankType.Good:
      backgroundColor = 0xb8e986;
      break;
    case RankType.Right:
      backgroundColor = 0x48d1ae;
      break;
    case RankType.Wrong:
      backgroundColor = 0xffb0ba;
      break;
    default:
      break;
  }
  return backgroundColor;
}

class ScoreBox extends Elem {
  constructor(data = {}) {
    super();
    this.elem = new Graphics();
    this.elem.beginFill(getColorFromType(data.type));
    this.elem.drawRoundedRect(0, 0, 24, 24, 4);
    this.elem.endFill();
    this.elem.x = this.x;
    this.elem.y = this.y;
    this.elem.cacheAsBitmap = true;
  }
}

export default ScoreBox;
