import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';

@Component({
  selector: 'ht-pomodoro-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout],
  template: `<app-ui-page title="Pomodoro"></app-ui-page>`,
  styles: ``,
})
export class HomePage {}
