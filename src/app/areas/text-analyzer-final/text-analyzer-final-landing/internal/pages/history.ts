import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { TextAnalyzerStore } from '../../store';

@Component({
  selector: 'ht-text-analyzer-history-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, DatePipe],
  template: `
    <app-ui-page title="Analysis History">
      @if (store.history().length === 0) {
        <div class="text-center py-12 text-base-content/50">
          <p class="text-lg">No saved analyses yet.</p>
          <p class="text-sm mt-2">Head to the Analyzer tab and click "Save to History".</p>
        </div>
      } @else {
        <div class="flex justify-end mb-4">
          <button class="btn btn-sm btn-ghost text-error" (click)="store.clearHistory()">
            Clear All
          </button>
        </div>
        <div class="flex flex-col gap-3">
          @for (item of store.history(); track item.id) {
            <div class="card bg-base-200 shadow-sm">
              <div class="card-body p-4">
                <div class="flex justify-between items-start gap-4">
                  <p class="text-sm text-base-content/70 flex-1 line-clamp-2 font-mono">
                    {{ item.excerpt }}
                  </p>
                  <span class="text-xs text-base-content/40 shrink-0">
                    {{ item.savedAt | date: 'short' }}
                  </span>
                </div>
                <div class="flex gap-4 mt-2 text-xs text-base-content/60">
                  <span><strong>{{ item.wordCount }}</strong> words</span>
                  <span><strong>{{ item.charCount }}</strong> chars</span>
                  <span><strong>{{ formatTime(item.readingTimeSecs) }}</strong> read</span>
                </div>
                @if (item.topKeywords.length > 0) {
                  <div class="flex flex-wrap gap-1 mt-2">
                    @for (kw of item.topKeywords; track kw.word) {
                      <span class="badge badge-sm badge-outline">{{ kw.word }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </app-ui-page>
  `,
  styles: ``,
})
export class HistoryPage {
  store = inject(TextAnalyzerStore);

  formatTime(secs: number): string {
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
  }
}
