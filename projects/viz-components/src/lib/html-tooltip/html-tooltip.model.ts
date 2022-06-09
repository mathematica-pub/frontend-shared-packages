export class HtmlTooltipConfig {
  exists: boolean;
  display: DisplayOptions;
  offset: HtmlTooltipOffset;
  position: HtmlTooltipPosition;

  constructor() {
    this.exists = false;
    this.display = 'none';
    this.offset = new HtmlTooltipOffset();
    this.position = new HtmlTooltipPosition();
  }
}

export class HtmlTooltipOffset {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor() {
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }
}

export class HtmlTooltipPosition {
  top: number;
  left: number;

  constructor() {
    this.top = 0;
    this.left = 0;
  }
}

export type DisplayOptions = 'none' | 'block';
