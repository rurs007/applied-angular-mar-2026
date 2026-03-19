import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractHost',
  standalone: true,
})
export class ExtractHostPipe implements PipeTransform {
  transform(url: string, titleCase = false): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname || '';
      const name = hostname.replace(/^www\./, '').split('.')[0];
      return titleCase ? name.charAt(0).toUpperCase() + name.slice(1) : name;
    } catch {
      return url;
    }
  }
}
