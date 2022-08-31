export class LinesHoverEffectDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesHoverEffectDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}
