import { ColorUtilities } from './color-utilities.class';

describe('getContrastRatio', () => {
  // https://webaim.org/resources/contrastchecker/
  it('returns the same value as WebAIM checker given value - default WebAIM values', () => {
    expect(
      Math.floor(ColorUtilities.getContrastRatio('#0000FF', '#FFFFFF') * 100) /
        100
    ).toEqual(8.59);
  });
  it('returns the same value as WebAIM checker given value - green and red', () => {
    expect(
      Math.floor(ColorUtilities.getContrastRatio('#04FA00', '#FF0036') * 100) /
        100
    ).toEqual(2.76);
  });
});

describe('getColorWithHighestContrastRatio', () => {
  it('returns the light color if the light/background contrast ratio is higher than dark/background', () => {
    expect(
      ColorUtilities.getColorWithHighestContrastRatio(
        '#000000',
        '#ffffff',
        '#0000ff'
      )
    ).toEqual('#ffffff');
  });
  it('returns the dark color if the dark/background contrast ratio is higher than light/background', () => {
    expect(
      ColorUtilities.getColorWithHighestContrastRatio(
        '#000000',
        '#ffffff',
        '#dbdbff'
      )
    ).toEqual('#000000');
  });
});
