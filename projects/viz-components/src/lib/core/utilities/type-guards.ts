export function isDate(x: unknown): x is Date {
  return (
    Object.prototype.toString.call(x) === '[object Date]' && !isNaN(x as number)
  );
}

export function isFunction<T, U = unknown>(
  x: ((y: U) => T) | T
): x is (y: U) => T {
  return typeof x === 'function';
}
