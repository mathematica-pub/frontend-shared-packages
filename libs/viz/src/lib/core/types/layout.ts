export enum Orientation {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export enum Side {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export interface ElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
