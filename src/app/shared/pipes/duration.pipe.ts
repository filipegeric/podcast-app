import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(valueInSeconds: any, format: 'short' | 'long'): string {
    if (isNaN(valueInSeconds)) {
      return null;
    }
    if (format === 'short') {
      return this.transformShort(valueInSeconds);
    } else {
      return this.transformLong(valueInSeconds);
    }
  }

  transformShort(valueInSeconds: number) {
    return `${Math.floor(valueInSeconds / 60)}:${valueInSeconds % 60}`;
  }

  transformLong(durationInSeconds: number) {
    const durationInMinutes = Math.floor(durationInSeconds / 60);
    const hours = Math.floor(durationInMinutes / 60);
    const seconds = durationInSeconds % 60;
    const minutes = durationInMinutes % 60;
    let result = '';
    if (hours > 0) {
      result += `${hours} h `;
    }
    if (minutes > 0) {
      result += `${minutes} min `;
    }
    if (seconds > 0 && hours === 0) {
      result += `${seconds} s`;
    }
    return result;
  }
}
