export interface TickWrapOptions {
  wrapWidth:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;
}
