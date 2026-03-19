# Applied Angular — March 2026 Class Summary

**Dates:** Monday March 16 – Thursday March 19, 2026
**Format:** 4-day intensive; students working in VMs at `class.hypertheory-labs.com`

---

## Day 1 — Monday, March 16

### Morning: Context and Philosophy

The day started with a wide-angle view of *why Angular exists* and what it's actually for. The core framing: Angular is for building **applications** (things with local state and code that processes that data), not web sites or server-side web applications. SPAs should be treated as an advanced tool — not the default — for UIs that genuinely can't be built well with simpler approaches.

A significant chunk of the morning was spent on **what Angular actually is** at a technical level:
- TypeScript + HTML templates + CSS, wired together by `@angular/*` packages via decorators
- The decorator system (`@Component`, `@Directive`, etc.) as "hooks" into the Angular runtime
- The distinction between *general-purpose* libraries (rxjs, date-fns — usable anywhere) and *Angular-specific* libraries (`@ngrx/signals`, `@ng-icon`) that declare Angular as a peer dependency

### The Development Environment

Emphasis on reducing friction for the whole team:
- `.vscode/extensions.json` — shared team extension recommendations
- `.vscode/settings.json` — shared editor settings
- `.vscode/typescript.code-snippets` — boilerplate snippets for common patterns
- **Angular Schematics** — the real power tool for project scaffolding. The project ships with a custom `feature-landing` schematic that generates the full feature folder structure, wires up routes in `app.routes.ts`, and adds a nav link to `app.ts` — all in one command:

```bash
ng generate feature-landing resources --title="Resources" --icon="lucideLink"
```

The "three dueling tyrants": `tsconfig`, `eslint.config.js`, and `.prettierrc` — all three enforce coding standards, have overlapping concerns, and must not contradict each other.

### Architecture and Structure

Walkthrough of the project structure under `src/app/areas/`:
- Feature areas (`home`, `profile`, `signalsdemos`, etc.) — code organized by business capability, not technical type
- `shared/` for genuinely cross-cutting code
- [Sheriff](https://www.npmjs.com/package/@softarc/sheriff) (`sheriff.config.ts`) enforcing the dependency boundaries: feature areas must not import from each other

Key principle: **shared code requires a different mindset than feature code**. Features can be refactored freely; shared code needs defensive coding, thorough testing, and careful PR review.

### Two Modes of Development

This framing was introduced and referenced throughout the rest of the class:

- **Application developer mode**: ship a feature, make code intention-revealing, enable parallel work, don't over-engineer
- **Library developer mode**: design for reuse, edge-case test, document thoroughly

Most Angular tutorials assume library mode. This class pushes back on that.

### End of Day 1

A new `signalsdemos` feature area was scaffolded via the schematic, setting up the playground for Tuesday's signals deep-dive. The `home` feature got an `about.ts` page. The instructor Excalidraw diagrams (Angular opinions, technology choices) were committed.

---

## Day 2 — Tuesday, March 17

### Morning: Review + Signals Introduction

Started with a review of Day 1, syncing everyone's code state to the main branch, then dove into signals — *using* them first before theorizing about *why*.

### Basic Signals

The `CounterPage` was built incrementally in the `signalsdemos` area. First pass, pre-lunch:

```ts
export class CounterPage {
  current = signal(0);

  increment() {
    this.current.update((c) => c + 1);
  }

  decrement() {
    this.current.update((c) => c - 1);
  }
}
```

Key points covered:
- `signal(initialValue)` — writable signal
- `.set(value)` — direct replacement
- `.update(fn)` — derive new value from current
- Reading a signal: call it like a function `current()` — both in class code and templates

### Computed Signals and Effects

Post-lunch the counter was extended with `computed` and `effect`:

```ts
export class CounterPage {
  current = signal(0);
  title = inject(Title);

  constructor() {
    effect(() => {
      this.title.setTitle(this.emoji());  // re-runs whenever emoji() changes
    });
  }

  shouldBeDisabled = computed(() => this.current() === 0);
  emoji = computed(() => '💾'.repeat(this.current()));
}
```

- `computed()` — a read-only signal derived from one or more other signals; re-evaluates lazily when dependencies change
- `effect()` — runs a side effect when enclosed signals change; lives in an injection context (constructor or `inject()` phase)
- `[disabled]="shouldBeDisabled()"` — template binding to a computed signal

### Signal Inputs

The `FizzBuzz` component demonstrated `input.required<T>()`:

```ts
export class FizzBuzz {
  val = input.required<number>();

  fizzBuzz = computed(() => {
    const current = this.val();
    if (current === 0) return 'zero';
    if (current % 3 === 0 && current % 5 === 0) return 'FizzBuzz';
    if (current % 3 === 0) return 'Fizz';
    if (current % 5 === 0) return 'Buzz';
    return 'none';
  });
}
```

Used in the counter template: `<app-demos-fizz-buzz [val]="store.current()" />`

This demonstrated that `input()` produces a signal — so it can be consumed directly by `computed()`.

### NgRx Signal Store

The afternoon covered lifting state out of components using `@ngrx/signals` `signalStore`. The counter logic moved from the component into a store:

```ts
type CounterState = { by: ByVals; current: number };

export const counterStore = signalStore(
  withState<CounterState>({ by: 1, current: 0 }),
  withComputed((store) => ({
    resetShouldBeDisabled: computed(() => store.current() === 0),
    decrementShouldBeDisabled: computed(() => store.current() - store.by() < 0),
  })),
  withMethods((store) => ({
    setBy: (by: ByVals) => patchState(store, { by }),
    increment: () => patchState(store, { current: store.current() + store.by() }),
    decrement: () => patchState(store, { current: store.current() - store.by() }),
    reset: () => patchState(store, { current: 0 }),
  })),
  withHooks({
    onInit() { /* could load saved state from API here */ },
    onDestroy() { },
  }),
);
```

The component then becomes very thin:

```ts
export class CounterPage {
  store = inject(counterStore);
  // ...
}
```

### Lifting State / Service Scope

A `PrefsPage` was added to the `signalsdemos` area — it lets the user pick the "by" value (1, 3, or 5). Both `CounterPage` and `PrefsPage` inject the same `counterStore`, demonstrating how the store is shared.

Discussion of *where* to provide a store:
- `providers: [counterStore]` on a component → fresh instance scoped to that component
- Provided at the route level → shared across all components in that route subtree
- Provided at `ApplicationConfig` level → singleton for the whole app

---

## Day 3 — Wednesday, March 18

### Morning: Lab Prep + Lab

The day began with some housekeeping:
- Icons were added to `ui-common/icons/types.ts`
- The `feature-landing` schematic was fixed (it had a bug)
- Lab files were committed: `labs/counter.md`, `labs/pomodoro.md`, `labs/text-analyzer.md`

Students worked through the **Counter Lab** — recreating what was demoed on Tuesday (a counter with a signal store, prefs page, FizzBuzz) in their own `counter` feature area using the schematic.

The `fizzBuzz` logic was also extracted into a pure utility function in `stores/utils.ts` — a small lesson in testable, framework-free logic:

```ts
export function fizzBuzz(current: number): string {
  if (current === 0) return 'zero';
  if (current % 3 === 0 && current % 5 === 0) return 'FizzBuzz';
  if (current % 3 === 0) return 'Fizz';
  if (current % 5 === 0) return 'Buzz';
  return 'none';
}
```

### MSW (Mock Service Worker)

Before building the API layer, **Mock Service Worker** was introduced as the dev/test HTTP mock. A `resources` handler was added at `src/app/__mocks__/resources/handler.ts`:

```ts
export const handlers = [
  http.get('/api/resources', async () => {
    await delay();  // simulates real network latency
    return HttpResponse.json(fakeResources);
  }),
];
```

MSW intercepts requests at the service worker level, so the app code calls `/api/resources` with no idea it's being mocked. Wired into `app.config.ts` for dev mode only.

This was set up as the backend for a new **Resources** feature area — a "developer resources link list" app.

### `httpResource` — Angular's New Resource API

The `ListPage` in the resources feature introduced `httpResource` (new in Angular 19):

```ts
export class ListPage {
  linksResource = httpResource<ResourceApiItemModel[]>(() => '/api/resources');
}
```

- Returns a resource object with `.value()`, `.isLoading()`, `.error()` — all signals
- The callback is a signal-based reactive expression: if it reads other signals, the request re-fires when they change
- Template usage with loading state and `@for`:

```html
@if (linksResource.isLoading()) {
  <span class="loading loading-spinner text-primary"></span>
} @else {
  <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
    @for (link of linksResource.value(); track link.id) {
      <div class="card bg-base-100 card-xs shadow-sm">
        <h2 class="card-title text-xl text-accent">{{ link.title }}</h2>
        <a [href]="link.url" target="_blank">Visit {{ link.url | extractHost: true }}</a>
      </div>
    } @empty {
      <div class="alert alert-error">No resources found.</div>
    }
  </div>
}
```

Types were extracted into a `types.ts` file:

```ts
export type ResourceApiItemModel = { id: string; title: string; url: string };
export type ResourceApiCreateModel = Omit<ResourceApiItemModel, 'id'>;
```

### Custom Pipes

An `ExtractHostPipe` was built to display friendly link labels (e.g. "Angular" from `https://angular.dev`). Demonstrated building a custom `PipeTransform` in a feature-area `util-pipes` directory — keeping it scoped to the feature rather than putting it in shared prematurely:

```ts
@Pipe({ name: 'extractHost', standalone: true })
export class ExtractHostPipe implements PipeTransform {
  transform(url: string, titleCase = false): string {
    try {
      const urlObj = new URL(url);
      const name = urlObj.hostname.replace(/^www\./, '').split('.')[0];
      return titleCase ? name.charAt(0).toUpperCase() + name.slice(1) : name;
    } catch {
      return url;
    }
  }
}
```

### Signal-Based Forms (`@angular/forms/signals`)

The afternoon covered the new signal-based forms API. An `AddPage` was built for submitting new resources:

```ts
export class AddPage {
  #model = signal<ResourceApiCreateModel>({ title: '', url: '' });

  form = form(
    this.#model,
    (s) => {
      required(s.title, { message: 'We need a title for this link' });
      minLength(s.title, 3, { message: 'Title must be at least 3 characters long' });
      required(s.url, { message: 'We need a URL for this link' });
    },
    {
      submission: {
        action: async (form) => {
          const val = form().value();
          console.log(val);  // TODO: wire to API
        },
        onInvalid: (form) => {
          form().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
      },
    },
  );
}
```

Template uses `[formRoot]` and `[formField]` directives. Validation errors are read from `form.title().errors()` and `form.title().invalid()`.

An `Add2Page` was also built to show an alternative approach: using a shared `FormInputComponent` from `ui-common` to encapsulate the label + input + error display pattern, reducing template boilerplate significantly.

### Afternoon Wrap-up

- Brief discussion of BFF (Backend for Frontend) pattern — diagram committed
- The final "cleanup" commits polished the list page UI (responsive grid, `TitleCasePipe`, card styling) and added the `add2` route

---

## Day 4 — Thursday, March 19 *(tomorrow)*

Per the instructor notes (`26-3.19.md`), Thursday's plan includes:
- Lab work (picking up from Wednesday, possibly the pomodoro or text-analyzer labs)
- Review of what was covered
- More complex state management
- Routing: route params, route guards
- The Resource model (more depth on `httpResource`)
- RxJS interop

---

## Topics Reference

| Topic | Where in Code |
|---|---|
| Signal basics (`signal`, `set`, `update`) | `signalsdemos/.../counter.ts` (Tue before lunch) |
| `computed` and `effect` | `signalsdemos/.../counter.ts` (Tue afternoon) |
| `input.required<T>()` | `signalsdemos/.../fizz-buzz.ts` |
| NgRx Signal Store | `signalsdemos/.../stores/counter-store.ts` |
| Mock Service Worker | `__mocks__/resources/handler.ts` |
| `httpResource` | `resources/.../pages/list.ts` |
| Custom pipe | `resources/util-pipes/extract-host.ts` |
| Signal forms | `resources/.../pages/add.ts`, `add2.ts` |
| Feature schematic | `schematics/src/feature-landing/` |
| Architecture boundaries | `sheriff.config.ts` |
