export class HtmlTooltipConfig {
  exists: boolean;
  display: DisplayOptions;
  offset: HtmlTooltipOffset;
  position: HtmlTooltipPosition;

  constructor(init?: Partial<HtmlTooltipConfig>) {
    this.exists = false;
    this.display = 'none';
    this.offset = new HtmlTooltipOffset();
    this.position = new HtmlTooltipPosition();
    Object.assign(this, init);
  }
}

export class HtmlTooltipOffset {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor(init?: Partial<HtmlTooltipOffset>) {
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    Object.assign(this, init);
  }
}

export class HtmlTooltipPosition {
  top: number;
  left: number;

  constructor(init?: Partial<HtmlTooltipPosition>) {
    this.top = 0;
    this.left = 0;
    Object.assign(this, init);
  }
}

export type DisplayOptions = 'none' | 'block';
