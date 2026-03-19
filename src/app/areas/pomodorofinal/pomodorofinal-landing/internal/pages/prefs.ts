import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { PomodoroStore } from '../../store';

@Component({
  selector: 'ht-pomodoro-prefs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, FormsModule],
  template: `
    <app-ui-page title="Timer Settings">
      <div class="flex flex-col gap-6 max-w-md">
        <!-- Work duration -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Focus Session Duration</span>
            <span class="label-text-alt text-error font-bold">{{ store.workMinutes() }} min</span>
          </label>
          <input
            type="range"
            class="range range-error"
            min="1"
            max="60"
            step="1"
            [ngModel]="store.workMinutes()"
            (ngModelChange)="store.setWorkMinutes($event)"
          />
          <div class="flex justify-between text-xs text-base-content/50 px-1 mt-1">
            <span>1 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>

        <!-- Break duration -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Break Duration</span>
            <span class="label-text-alt text-info font-bold">{{ store.breakMinutes() }} min</span>
          </label>
          <input
            type="range"
            class="range range-info"
            min="1"
            max="30"
            step="1"
            [ngModel]="store.breakMinutes()"
            (ngModelChange)="store.setBreakMinutes($event)"
          />
          <div class="flex justify-between text-xs text-base-content/50 px-1 mt-1">
            <span>1 min</span>
            <span>15 min</span>
            <span>30 min</span>
          </div>
        </div>

        <div class="alert alert-info">
          <span>Settings are saved automatically and survive page reloads.</span>
        </div>
      </div>
    </app-ui-page>
  `,
  styles: ``,
})
export class PrefsPage {
  store = inject(PomodoroStore);
}
