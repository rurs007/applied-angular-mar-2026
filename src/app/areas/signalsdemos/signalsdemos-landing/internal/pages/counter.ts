import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { counterStore } from '../counter-store';
import { FizzBuzz } from '../fizz-buzz';

@Component({
  selector: 'app-home-pages-counter',
  // this service should be created fresh every time you create this
  // component, and should be destroyed when you destroy this component
  providers: [],
  imports: [PageLayout, FizzBuzz],
  template: `<app-ui-page title="Counter">
    <div>
      <button
        [disabled]="store.decrementShouldBeDisabled()"
        (click)="store.decrement()"
        class="btn btn-circle btn-warning"
      >
        -
      </button>
      <span class="text-3xl p-4">{{ store.current() }}</span>

      <button (click)="store.increment()" class="btn btn-circle btn-success">+</button>
    </div>
    <div class="p-4 flex flex-row items-center justify-center text-2xl gap-2">
      {{ emoji() }}
    </div>
    <div class="p-8">
      <button
        [disabled]="store.resetShouldBeDisabled()"
        (click)="store.reset()"
        class="btn btn-md btn-primary"
      >
        Reset
      </button>
    </div>
    <app-demos-fizz-buzz [val]="store.current()" />
  </app-ui-page>`,
  styles: ``,
})
export class CounterPage {
  // RUG - Repeat Until Good.
  // inside of a component, you should use signals for any state. This should be your default.
  // You may use inputs (later), but those should be signals
  // observables (rxjs) are allowed, but we are hopefully migrating away from that.
  // current = signal(42);

  store = inject(counterStore);
  // current = signal(0);

  title = inject(Title);

  constructor() {
    // effects are saying "do this when the enclosed signal changes."
    effect(() => {
      this.title.setTitle(this.emoji());
    });
  }

  emoji = computed(() => '🐵'.repeat(this.store.current()));
}
