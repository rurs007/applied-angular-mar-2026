import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'ht-pomodoro-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: `<app-ui-section-layout title="Pomodoro" [links]="links()" />`,
  styles: ``,
})
export class Home {
  links = signal<SectionLink[]>([
    { path: 'timer', title: 'Timer' },
    { path: 'prefs', title: 'Settings' },
  ]);
}
