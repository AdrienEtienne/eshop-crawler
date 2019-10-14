import { PipeTransform, Injectable } from '@nestjs/common';
import { toNumber } from 'lodash';

export interface SearchPipeResult {
  search: string;
  words: string[];
}

@Injectable()
export class SearchPipe implements PipeTransform {
  constructor(private readonly options: {} = {}) {}

  async transform(search: string = ''): Promise<SearchPipeResult> {
    let words: string[] = search.toLowerCase().split(' ');
    words = words.filter(word => word.length > 2);
    words = words.filter(word => word !== 'the');

    return {
      search,
      words,
    };
  }
}
