import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-text-analyzer-final-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Text Analyzer Final" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([]);
}
