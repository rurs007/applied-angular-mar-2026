import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
type ByVals = 1 | 3 | 5;
// a service that can hold the 'by' value and live longer than the component, so that I can share that data
type CounterState = {
  by: ByVals;
  current: number;
};
export const counterStore = signalStore(
  withState<CounterState>({
    by: 1,
    current: 0,
  }),
  withComputed((store) => {
    return {
      resetShouldBeDisabled: computed(() => {
        return store.current() === 0;
      }),
      decrementShouldBeDisabled: computed(() => {
        const current = store.current(); // this is saying watch this signal, if it changes, reeevaluate everything in this computed
        return current - store.by() < 0;
      }),
    };
  }),
  withMethods((store) => {
    return {
      setBy: (by: ByVals) => patchState(store, { by: by }),
      increment: () => patchState(store, { current: store.current() + store.by() }),
      decrement: () => patchState(store, { current: store.current() - store.by() }),
      reset: () => patchState(store, { current: 0 }),
    };
  }),

  withHooks({
    onInit() {
      console.log('Created a counter store..again!');

      // make an api call or whatever to get the saved value.
    },
    onDestroy() {
      console.log('Destoyed a store');
    },
  }),
);
