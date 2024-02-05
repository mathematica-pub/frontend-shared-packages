import { DateUtilities } from './is-date';

describe('DateUtilities.isDate()', () => {
  it('returns true if input is a date', () => {
    const result = DateUtilities.isDate(new Date());
    expect(result).toEqual(true);
  });

  it('returns false if input is a string', () => {
    const result = DateUtilities.isDate('hello');
    expect(result).toEqual(false);
  });

  it('returns false if input is a number', () => {
    const result = DateUtilities.isDate(234567);
    expect(result).toEqual(false);
  });

  it('returns false if input is 0', () => {
    const result = DateUtilities.isDate(0);
    expect(result).toEqual(false);
  });

  it('returns false if input is an object that is not a date', () => {
    const result = DateUtilities.isDate({ hello: 'world' });
    expect(result).toEqual(false);
  });

  it('returns false if input is null', () => {
    const result = DateUtilities.isDate(null);
    expect(result).toEqual(false);
  });

  it('returns false if input is undefined', () => {
    const result = DateUtilities.isDate(undefined);
    expect(result).toEqual(false);
  });

  it('returns false if input is an array', () => {
    const result = DateUtilities.isDate([]);
    expect(result).toEqual(false);
  });

  it('returns false if input is a boolean', () => {
    const result = DateUtilities.isDate(true);
    expect(result).toEqual(false);
  });

  it('returns false if input is a function', () => {
    const result = DateUtilities.isDate(() => {
      return;
    });
    expect(result).toEqual(false);
  });
});
