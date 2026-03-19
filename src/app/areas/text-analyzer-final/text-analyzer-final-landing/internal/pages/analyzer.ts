import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { AnalysisSnapshot, TextAnalyzerStore } from '../../store';

@Component({
  selector: 'ht-text-analyzer-analyzer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, FormsModule],
  template: `
    <app-ui-page title="Text Analyzer">
      <div class="flex flex-col gap-4">
        <!-- Input -->
        <textarea
          class="textarea textarea-bordered w-full h-40 font-mono text-sm"
          placeholder="Paste or type your text here..."
          [ngModel]="text()"
          (ngModelChange)="text.set($event)"
          data-testid="text-input"
        ></textarea>

        <!-- Action bar -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-base-content/50">
            @if (wordCount() === 0) {
              Start typing to see analysis
            } @else {
              Analyzing {{ wordCount() }} words
            }
          </span>
          <div class="flex gap-2">
            <button
              class="btn btn-sm btn-ghost"
              (click)="text.set('')"
              [disabled]="wordCount() === 0"
            >
              Clear
            </button>
            <button
              class="btn btn-sm btn-primary"
              (click)="saveToHistory()"
              [disabled]="wordCount() === 0"
            >
              Save to History
            </button>
          </div>
        </div>

        @if (wordCount() > 0) {
          <!-- Primary stats -->
          <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
            <div class="stat">
              <div class="stat-title">Words</div>
              <div class="stat-value text-primary" data-testid="word-count">{{ wordCount() }}</div>
              <div class="stat-desc">{{ uniqueWordCount() }} unique</div>
            </div>
            <div class="stat">
              <div class="stat-title">Characters</div>
              <div class="stat-value text-secondary" data-testid="char-count">
                {{ charCount() }}
              </div>
              <div class="stat-desc">{{ charCountNoSpaces() }} without spaces</div>
            </div>
            <div class="stat">
              <div class="stat-title">Reading Time</div>
              <div class="stat-value text-accent" data-testid="reading-time">
                {{ readingTimeFormatted() }}
              </div>
              <div class="stat-desc">at {{ store.wpm() }} WPM</div>
            </div>
            <div class="stat">
              <div class="stat-title">Sentences</div>
              <div class="stat-value">{{ sentenceCount() }}</div>
              <div class="stat-desc">~{{ avgWordsPerSentence() }} words each</div>
            </div>
          </div>

          <!-- Secondary stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div class="card bg-base-200 p-3 text-center">
              <div class="text-xs text-base-content/50">Paragraphs</div>
              <div class="text-xl font-bold">{{ paragraphCount() }}</div>
            </div>
            <div class="card bg-base-200 p-3 text-center">
              <div class="text-xs text-base-content/50">Avg word length</div>
              <div class="text-xl font-bold">{{ avgWordLength() }}</div>
            </div>
            <div class="card bg-base-200 p-3 text-center">
              <div class="text-xs text-base-content/50">Longest word</div>
              <div class="text-lg font-bold truncate" [title]="longestWord()">
                {{ longestWord() }}
              </div>
            </div>
            <div class="card bg-base-200 p-3 text-center">
              <div class="text-xs text-base-content/50">Flesch score</div>
              <div class="text-xl font-bold">{{ fleschScore() }}</div>
            </div>
          </div>

          <!-- Top keywords -->
          @if (topKeywords().length > 0) {
            <div class="card bg-base-200">
              <div class="card-body p-4">
                <h3 class="card-title text-sm">Top Keywords</h3>
                <div class="flex flex-wrap gap-2">
                  @for (kw of topKeywords(); track kw.word) {
                    <div class="badge badge-outline gap-1">
                      <span class="font-semibold">{{ kw.word }}</span>
                      <span class="text-base-content/50">×{{ kw.count }}</span>
                    </div>
                  }
                </div>
                <p class="text-xs text-base-content/40 mt-2">
                  Words shorter than {{ store.minWordLength() }} letters and {{ store.excludedWords().length }} stop words are excluded.
                  Adjust in Settings.
                </p>
              </div>
            </div>
          }
        }
      </div>
    </app-ui-page>
  `,
  styles: ``,
})
export class AnalyzerPage {
  store = inject(TextAnalyzerStore);

  text = signal('');

  // Base computed: tokenize once, everything else derives from this
  private words = computed(() => this.text().toLowerCase().match(/\b[a-z']+\b/g) ?? []);

  wordCount = computed(() => this.words().length);
  charCount = computed(() => this.text().length);
  charCountNoSpaces = computed(() => this.text().replace(/\s/g, '').length);
  uniqueWordCount = computed(() => new Set(this.words()).size);

  sentenceCount = computed(() => {
    const matches = this.text().match(/[^.!?]+[.!?]+/g);
    return matches ? matches.length : this.text().trim().length > 0 ? 1 : 0;
  });

  paragraphCount = computed(() => {
    const paras = this.text().split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    return paras.length || (this.text().trim().length > 0 ? 1 : 0);
  });

  avgWordLength = computed(() => {
    const w = this.words();
    if (w.length === 0) return '0';
    const avg = w.reduce((sum, word) => sum + word.length, 0) / w.length;
    return avg.toFixed(1);
  });

  longestWord = computed(() => {
    const w = this.words();
    if (w.length === 0) return '';
    return w.reduce((longest, word) => (word.length > longest.length ? word : longest), '');
  });

  avgWordsPerSentence = computed(() => {
    const sentences = this.sentenceCount();
    if (sentences === 0) return '0';
    return (this.wordCount() / sentences).toFixed(1);
  });

  private readingTimeSecs = computed(() => {
    return Math.ceil((this.wordCount() / this.store.wpm()) * 60);
  });

  readingTimeFormatted = computed(() => {
    const secs = this.readingTimeSecs();
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
  });

  // Approximate Flesch Reading Ease score (higher = easier to read)
  fleschScore = computed(() => {
    const words = this.wordCount();
    const sentences = this.sentenceCount();
    if (words === 0 || sentences === 0) return '—';
    // Count syllables: simple heuristic (vowel groups)
    const syllables = this.words().reduce((total, word) => {
      const count = word.match(/[aeiouy]+/gi)?.length ?? 1;
      return total + Math.max(1, count);
    }, 0);
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, Math.round(score)));
  });

  // Keyword frequency map, respecting store settings
  private wordFrequency = computed(() => {
    const excluded = new Set(this.store.excludedWords());
    const minLen = this.store.minWordLength();
    const freq = new Map<string, number>();
    for (const word of this.words()) {
      if (word.length < minLen || excluded.has(word)) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
    return freq;
  });

  topKeywords = computed(() =>
    [...this.wordFrequency().entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count })),
  );

  saveToHistory(): void {
    const snapshot: AnalysisSnapshot = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      excerpt: this.text().slice(0, 200) + (this.text().length > 200 ? '…' : ''),
      wordCount: this.wordCount(),
      charCount: this.charCount(),
      readingTimeSecs: this.readingTimeSecs(),
      topKeywords: this.topKeywords().slice(0, 5),
    };
    this.store.addToHistory(snapshot);
  }
}
