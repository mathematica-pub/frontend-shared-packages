import { isDate } from './type-guard';

describe('isDate', () => {
  it('returns true if input is a date', () => {
    const result = isDate(new Date());
    expect(result).toEqual(true);
  });

  it('returns false if input is a string', () => {
    const result = isDate('hello');
    expect(result).toEqual(false);
  });

  it('returns false if input is a number', () => {
    const result = isDate(234567);
    expect(result).toEqual(false);
  });

  it('returns false if input is 0', () => {
    const result = isDate(0);
    expect(result).toEqual(false);
  });

  it('returns false if input is an object that is not a date', () => {
    const result = isDate({ hello: 'world' });
    expect(result).toEqual(false);
  });

  it('returns false if input is null', () => {
    const result = isDate(null);
    expect(result).toEqual(false);
  });

  it('returns false if input is undefined', () => {
    const result = isDate(undefined);
    expect(result).toEqual(false);
  });

  it('returns false if input is an array', () => {
    const result = isDate([]);
    expect(result).toEqual(false);
  });

  it('returns false if input is a boolean', () => {
    const result = isDate(true);
    expect(result).toEqual(false);
  });

  it('returns false if input is a function', () => {
    const result = isDate(() => {
      return;
    });
    expect(result).toEqual(false);
  });
});
