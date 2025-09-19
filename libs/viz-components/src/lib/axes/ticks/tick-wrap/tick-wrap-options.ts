export interface TickWrapOptions {
  width:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;
}
