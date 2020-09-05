import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: unknown, length: number = 40): string {
    if (typeof value !== 'string') {
      return null;
    }
    if (value.length <= length) {
      return value;
    }
    return value.substring(0, length).trim() + '...';
  }
}
