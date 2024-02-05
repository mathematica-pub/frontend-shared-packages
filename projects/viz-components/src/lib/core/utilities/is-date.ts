export class DateUtilities {
  static isDate(x: unknown): boolean {
    return (
      Object.prototype.toString.call(x) === '[object Date]' &&
      !isNaN(x as number)
    );
  }
}
