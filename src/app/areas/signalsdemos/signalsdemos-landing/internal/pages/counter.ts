import { Component, signal } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';

@Component({
  selector: 'app-home-pages-counter',
  imports: [PageLayout],
  template: `<app-ui-page title="Counter">
    <div>
      <button (click)="decrement()" class="btn btn-circle btn-warning">-</button>
      <span class="text-3xl p-4">{{ current() }}</span>

      <button (click)="increment()" class="btn btn-circle btn-success">+</button>
    </div>
  </app-ui-page>`,
  styles: ``,
})
export class CounterPage {
  // inside of a component, you should use signals for any state. This should be your default.
  // You may use inputs (later), but those should be signals
  // observables (rxjs) are allowed, but we are hopefully migrating away from that.
  // current = signal(42);
  current = signal(0);

  increment() {
    this.current.update((c) => c + 1);
  }

  decrement() {
    this.current.update((c) => c - 1);
  }
}
