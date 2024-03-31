export enum VicOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export enum VicSide {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export interface VicElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface VicDimensions {
  width: number;
  height: number;
}
