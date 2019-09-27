import { PipeTransform, Injectable } from '@nestjs/common';
import { toNumber } from 'lodash';

@Injectable()
export class NumberPipe implements PipeTransform {
  constructor(
    private readonly options: {
      defaultValue?: number;
      max?: number;
      min?: number;
    } = {},
  ) {}

  async transform(value?: string) {
    const { defaultValue, max, min } = this.options;
    let result = defaultValue;
    if (!value || isNaN(toNumber(value))) {
      return result;
    }

    const tmp = toNumber(value);
    if (min !== undefined && min > tmp) {
      return min;
    } else if (max !== undefined && max < tmp) {
      return max;
    }

    result = tmp;

    return result;
  }
}
