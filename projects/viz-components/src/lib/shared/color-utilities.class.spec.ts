import { VicColorUtilities } from './color-utilities.class';

describe('getContrastRatio', () => {
  // https://webaim.org/resources/contrastchecker/
  it('returns the same value as WebAIM checker given value - default WebAIM values', () => {
    expect(
      Math.floor(
        VicColorUtilities.getContrastRatio('#0000FF', '#FFFFFF') * 100
      ) / 100
    ).toEqual(8.59);
  });
  it('returns the same value as WebAIM checker given value - green and red', () => {
    expect(
      Math.floor(
        VicColorUtilities.getContrastRatio('#04FA00', '#FF0036') * 100
      ) / 100
    ).toEqual(2.76);
  });
  it('works with rgb values', () => {
    expect(
      Math.floor(
        VicColorUtilities.getContrastRatio(
          'rgb(0, 0, 255)',
          'rgb(255, 255, 255)'
        ) * 100
      ) / 100
    ).toEqual(8.59);
  });
  it('works with named colors', () => {
    expect(
      Math.floor(VicColorUtilities.getContrastRatio('blue', 'white') * 100) /
        100
    ).toEqual(8.59);
  });
  it('works with hsl values', () => {
    expect(
      Math.floor(
        VicColorUtilities.getContrastRatio(
          'hsl(240, 100%, 50%)',
          'hsl(0, 0%, 100%)'
        ) * 100
      ) / 100
    ).toEqual(8.59);
  });
});
