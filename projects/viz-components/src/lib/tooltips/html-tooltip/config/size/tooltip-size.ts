export class HtmlTooltipSize {
  width: number | string;
  height: number | string;
  minWidth: number | string;
  minHeight: number | string;
  maxWidth: number | string;
  maxHeight: number | string;

  constructor(options: HtmlTooltipSize) {
    Object.assign(this, options);
  }
}
