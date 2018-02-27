import React, { PureComponent } from 'react';
import * as PIXI from 'pixi.js';
import 'pixi-layers';
import 'pixi-tween';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import Chance from 'chance';

const {
  Application, Graphics, Container, Text, TextStyle, display
} = PIXI;
const chance = new Chance();
const COUNT = 31;

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

const blurFilter1 = new PIXI.filters.BlurFilter();
const blurFilter2 = new PIXI.filters.BlurFilter();
const shadowFilter1 = new DropShadowFilter(0, 0, 0);
blurFilter1.blur = 0;
blurFilter2.blur = 0;

const TypeColors = ['0x999999', '0xb8e986', '0x48d1ae', '0xffb0ba'];

class Heatmap extends PureComponent {
  componentDidMount() {
    const app = new Application({
      width: COUNT * (24 + 2),
      height: COUNT * (24 + 2),
      backgroundColor: 0xffffff
    });
    app.renderer.autoResize = true;
    this.wrapper.appendChild(app.view);

    this.rects = [];
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
          cols[x] = new Container();
        }
        const rect = new Container();
        const roundBox = new Graphics();
        roundBox.beginFill(TypeColors[xData]);
        roundBox.drawRoundedRect(0, 0, 24, 24, 3);
        roundBox.endFill();
        roundBox.x = 0;
        roundBox.y = y * (24 + 2);
        const style = new TextStyle({
          fontSize: 12,
          fill: 'white'
        });
        const message = new Text(`${xData}`, style);
        message.x = roundBox.x + (roundBox.width - message.width) / 2;
        message.y = roundBox.y + (roundBox.height - message.height) / 2;
        rect.addChild(roundBox);
        rect.addChild(message);
        cols[x].addChild(rect);
        this.rects.push(rect);
      });
    });
    for (let index = 0; index < COUNT; index += 1) {
      const col = cols[index];
      col.parentGroup = normalGroup;
      col.x = index * (24 + 2) + col.width / 2;
      col.y = col.height / 2;
      col.pivot.set(col.width / 2, col.height / 2);
      col.interactive = true;
      col.filters = [blurFilter2];
      col.on('click', event => {
        if (this.activeCol) {
          this.activeCol.parentGroup = this.activeCol.oldGroup;
          this.activeCol.filters = [blurFilter2];
        }
        if (this.activeCol !== col) {
          this.activeCol = col;
          col.oldGroup = col.parentGroup;
          col.parentGroup = activeGroup;

          this.activeCol.filters = [shadowFilter1];

          const tween1 = PIXI.tweenManager.createTween(shadowFilter1);
          const tween2 = PIXI.tweenManager.createTween(blurFilter2);
          tween1.from({ blur: 0 }).to({ blur: 6 });
          tween2.from({ blur: 0 }).to({ blur: 10 });
          tween1.time = 500;
          tween2.time = 500;
          tween1.start();
          tween2.start();
        } else {
          this.activeCol = null;
          const tween2 = PIXI.tweenManager.createTween(blurFilter2);
          tween2.from({ blur: 10 }).to({ blur: 0 });
          tween2.time = 500;
          tween2.start();
        }
      });
      app.stage.addChild(col);
    }
    // let count = 0;
    // Listen for animate update and update the tween manager
    app.ticker.add(delta => {
      PIXI.tweenManager.update();

      // count += 0.005;

      // const blurAmount = Math.cos(count);
      // const blurAmount2 = Math.sin(count);

      // blurFilter1.blur = 20 * blurAmount;
      // blurFilter2.blur = 20 * blurAmount2;
    });
  }

  render() {
    return (
      <div
        ref={el => {
          this.wrapper = el;
        }}
      />
    );
  }
}

export default Heatmap;
