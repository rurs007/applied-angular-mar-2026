import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-signalsdemos-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Signals" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([{ path: 'counter', title: 'Counter UI' }]);
}
