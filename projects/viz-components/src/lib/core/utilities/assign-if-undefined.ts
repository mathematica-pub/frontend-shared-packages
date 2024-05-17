import { isObject } from './type-guards';

export function assignValueIfPropertyIsUndefined(obj, key, value) {
  if (obj[key] === undefined) {
    obj[key] = value;
  }
}

export function assignValuesIfUndefined<T extends Record<string, any>>(
  original: T | Partial<T>,
  defaults: Partial<T>
): void {
  Object.entries(defaults).forEach(([key, value]) => {
    if (isObject(value)) assignValuesIfUndefined(original[key], value);
    assignValueIfPropertyIsUndefined(original, key, value);
  });
}
