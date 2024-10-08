import { deepMerge } from './deep-merge';

describe('deepMerge', () => {
  it('should merge two objects without the source overwriting undefined properties on the target', () => {
    const target = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
      },
    };
    const source = {
      b: 5,
      c: {
        e: 6,
      },
    };
    const result = deepMerge(target, source as unknown);
    expect(result).toEqual({
      a: 1,
      b: 5,
      c: {
        d: 3,
        e: 6,
      },
    });
  });
});
