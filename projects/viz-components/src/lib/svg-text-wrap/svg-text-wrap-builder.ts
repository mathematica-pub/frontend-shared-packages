import { VicSvgTextWrapConfig } from './svg-text-wrap-config';

const DEFAULT = {
  _maintainXPosition: false,
  _maintainYPosition: false,
  _lineHeight: 1.1,
};
export class SvgTextWrapBuilder {
  _width: number;
  _maintainXPosition: boolean;
  _maintainYPosition: boolean;
  _lineHeight: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  width(width: number) {
    this._width = width;
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

  build(): VicSvgTextWrapConfig {
    return new VicSvgTextWrapConfig({
      width: this._width,
      maintainXPosition: this._maintainXPosition,
      maintainYPosition: this._maintainYPosition,
      lineHeight: this._lineHeight,
    });
  }
}
