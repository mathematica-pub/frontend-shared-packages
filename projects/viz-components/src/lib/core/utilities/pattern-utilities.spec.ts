/* eslint-disable @typescript-eslint/no-explicit-any */
import { FillDef } from '../../fill-defs/fill-def';
import { PatternUtilities } from './pattern-utilities';

describe('PatternUtilities', () => {
  describe('integration: getPatternFill', () => {
    const predicates: FillDef<any>[] = [
      { name: 'pattern', useDef: (d: number) => d > 2 },
    ];
    it('returns pattern when predicate is true', () => {
      const output = PatternUtilities.getFill(3, 'blue', predicates);
      expect(output).toBe('url(#pattern)');
    });

    it('returns default color when predicate is false', () => {
      const output = PatternUtilities.getFill(2, 'blue', predicates);
      expect(output).toBe('blue');
    });

    it('returns default color when no predicates exist', () => {
      const output = PatternUtilities.getFill(3, 'blue', undefined);
      expect(output).toBe('blue');
    });
  });
});
