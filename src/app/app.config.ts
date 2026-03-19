import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withViewTransitions,
} from '@angular/router';

import { icons } from '@ht/shared/ui-common/icons/types';
import { appUiStore } from '@ht/shared/util-prefs/ui.store';
import { authStore } from '@ht/shared/util-auth/store';
import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';
import { counterStore } from '@ht/signalsdemos/signalsdemos-landing/internal/stores/counter-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      withExperimentalAutoCleanupInjectors(),
      withComponentInputBinding(),
    ),

    authStore,
    appUiStore,
    provideIcons(icons),
  ],
};
