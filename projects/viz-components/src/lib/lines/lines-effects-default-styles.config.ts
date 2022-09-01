export class LinesHoverAndMoveEffectDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesHoverAndMoveEffectDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}
