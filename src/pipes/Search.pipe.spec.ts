import { SearchPipe } from './Search.pipe';

describe('Search Pipe', () => {
  let pipe: SearchPipe;

  it('should return values', async () => {
    pipe = new SearchPipe();
    const result = await pipe.transform('The Legend Of Zelda');
    expect(result.search).toBe('The Legend Of Zelda');
    expect(result.words).toStrictEqual(['legend', 'zelda']);
  });
});
