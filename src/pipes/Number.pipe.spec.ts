import { NumberPipe } from './Number.pipe';

describe('Number Pipe', () => {
  let pipe: NumberPipe;

  it('should return number value', async () => {
    pipe = new NumberPipe();
    expect(await pipe.transform('1')).toEqual(1);
    expect(await pipe.transform('0')).toEqual(0);
  });

  it('should return default value', async () => {
    pipe = new NumberPipe({ defaultValue: 1 });
    expect(await pipe.transform('a')).toEqual(1);
    expect(await pipe.transform()).toEqual(1);
    expect(await pipe.transform('')).toEqual(1);
  });

  describe('min', () => {
    it('should return min value if too low', async () => {
      pipe = new NumberPipe({ min: 1 });
      expect(await pipe.transform('0')).toEqual(1);
    });
  });

  describe('max', () => {
    it('should return max if too high', async () => {
      pipe = new NumberPipe({ defaultValue: 1, max: 3 });
      expect(await pipe.transform('4')).toEqual(3);
    });
  });
});
