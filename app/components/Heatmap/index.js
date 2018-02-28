import React, { PureComponent } from 'react';
import * as PIXI from 'pixi.js';
import 'pixi-layers';
import 'pixi-tween';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import Chance from 'chance';
import ScoreBox, { RankType } from './ScoreBox';
import Col from './Col';

const {
  Application, Graphics, Container, Text, TextStyle, display
} = PIXI;
const chance = new Chance();
const COUNT = 30;
const Types = [RankType.Good, RankType.Right, RankType.Wrong, RankType.None];
const DATAS = (() => {
  const a = [];
  for (let m = 0; m < COUNT; m += 1) {
    const b = [];
    for (let n = 0; n < COUNT; n += 1) {
      b.push(chance.integer({ min: 0, max: 3 }));
    }
    a.push(b);
  }
  return a;
})();

class Heatmap extends PureComponent {
  componentDidMount() {
    this.tweens = [];
    const app = new Application({
      width: 2 + COUNT * (24 + 2),
      height: 2 + COUNT * (24 + 2),
      backgroundColor: 0xffffff
    });
    app.renderer.autoResize = true;
    this.wrapper.appendChild(app.view);

    // let count = 0;
    // Listen for animate update and update the tween manager
    app.ticker.add(delta => {
      PIXI.tweenManager.update(delta);
    });
    const cols = {};
    const normalGroup = new display.Group(0, false);
    const activeGroup = new display.Group(1, false);
    app.stage = new display.Stage();
    app.stage.group.enableSort = true;
    app.stage.addChild(new display.Layer(normalGroup));
    app.stage.addChild(new display.Layer(activeGroup));
    DATAS.forEach((yData, y) => {
      yData.forEach((xData, x) => {
        if (!cols[x]) {
          cols[x] = new Col();
          app.stage.addChild(cols[x].elem);
        }
        // const rect = new Container();
        const roundBox = new ScoreBox({
          type: Types[xData]
        });
        cols[x].addChild(roundBox);
      });
    });

    for (let index = 0; index < COUNT; index += 1) {
      const col = cols[index];
      col.setParentGroup(normalGroup);
      col.moveTo(2 + index * (24 + 2) + col.elem.width / 2, 2 + col.elem.height / 2);
      col.elem.pivot.set(col.elem.width / 2, col.elem.height / 2);
      col.elem.on('click', event => {
        if (this.activeCol) {
          this.activeCol.resetParentGroup();
        }
        if (this.activeCol !== col) {
          this.activeCol = col;
          col.setParentGroup(activeGroup);

          for (let i = 0; i < COUNT; i += 1) {
            const c = cols[i];
            if (c !== col) {
              c.setShadow(0);
              c.setBlur(10);
            } else {
              c.setShadow(6);
              c.setBlur(0);
            }
          }
        } else {
          this.activeCol = null;

          for (let i = 0; i < COUNT; i += 1) {
            const c = cols[i];
            if (c !== col) {
              c.setShadow(0);
              c.setBlur(0);
            } else {
              c.setShadow(0);
            }
          }
        }
      });
      let tween,
        tween1,
        firstTween;
      col.elems.forEach((box, y) => {
        tween1 = box.moveTo(box.x, y * (24 + 2));
        if (tween) {
          tween.chain(tween1);
        }
        if (!firstTween) {
          firstTween = tween1;
        }
        tween = tween1;
      });
      this.tweens.push(firstTween);
    }
  }

  start = () => {
    this.tweens.forEach(t => t.start());
  };

  render() {
    return (
      <div
        ref={el => {
          this.wrapper = el;
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: 100,
            left: 100
          }}
          onClick={this.start}
        >
          START
        </button>
      </div>
    );
  }
}

export default Heatmap;
