import { ResizeChartHeightPipe } from './resize-chart-height.pipe';

describe('ResizeChartHeightPipe', () => {
  let pipe: ResizeChartHeightPipe;

  beforeEach(() => {
    pipe = new ResizeChartHeightPipe();
  });

  it('returns divWidth if divWidth is not a number', () => {
    expect(pipe.transform('divWidth', 100, 100)).toBe('divWidth');
  });

  it('returns the correct value if divWidth is less than maxWidth', () => {
    const result = pipe.transform(100, 300, 200);
    expect(result).toEqual(150);
  });

  it('returns maxHeight if divWidth is greater than or equal to maxWidth', () => {
    const result = pipe.transform(400, 300, 200);
    expect(result).toEqual(300);
  });
});
