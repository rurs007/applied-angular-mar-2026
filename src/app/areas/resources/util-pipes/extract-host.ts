import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractHost',
  standalone: true,
})
export class ExtractHostPipe implements PipeTransform {
  transform(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname || '';
      // Remove 'www.' prefix if present and get the domain name
      return hostname.replace(/^www\./, '').split('.')[0];
    } catch {
      return url;
    }
  }
}
