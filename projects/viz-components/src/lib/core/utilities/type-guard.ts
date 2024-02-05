export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isNumbers(value: unknown[]): value is number[] {
  return value.every(isNumber);
}

export function isDate(value: unknown): value is Date {
  return (
    Object.prototype.toString.call(value) === '[object Date]' &&
    !isNaN(value as number)
  );
}
