export class VicSvgTextWrapConfig {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;

  constructor(options: VicSvgTextWrapConfig) {
    Object.assign(this, options);
  }
}
