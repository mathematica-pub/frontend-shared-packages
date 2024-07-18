import { VicTickWrapConfig } from './tick-wrap-config';

export class VicTickWrapBuilder {
  _wrapWidth:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);
  _maintainXPosition: boolean;
  _maintainYPosition: boolean;
  _lineHeight: number;

  wrapWidth(
    wrapWidth:
      | 'bandwidth'
      | number
      | ((chartWidth: number, numOfTicks: number) => number)
  ) {
    this._wrapWidth = wrapWidth;
    return this;
  }

  maintainXPosition(maintainXPosition: boolean) {
    this._maintainXPosition = maintainXPosition;
    return this;
  }

  maintainYPosition(maintainYPosition: boolean) {
    this._maintainYPosition = maintainYPosition;
    return this;
  }

  lineHeight(lineHeight: number) {
    this._lineHeight = lineHeight;
    return this;
  }

  build(): VicTickWrapConfig {
    return new VicTickWrapConfig({
      width: null,
      wrapWidth: this._wrapWidth,
      maintainXPosition: this._maintainXPosition,
      maintainYPosition: this._maintainYPosition,
      lineHeight: this._lineHeight,
    });
  }
}
