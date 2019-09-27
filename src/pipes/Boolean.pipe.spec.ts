import { BooleanPipe } from './Boolean.pipe';

describe('Page Items Pipe', () => {
  let pipe: BooleanPipe;

  it('should return true', async () => {
    pipe = new BooleanPipe();
    expect(await pipe.transform('1')).toBeTruthy();
    expect(await pipe.transform('true')).toBeTruthy();
    expect(await pipe.transform('TRUE')).toBeTruthy();
  });

  it('should return passed value', async () => {
    pipe = new BooleanPipe();
    expect(await pipe.transform()).toBeFalsy();
    expect(await pipe.transform('a')).toBeFalsy();
    expect(await pipe.transform('0')).toBeFalsy();
    expect(await pipe.transform('false')).toBeFalsy();
    expect(await pipe.transform('FALSE')).toBeFalsy();
  });

  describe('defaultValue', () => {
    it('should return true', async () => {
      pipe = new BooleanPipe({ defaultValue: true });
      expect(await pipe.transform()).toBeTruthy();
    });
  });
});
