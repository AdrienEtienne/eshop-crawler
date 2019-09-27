import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class BooleanPipe implements PipeTransform {
  constructor(private readonly options: { defaultValue?: boolean } = {}) {}

  async transform(value?: string) {
    const { defaultValue = false } = this.options;
    let result = defaultValue;
    if (!value) {
      return result;
    }
    if (value === '1' || value.toLowerCase() === 'true') {
      result = true;
    } else if (value === '0' || value.toLowerCase() === 'false') {
      result = false;
    }
    return result;
  }
}
