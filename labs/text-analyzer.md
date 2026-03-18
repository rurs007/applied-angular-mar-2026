# Text Analyzer Lab

> **Advanced Track** — This lab assumes you're comfortable with Angular fundamentals and the project's feature scaffold pattern. Instructions are less prescriptive than the [Pomodoro lab](./pomodoro.md) — you're expected to figure out the wiring yourself.

You'll build a real-time text analysis tool that computes statistics about any text the user pastes in. This teaches:

- `computed()` chaining — multiple derived signals that depend on each other
- Complex data transformations inside `computed()`
- NGRX Signal Store introduced early (Sprint 5) as the natural home for shared settings
- History management: storing complex objects in store state
- `localStorage` persistence via `withHooks`

---

## Sprint 1 — Scaffold

```bash
ng generate feature-landing text-analyzer --title="Text Analyzer" --icon="lucideFileText"
```

Verify the nav link and `/text-analyzer` route work before proceeding.

---

## Sprint 2 — Text Input + Basic Stats

Create `internal/pages/analyzer.ts` with a `AnalyzerPage` component.

Add it as a child route (`analyze`) in `text-analyzer.routes.ts` and add a nav link in `home.ts`.

### The Core Signal

The entire analysis derives from a single `signal`:

```typescript
text = signal('');
```

Bind a `<textarea>` to it using `FormsModule`:

```html
<textarea
  [ngModel]="text()"
  (ngModelChange)="text.set($event)"
  data-testid="text-input"
></textarea>
```

### Computed Chaining

The key insight for this lab is that you can build a chain of computed signals where each one feeds into the next:

```typescript
// Step 1: tokenize once
private words = computed(() =>
  this.text().toLowerCase().match(/\b[a-z']+\b/g) ?? []
);

// Step 2: everything else derives from words()
wordCount = computed(() => this.words().length);
charCount = computed(() => this.text().length);
charCountNoSpaces = computed(() => this.text().replace(/\s/g, '').length);
```

Display the stats using DaisyUI's `stats` component:

```html
<div class="stats stats-horizontal shadow">
  <div class="stat">
    <div class="stat-title">Words</div>
    <div class="stat-value text-primary" data-testid="word-count">{{ wordCount() }}</div>
  </div>
  <!-- Add chars and more below -->
</div>
```

> **Tip**: Wrap the stats in `@if (wordCount() > 0) { ... }` so the page isn't cluttered when the textarea is empty.

### Check Your Work

Paste in a paragraph of text. Word count and character count should update in real time.

---

## Sprint 3 — Advanced Stats

Add more computed signals that derive from `words()` and `text()`.

### Sentence Count

```typescript
sentenceCount = computed(() => {
  const matches = this.text().match(/[^.!?]+[.!?]+/g);
  return matches ? matches.length : this.text().trim().length > 0 ? 1 : 0;
});
```

### Paragraph Count

Split on blank lines:

```typescript
paragraphCount = computed(() => {
  const paras = this.text().split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return paras.length || (this.text().trim().length > 0 ? 1 : 0);
});
```

### Average Word Length and Longest Word

These both derive from the `words()` array — implement them using `Array.reduce`.

### Average Words Per Sentence

Derive from `wordCount()` and `sentenceCount()`:

```typescript
avgWordsPerSentence = computed(() => {
  const sentences = this.sentenceCount();
  if (sentences === 0) return '0';
  return (this.wordCount() / sentences).toFixed(1);
});
```

### Reading Time

Add a placeholder `wpm` signal for now — it will come from the store in Sprint 5:

```typescript
private wpm = signal(200);

private readingTimeSecs = computed(() =>
  Math.ceil((this.wordCount() / this.wpm()) * 60)
);

readingTimeFormatted = computed(() => {
  const secs = this.readingTimeSecs();
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
});
```

### Check Your Work

Paste a multi-paragraph text. All stats should be updating live. Notice that changing one computed (e.g., `wordCount`) automatically flows through to `readingTimeFormatted` without any manual wiring.

---

## Sprint 4 — Keyword Frequency

Add keyword frequency analysis. This is the most interesting computed chain.

### Word Frequency Map

```typescript
private wordFrequency = computed(() => {
  const freq = new Map<string, number>();
  for (const word of this.words()) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
});
```

### Top Keywords

Derive the top 10 most frequent words from the frequency map:

```typescript
topKeywords = computed(() =>
  [...this.wordFrequency().entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
);
```

Display them as badges:

```html
@for (kw of topKeywords(); track kw.word) {
  <div class="badge badge-outline gap-1">
    <span class="font-semibold">{{ kw.word }}</span>
    <span class="text-base-content/50">×{{ kw.count }}</span>
  </div>
}
```

### Problem: Stop Words

The top 10 is probably full of "the", "and", "is", etc. In Sprint 5, the store will provide a stop-words list. For now, you can hard-code a small exclusion list to demonstrate the issue:

```typescript
private STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'are', 'in', 'of', 'to']);

private wordFrequency = computed(() => {
  const freq = new Map<string, number>();
  for (const word of this.words()) {
    if (this.STOP_WORDS.has(word)) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
});
```

Note this hardcoded list is a temporary measure — Sprint 5 will make it configurable.

### Check Your Work

Paste a technical article. The top keywords should reflect the actual subject matter, not noise words.

---

## Sprint 5 — Settings Page + Signal Store

The `wpm` value and stop-word exclusions need to be configurable and shared between pages. This is the motivation for introducing the Signal Store.

### Create the Store

Create `text-analyzer-landing/store.ts`:

```typescript
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

const DEFAULT_STOP_WORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'it', 'its', 'this', 'that', 'i', 'you', 'he', 'she', 'we',
  'they', 'not', 'so', 'if', 'as', 'what', 'which', 'who',
];

export const TextAnalyzerStore = signalStore(
  { providedIn: 'root' },
  withState({
    wpm: 200,
    minWordLength: 3,
    excludedWords: DEFAULT_STOP_WORDS,
  }),
  withMethods((store) => ({
    setWpm(wpm: number): void {
      patchState(store, { wpm: Math.max(50, Math.min(600, wpm)) });
    },
    setMinWordLength(length: number): void {
      patchState(store, { minWordLength: Math.max(1, Math.min(10, length)) });
    },
  })),
);
```

### Update the Analyzer Page

Replace the local `wpm = signal(200)` and hardcoded stop words with store values:

```typescript
store = inject(TextAnalyzerStore);
```

```typescript
// Reading time now reacts to store WPM
private readingTimeSecs = computed(() =>
  Math.ceil((this.wordCount() / this.store.wpm()) * 60)
);

// Keyword filtering now reacts to store settings
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
```

### Create the Settings Page

Create `internal/pages/settings.ts`. Inject `TextAnalyzerStore` and add:
- A `range` slider for WPM (50–600)
- A `range` slider for minimum keyword length (1–10)
- A note about how many stop words are excluded

Add the settings route and nav link.

### Check Your Work

1. Paste text in the Analyzer tab. Note the reading time.
2. Go to Settings and drag the WPM slider up significantly.
3. Return to the Analyzer — reading time should have updated reactively, even though you didn't touch the text.

---

## Sprint 6 — History

Add the ability to save an analysis snapshot to a history list.

### Extend the Store

Add a type and state for history:

```typescript
export type AnalysisSnapshot = {
  id: string;
  savedAt: string;
  excerpt: string;
  wordCount: number;
  charCount: number;
  readingTimeSecs: number;
  topKeywords: Array<{ word: string; count: number }>;
};
```

Add `history: AnalysisSnapshot[]` to the store's `withState`. Add methods:

```typescript
addToHistory(snapshot: AnalysisSnapshot): void {
  // Keep the 20 most recent
  patchState(store, { history: [snapshot, ...store.history()].slice(0, 20) });
},
clearHistory(): void {
  patchState(store, { history: [] });
},
```

### Save Button in Analyzer

Add a "Save to History" button in `analyzer.ts`. When clicked, snapshot the current computed values:

```typescript
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
```

### Create the History Page

Create `internal/pages/history.ts`. Inject the store and display `store.history()` in a list. Show the excerpt, stats, and top keyword badges for each saved entry. Include a "Clear All" button that calls `store.clearHistory()`.

> Tip: Use `DatePipe` from `@angular/common` to format `savedAt`.

Add the history route and nav link.

### Check Your Work

1. Paste several different texts, clicking "Save to History" after each.
2. Navigate to the History page — you should see all saved entries.
3. "Clear All" should empty the list.
4. Note: if you reload the page, history disappears — that's fixed in Sprint 7.

---

## Sprint 7 — Persistence (Advanced++)

Use `withHooks` and an `effect` to persist the entire store state (settings + history) to `localStorage`.

The pattern is identical to the Pomodoro lab's Sprint 7:

1. Import `withHooks` from `@ngrx/signals` and `effect` from `@angular/core`
2. In `onInit`, read from `localStorage` and `patchState` with the saved values
3. Set up an `effect` that serializes the store to `localStorage` whenever any signal changes

```typescript
withHooks({
  onInit(store) {
    const saved = localStorage.getItem('text-analyzer-state');
    if (saved) {
      patchState(store, JSON.parse(saved));
    }
    effect(() => {
      localStorage.setItem('text-analyzer-state', JSON.stringify({
        wpm: store.wpm(),
        minWordLength: store.minWordLength(),
        excludedWords: store.excludedWords(),
        history: store.history(),
      }));
    });
  },
}),
```

### Check Your Work

1. Save a few analyses to history.
2. Reload the page.
3. Navigate to History — your saved analyses should still be there.
4. Navigate to Settings — your WPM preference should be preserved.

---

## Finished?

Stretch goals for extra challenge:

- **Unique word ratio**: `computed(() => (uniqueWordCount() / wordCount() * 100).toFixed(1) + '%')` — a rough measure of vocabulary diversity.
- **Readability score**: Implement the [Flesch Reading Ease](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) score using a syllable-counting heuristic.
- **Compare mode**: Save two analyses and display them side-by-side.
- **Export**: Add a button that copies the stats as formatted text to the clipboard using `navigator.clipboard.writeText()`.
- **Custom stop words**: Add a text input in Settings to add/remove words from the exclusion list.
