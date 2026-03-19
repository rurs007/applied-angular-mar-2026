import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { PomodoroStore } from '../../store';

@Component({
  selector: 'ht-pomodoro-timer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout],
  template: `
    <app-ui-page title="Pomodoro Timer">
      <div class="flex flex-col items-center gap-6 py-4">
        <!-- Mode badge -->
        <div
          class="badge badge-lg"
          [class.badge-error]="mode() === 'work'"
          [class.badge-info]="mode() === 'break'"
        >
          {{ mode() === 'work' ? 'Focus' : 'Break' }}
        </div>

        <!-- Circular progress with time display -->
        <div
          class="radial-progress text-2xl font-mono font-bold transition-all"
          [class.text-error]="mode() === 'work'"
          [class.text-info]="mode() === 'break'"
          [style.--value]="progressPercent()"
          [style.--size]="'12rem'"
          [style.--thickness]="'8px'"
          role="progressbar"
          [attr.aria-valuenow]="progressPercent()"
          data-testid="time-display"
        >
          {{ formattedTime() }}
        </div>

        <!-- Controls -->
        <div class="flex gap-4">
          <button
            class="btn btn-primary w-24"
            [class.btn-warning]="isRunning()"
            (click)="toggleTimer()"
          >
            {{ startLabel() }}
          </button>
          <button class="btn btn-ghost" (click)="reset()">Reset</button>
        </div>

        <!-- Session info -->
        <p class="text-sm text-base-content/50">
          @if (mode() === 'work') {
            Focus session: {{ store.workMinutes() }} min
          } @else {
            Break: {{ store.breakMinutes() }} min
          }
        </p>
      </div>
    </app-ui-page>
  `,
  styles: ``,
})
export class TimerPage {
  store = inject(PomodoroStore);
  private destroyRef = inject(DestroyRef);

  mode = signal<'work' | 'break'>('work');
  isRunning = signal(false);
  secondsRemaining = signal(this.store.workMinutes() * 60);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Derived: total session length based on current mode + store prefs
  sessionDuration = computed(() =>
    this.mode() === 'work'
      ? this.store.workMinutes() * 60
      : this.store.breakMinutes() * 60,
  );

  // Derived: MM:SS string for display
  formattedTime = computed(() => {
    const s = this.secondsRemaining();
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  // Derived: 0–100 percent elapsed (for the radial progress)
  progressPercent = computed(() => {
    const duration = this.sessionDuration();
    if (duration === 0) return 0;
    return Math.round(((duration - this.secondsRemaining()) / duration) * 100);
  });

  // Derived: button label changes based on running state
  startLabel = computed(() => (this.isRunning() ? 'Pause' : 'Start'));

  constructor() {
    // Effect: when the timer reaches zero while running, flip mode and reset
    effect(() => {
      if (this.secondsRemaining() === 0 && this.isRunning()) {
        this.clearTimer();
        this.mode.update((m) => (m === 'work' ? 'break' : 'work'));
        this.secondsRemaining.set(this.sessionDuration());
        this.isRunning.set(false);
      }
    });

    // Always clean up the interval when this component is destroyed
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  toggleTimer(): void {
    if (this.isRunning()) {
      this.pause();
    } else {
      this.start();
    }
  }

  start(): void {
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.secondsRemaining.update((s) => s - 1);
    }, 1000);
  }

  pause(): void {
    this.isRunning.set(false);
    this.clearTimer();
  }

  reset(): void {
    this.pause();
    this.secondsRemaining.set(this.sessionDuration());
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
