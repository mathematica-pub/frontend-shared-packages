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
});
