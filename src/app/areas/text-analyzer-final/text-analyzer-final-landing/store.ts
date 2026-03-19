import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { effect } from '@angular/core';

export type AnalysisSnapshot = {
  id: string;
  savedAt: string;
  excerpt: string;
  wordCount: number;
  charCount: number;
  readingTimeSecs: number;
  topKeywords: Array<{ word: string; count: number }>;
};

type TextAnalyzerState = {
  wpm: number;
  minWordLength: number;
  excludedWords: string[];
  history: AnalysisSnapshot[];
};

const STORAGE_KEY = 'text-analyzer-state';

// Common English stop words excluded from keyword analysis by default
const DEFAULT_STOP_WORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'it', 'its', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us',
  'them', 'my', 'your', 'his', 'our', 'their', 'not', 'no', 'so', 'if',
  'as', 'up', 'out', 'about', 'into', 'than', 'then', 'when', 'there',
  'what', 'which', 'who', 'how', 'all', 'each', 'more', 'also', 'just',
  'can', 'get', 'one', 'two', 'new', 'now', 'any', 'some', 'very',
];

function loadFromStorage(): Partial<TextAnalyzerState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Partial<TextAnalyzerState>) : {};
  } catch {
    return {};
  }
}

export const TextAnalyzerStore = signalStore(
  { providedIn: 'root' },
  withState<TextAnalyzerState>({
    wpm: 200,
    minWordLength: 3,
    excludedWords: DEFAULT_STOP_WORDS,
    history: [],
  }),
  withMethods((store) => ({
    setWpm(wpm: number): void {
      patchState(store, { wpm: Math.max(50, Math.min(600, wpm)) });
    },
    setMinWordLength(length: number): void {
      patchState(store, { minWordLength: Math.max(1, Math.min(10, length)) });
    },
    addToHistory(snapshot: AnalysisSnapshot): void {
      // Keep the 20 most recent entries
      patchState(store, { history: [snapshot, ...store.history()].slice(0, 20) });
    },
    clearHistory(): void {
      patchState(store, { history: [] });
    },
  })),
  withHooks({
    onInit(store) {
      const saved = loadFromStorage();
      if (Object.keys(saved).length > 0) {
        patchState(store, { ...saved, history: saved.history ?? [] });
      }
      effect(() => {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            wpm: store.wpm(),
            minWordLength: store.minWordLength(),
            excludedWords: store.excludedWords(),
            history: store.history(),
          }),
        );
      });
    },
  }),
);
