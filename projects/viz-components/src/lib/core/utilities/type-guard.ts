export function isNumber(x: unknown): x is number {
  return typeof x === 'number';
}

export function isNumberArray(x: unknown[]): x is number[] {
  return x.every(isNumber);
}

export function isDate(x: unknown): x is Date {
  return (
    Object.prototype.toString.call(x) === '[object Date]' && !isNaN(x as number)
  );
}

export function isFunction<T, U = unknown>(
  x: unknown
): x is (...args: U[]) => T {
  return typeof x === 'function';
}

export function isPrimitiveType<T>(x: unknown): x is T {
  return typeof x !== 'function';
}
