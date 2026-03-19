import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-books-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Books" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([{ title: 'List of Books', path: 'list' }]);
}
