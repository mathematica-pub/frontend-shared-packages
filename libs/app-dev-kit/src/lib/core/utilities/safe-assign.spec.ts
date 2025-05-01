/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeAssign } from './safe-assign';

describe('applyDefaultsSafely', () => {
  it('should apply defaults to the target object', () => {
    const target = { a: 1, b: 2 };
    const defaults = { b: 3, c: 4 };

    safeAssign(target, defaults);

    expect(target).toEqual({ a: 1, b: 2, c: 4 } as any);
  });

  it('should not overwrite existing function properties', () => {
    const target = { a: () => 'existing', b: 2 };
    const defaults = { a: () => 'new', b: 3 };

    safeAssign(target, defaults);

    expect(target.a()).toBe('existing');
    expect(target.b).toBe(2);
  });

  it('should handle empty defaults', () => {
    const target = { a: 1, b: 2 };
    const defaults = {};

    safeAssign(target, defaults);

    expect(target).toEqual({ a: 1, b: 2 });
  });

  it('should handle empty target', () => {
    const target = {};
    const defaults = { a: 1, b: 2 };

    safeAssign(target, defaults);

    expect(target).toEqual({ a: 1, b: 2 });
  });
});
