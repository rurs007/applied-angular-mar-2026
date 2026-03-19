import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { effect } from '@angular/core';

type PomodoroPrefs = {
  workMinutes: number;
  breakMinutes: number;
};

const STORAGE_KEY = 'pomodoro-prefs';

function loadFromStorage(): Partial<PomodoroPrefs> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Partial<PomodoroPrefs>) : {};
  } catch {
    return {};
  }
}

export const PomodoroStore = signalStore(
  { providedIn: 'root' },
  withState<PomodoroPrefs>({
    workMinutes: 25,
    breakMinutes: 5,
  }),
  withMethods((store) => ({
    setWorkMinutes(minutes: number): void {
      patchState(store, { workMinutes: Math.max(1, Math.min(60, minutes)) });
    },
    setBreakMinutes(minutes: number): void {
      patchState(store, { breakMinutes: Math.max(1, Math.min(30, minutes)) });
    },
  })),
  withHooks({
    onInit(store) {
      const saved = loadFromStorage();
      if (Object.keys(saved).length > 0) {
        patchState(store, saved);
      }
      effect(() => {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            workMinutes: store.workMinutes(),
            breakMinutes: store.breakMinutes(),
          }),
        );
      });
    },
  }),
);
