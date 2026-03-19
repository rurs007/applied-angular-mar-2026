import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { icons } from '@ht/shared/ui-common/icons/types';
import { appUiStore } from '@ht/shared/util-prefs/ui.store';
import { authStore } from '@ht/shared/util-auth/store';
import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      withExperimentalAutoCleanupInjectors(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules), // download all those as soon as the hit main, so, preemptively
    ),

    authStore,
    appUiStore,
    provideIcons(icons),
  ],
};
