import { Routes } from '@angular/router';
import { isDevMode } from '@angular/core';

const realRoutes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./areas/home/feature-landing/landing.routes').then((r) => r.homeLandingFeatureRoutes),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./areas/profile/feature-landing/landing.routes').then(
        (r) => r.profileLandingFeatureRoutes,
      ),
  },
  {
    path: 'demos',
    loadChildren: () =>
      import('./areas/signalsdemos/signalsdemos-landing/signalsdemos.routes').then(
        (r) => r.signalsdemosFeatureRoutes,
      ),
  },
  {
    path: 'resources',
    loadChildren: () =>
      import('./areas/resources/resources-landing/resources.routes').then(
        (r) => r.resourcesFeatureRoutes,
      ),
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./areas/books/books-landing/books.routes').then((r) => r.booksFeatureRoutes),
  },
  {
    path: 'pomodorofinal',
    loadChildren: () =>
      import('./areas/pomodorofinal/pomodorofinal-landing/pomodorofinal.routes').then(
        (r) => r.pomodorofinalFeatureRoutes,
      ),
  },
  {
    path: 'text-analyzer-final',
    loadChildren: () =>
      import('./areas/text-analyzer-final/text-analyzer-final-landing/text-analyzer-final.routes').then(
        (r) => r.textAnalyzerFinalFeatureRoutes,
      ),
  },
];

const devRoutes: Routes = [
  {
    path: 'dev',
    loadChildren: () =>
      import('./areas/dev/home-landing/home.routes').then((r) => r.homeFeatureRoutes),
  },
];

const redirectRoutes: Routes = [
  {
    path: '**',
    redirectTo: 'home',
  },
];

export const routes: Routes = [...realRoutes, ...(isDevMode() ? devRoutes : []), ...redirectRoutes];
