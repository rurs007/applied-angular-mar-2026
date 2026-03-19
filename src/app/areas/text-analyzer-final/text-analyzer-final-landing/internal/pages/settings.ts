import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { TextAnalyzerStore } from '../../store';

@Component({
  selector: 'ht-text-analyzer-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, FormsModule],
  template: `
    <app-ui-page title="Analysis Settings">
      <div class="flex flex-col gap-6 max-w-lg">
        <!-- Reading speed -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Reading Speed</span>
            <span class="label-text-alt text-primary font-bold">{{ store.wpm() }} WPM</span>
          </label>
          <input
            type="range"
            class="range range-primary"
            min="50"
            max="600"
            step="25"
            [ngModel]="store.wpm()"
            (ngModelChange)="store.setWpm($event)"
          />
          <div class="flex justify-between text-xs text-base-content/50 px-1 mt-1">
            <span>Slow (50)</span>
            <span>Average (200)</span>
            <span>Fast (600)</span>
          </div>
        </div>

        <!-- Minimum keyword length -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Minimum Keyword Length</span>
            <span class="label-text-alt text-secondary font-bold">
              {{ store.minWordLength() }}+ letters
            </span>
          </label>
          <input
            type="range"
            class="range range-secondary"
            min="1"
            max="10"
            step="1"
            [ngModel]="store.minWordLength()"
            (ngModelChange)="store.setMinWordLength($event)"
          />
          <div class="flex justify-between text-xs text-base-content/50 px-1 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <!-- Stop words info -->
        <div class="alert">
          <div>
            <p class="font-semibold text-sm">Stop Words</p>
            <p class="text-xs text-base-content/70 mt-1">
              {{ store.excludedWords().length }} common words (e.g. "the", "and", "is") are excluded
              from keyword analysis. Return to the Analyzer to see how your settings affect results.
            </p>
          </div>
        </div>

        <div class="alert alert-success">
          <span>Settings are saved automatically and survive page reloads.</span>
        </div>
      </div>
    </app-ui-page>
  `,
  styles: ``,
})
export class SettingsPage {
  store = inject(TextAnalyzerStore);
}
