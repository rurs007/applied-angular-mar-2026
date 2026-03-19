import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-resources-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Developer Resources" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([
    {
      title: 'List of Links',
      path: 'list',
    },
    {
      title: 'Add a Link',
      path: 'add',
    },
    {
      title: 'Add a Link Alt',
      path: 'add-2',
    },
  ]);
}
