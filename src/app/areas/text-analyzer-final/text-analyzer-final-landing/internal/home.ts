import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-text-analyzer-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Text Analyzer" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([
    { path: 'analyze', title: 'Analyzer' },
    { path: 'settings', title: 'Settings' },
    { path: 'history', title: 'History' },
  ]);
}
