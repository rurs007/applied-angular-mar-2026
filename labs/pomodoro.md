# Pomodoro Timer Lab

> **Beginner Track** — This lab is designed for developers who want more step-by-step guidance.
> If you're comfortable with Angular signals and want a bigger challenge, try the [Text Analyzer lab](./text-analyzer.md) instead.

The [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique) is a time-management method where you work in focused sessions (typically 25 minutes) separated by short breaks (5 minutes). You'll build a working Pomodoro timer that teaches:

- `signal()` for mutable local state
- `computed()` for derived UI state
- `effect()` for reacting to state changes
- Child routing within a feature
- NGRX Signal Store for shared state
- `localStorage` persistence

---

## Sprint 1 — Feature Scaffold

Run the following command in the project root:

```bash
ng generate feature-landing pomodoro --title="Pomodoro" --icon="lucideTimer"
```

This creates the feature folder structure and wires it into the app's routes and navigation automatically.

### Check Your Work

Start the app (`npm start`) and navigate to `http://localhost:4200`. You should see a **Pomodoro** link in the sidebar. Clicking it should take you to `/pomodoro` and show a default page.

---

## Sprint 2 — Timer Page

The schematic created a feature shell and a default home page. Now you'll add a dedicated **Timer** page.

### Create the Timer Component

Create a new file at:

```
src/app/areas/pomodoro/pomodoro-landing/internal/pages/timer.ts
```

Name the component class `TimerPage` with selector `ht-pomodoro-timer-page`.

In the template, use the `PageLayout` component (already used in the generated `home.ts`):

```typescript
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
```

Add this static layout inside the template for now:

```html
<app-ui-page title="Pomodoro Timer">
  <div class="flex flex-col items-center gap-6 py-4">
    <!-- Mode badge -->
    <div class="badge badge-lg badge-error">Focus</div>

    <!-- Timer display -->
    <div class="text-6xl font-mono font-bold text-error">25:00</div>

    <!-- Controls -->
    <div class="flex gap-4">
      <button class="btn btn-primary w-24">Start</button>
      <button class="btn btn-ghost">Reset</button>
    </div>
  </div>
</app-ui-page>
```

### Add the Route

Open `pomodoro.routes.ts`. Add an import for `TimerPage` and add a child route:

```typescript
{
  path: 'timer',
  title: 'Timer',
  component: TimerPage,
}
```

### Add the Nav Link

Open `internal/home.ts`. Add `timer` to the `links` signal:

```typescript
links = signal<SectionLink[]>([
  { path: 'timer', title: 'Timer' },
]);
```

### Check Your Work

Navigate to `/pomodoro`. You should see a **Timer** link in the sub-navigation. Clicking it should show your static timer UI at `/pomodoro/timer`.

---

## Sprint 3 — Timer State with Signals

Now make the timer actually count. All state lives inside the component for this sprint — no service yet.

### Add Signals

In `timer.ts`, add these three signals to the component class:

```typescript
secondsRemaining = signal(25 * 60);  // 1500 seconds = 25 minutes
isRunning = signal(false);
```

You'll also need a private property to hold the interval reference:

```typescript
private intervalId: ReturnType<typeof setInterval> | null = null;
```

### Add a Computed: Formatted Time

Instead of putting formatting logic in the template, use `computed()`:

```typescript
formattedTime = computed(() => {
  const s = this.secondsRemaining();
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});
```

### Update the Template

Replace the hardcoded `25:00` with the computed signal:

```html
<div class="text-6xl font-mono font-bold text-error" data-testid="time-display">
  {{ formattedTime() }}
</div>
```

### Add Start / Pause / Reset Methods

```typescript
start(): void {
  this.isRunning.set(true);
  this.intervalId = setInterval(() => {
    this.secondsRemaining.update(s => s - 1);
  }, 1000);
}

pause(): void {
  this.isRunning.set(false);
  if (this.intervalId !== null) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

reset(): void {
  this.pause();
  this.secondsRemaining.set(25 * 60);
}

toggleTimer(): void {
  if (this.isRunning()) {
    this.pause();
  } else {
    this.start();
  }
}
```

Connect the buttons to these methods:

```html
<button class="btn btn-primary w-24" (click)="toggleTimer()">Start</button>
<button class="btn btn-ghost" (click)="reset()">Reset</button>
```

### Don't Forget Cleanup

If the user navigates away while the timer is running, the `setInterval` will keep firing. Use `DestroyRef` to clean up:

```typescript
private destroyRef = inject(DestroyRef);

constructor() {
  this.destroyRef.onDestroy(() => {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  });
}
```

> Hint: `DestroyRef` is imported from `@angular/core`, same as `inject`.

### Check Your Work

The Start button should start counting down. Pause should stop it. Reset should return to 25:00.

---

## Sprint 4 — More Computed Signals

### Button Label

The Start button should say "Pause" when the timer is running. Add a computed:

```typescript
startLabel = computed(() => this.isRunning() ? 'Pause' : 'Start');
```

Update the template:

```html
<button class="btn btn-primary w-24" (click)="toggleTimer()">{{ startLabel() }}</button>
```

### Progress Indicator

Add a progress bar that fills as time elapses. First, add a computed for the percentage elapsed:

```typescript
progressPercent = computed(() => {
  const total = 25 * 60;
  return Math.round(((total - this.secondsRemaining()) / total) * 100);
});
```

DaisyUI has a circular `radial-progress` component. Replace your time display `div` with:

```html
<div
  class="radial-progress text-2xl font-mono font-bold text-error"
  [style.--value]="progressPercent()"
  [style.--size]="'12rem'"
  [style.--thickness]="'8px'"
  role="progressbar"
  data-testid="time-display"
>
  {{ formattedTime() }}
</div>
```

### Check Your Work

The progress ring should fill clockwise as time counts down. The button label should toggle between Start and Pause.

> **Key concept**: Notice that neither `startLabel` nor `progressPercent` have any `if/else` in the template — all the conditional logic lives in `computed()`. The template just reads values.

---

## Sprint 5 — Mode Switching with `effect()`

Right now the timer just counts down indefinitely. Let's add Work / Break modes and make the timer switch modes automatically.

### Add Mode Signal

```typescript
mode = signal<'work' | 'break'>('work');
```

### Update the Session Duration

The hardcoded `25 * 60` needs to change based on mode. Add a `computed` for the session duration:

```typescript
sessionDuration = computed(() =>
  this.mode() === 'work' ? 25 * 60 : 5 * 60
);
```

Update `reset()` to use this:

```typescript
reset(): void {
  this.pause();
  this.secondsRemaining.set(this.sessionDuration());
}
```

And update `progressPercent` to use `sessionDuration()` instead of the hardcoded constant.

### Introduce `effect()` — Auto Mode Switch

When `secondsRemaining` hits zero, we want to automatically flip modes and reset the timer. This is a side effect reacting to state change — a perfect use for `effect()`.

Add this to your `constructor`:

```typescript
constructor() {
  effect(() => {
    if (this.secondsRemaining() === 0 && this.isRunning()) {
      this.pause();
      this.mode.update(m => m === 'work' ? 'break' : 'work');
      this.secondsRemaining.set(this.sessionDuration());
    }
  });

  // DestroyRef cleanup from Sprint 3 stays here too
  this.destroyRef.onDestroy(() => { ... });
}
```

> **What makes this an `effect`?** An effect is for code that must run *as a consequence of signal changes* but isn't computing a new value — it's a side effect. Here we're reacting to `secondsRemaining` hitting 0 to drive other state changes.

### Update the UI for Mode

Make the badge and colors change based on mode:

```html
<div
  class="badge badge-lg"
  [class.badge-error]="mode() === 'work'"
  [class.badge-info]="mode() === 'break'"
>
  {{ mode() === 'work' ? 'Focus' : 'Break' }}
</div>
```

You can also bind the color class on the `radial-progress` div:

```html
[class.text-error]="mode() === 'work'"
[class.text-info]="mode() === 'break'"
```

### Check Your Work

Set the work session to 5 seconds (change `25 * 60` to `5` temporarily) and let it run. When it hits zero, the mode badge should switch to "Break", the color should change to blue, and the timer should reset to the break duration.

---

## Sprint 6 — Preferences Page + Signal Store (Advanced)

Right now, work (25 min) and break (5 min) durations are hardcoded. We want the user to configure them on a separate **Settings** page. Since the timer and settings pages are different routes, the state needs to live somewhere both components can reach — that's the Signal Store.

### Create the Store

Create a new file:

```
src/app/areas/pomodoro/pomodoro-landing/store.ts
```

```typescript
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const PomodoroStore = signalStore(
  { providedIn: 'root' },
  withState({
    workMinutes: 25,
    breakMinutes: 5,
  }),
  withMethods((store) => ({
    setWorkMinutes(minutes: number): void {
      patchState(store, { workMinutes: minutes });
    },
    setBreakMinutes(minutes: number): void {
      patchState(store, { breakMinutes: minutes });
    },
  })),
);
```

### Update the Timer to Use the Store

In `timer.ts`, inject the store:

```typescript
store = inject(PomodoroStore);
```

Update `sessionDuration` to read from the store instead of hardcoded values:

```typescript
sessionDuration = computed(() =>
  this.mode() === 'work'
    ? this.store.workMinutes() * 60
    : this.store.breakMinutes() * 60
);
```

Also initialize `secondsRemaining` from the store:

```typescript
secondsRemaining = signal(this.store.workMinutes() * 60);
```

> **Important**: `store` must be declared *before* `secondsRemaining` in the class body so it's initialized first.

### Create the Prefs Page

Create `src/app/areas/pomodoro/pomodoro-landing/internal/pages/prefs.ts`.

Inject the same store and add sliders for `workMinutes` and `breakMinutes`. Use `FormsModule` for `[(ngModel)]` binding:

```typescript
import { FormsModule } from '@angular/forms';
// ...
store = inject(PomodoroStore);
```

```html
<app-ui-page title="Timer Settings">
  <div class="form-control">
    <label class="label">
      <span class="label-text">Focus Duration</span>
      <span class="label-text-alt">{{ store.workMinutes() }} min</span>
    </label>
    <input
      type="range"
      class="range range-error"
      min="1" max="60" step="1"
      [ngModel]="store.workMinutes()"
      (ngModelChange)="store.setWorkMinutes($event)"
    />
  </div>
  <!-- Add a similar block for breakMinutes -->
</app-ui-page>
```

### Wire Up Routing

Add `prefs` to `pomodoro.routes.ts` and `{ path: 'prefs', title: 'Settings' }` to the `links` signal in `home.ts`.

### Check Your Work

1. Navigate to Settings and move the sliders.
2. Navigate back to the Timer.
3. Hit Reset — the timer should reflect your new durations.
4. The durations should stay consistent as you navigate back and forth.

> **Why does this work?** `PomodoroStore` is `providedIn: 'root'`, so Angular creates exactly one instance shared across your entire app.

---

## Sprint 7 — Persistence (Advanced++)

The store resets to defaults every time the page reloads. Add `localStorage` so preferences survive.

### Add `withHooks` to the Store

`withHooks` gives you `onInit` and `onDestroy` lifecycle callbacks that run within the store's injection context.

Update `store.ts`:

```typescript
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { effect } from '@angular/core';

const STORAGE_KEY = 'pomodoro-prefs';

export const PomodoroStore = signalStore(
  { providedIn: 'root' },
  withState({ workMinutes: 25, breakMinutes: 5 }),
  withMethods((store) => ({
    setWorkMinutes(minutes: number): void {
      patchState(store, { workMinutes: minutes });
    },
    setBreakMinutes(minutes: number): void {
      patchState(store, { breakMinutes: minutes });
    },
  })),
  withHooks({
    onInit(store) {
      // Load saved prefs on startup
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        patchState(store, JSON.parse(saved));
      }

      // Save to localStorage whenever state changes
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
```

### Check Your Work

1. Open Settings and change the work duration to 45 minutes.
2. Reload the page.
3. Open Settings — it should still show 45 minutes.
4. Open the browser's DevTools → Application → Local Storage and you should see the `pomodoro-prefs` key.

---

## Finished?

Here are some stretch goals if you have time:

- **Session counter**: Display how many focus sessions you've completed today.
- **Long break**: After 4 focus sessions, offer a 15-minute long break instead.
- **Sound notification**: Use the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to play a tone when the timer finishes (hint: try it in an `effect`).
- **Page title**: Update the browser tab title with the current timer using `Title` from `@angular/platform-browser`.
