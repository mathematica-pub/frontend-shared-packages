/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Safely assigns properties from a source object to a target object.
 *
 * Copies all own, enumerable properties from `source` to `target`,
 * except when the target already has a property of the same name that is a function.
 *
 * Logs a warning for each skipped property if `logConflicts` is true.
 *
 * @template TTarget The type of the target object.
 * @template TSource The type of the source object.
 * @param target The object to assign properties to.
 * @param source The object providing properties to assign.
 * @param logConflicts If true, logs when a method/property on the target prevents assignment. Default is false.
 *
 * @example
 * safeAssign(this, { log: 'hello' }, true);
 */
export function safeAssign<TTarget extends object, TDefaults extends object>(
  target: TTarget,
  defaults: TDefaults,
  logConflicts: boolean = false
): void {
  for (const key of Object.keys(defaults)) {
    const existing = (target as any)[key];
    const incoming = (defaults as any)[key];

    if (typeof existing === 'function') {
      if (logConflicts) {
        console.warn(
          `safeAssign: Skipped assignment for key "${key}" because it would overwrite an existing method.`
        );
      }
      continue;
    }

    (target as any)[key] = incoming;
  }
}
