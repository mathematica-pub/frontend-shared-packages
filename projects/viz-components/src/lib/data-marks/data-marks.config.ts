export class DataMarksConfig {
  data: any[];
  mixBlendMode: string;

  constructor(init?: Partial<DataMarksConfig>) {
    this.mixBlendMode = 'normal';
    Object.assign(this, init);
  }
}

export class TooltipConfig {
  show: boolean;
  type: 'svg' | 'html';

  constructor(init?: Partial<TooltipConfig>) {
    this.show = false;
    this.type = 'svg';
    Object.assign(this, init);
  }
}

export type PatternPredicates = Map<string, (d: any) => boolean>;
