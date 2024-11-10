/* eslint-disable @typescript-eslint/no-explicit-any */
import { FillUtilities } from './fill-utilities';

describe('FillUtilities', () => {
  describe('integration: getFill', () => {
    const predicates: FillDef<any>[] = [
      { defId: 'pattern', shouldApply: (d: number) => d > 2 },
    ];
    it('returns pattern when predicate is true', () => {
      const output = FillUtilities.getFill(3, 'blue', predicates);
      expect(output).toBe('url(#pattern)');
    });

    it('returns default color when predicate is false', () => {
      const output = FillUtilities.getFill(2, 'blue', predicates);
      expect(output).toBe('blue');
    });

    it('returns default color when no predicates exist', () => {
      const output = FillUtilities.getFill(3, 'blue', undefined);
      expect(output).toBe('blue');
    });
  });
});
