import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { TimerPage } from './internal/pages/timer';
import { PrefsPage } from './internal/pages/prefs';

export const pomodoroFeatureRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: Home,
    children: [
      {
        path: '',
        redirectTo: 'timer',
        pathMatch: 'full',
      },
      {
        path: 'timer',
        title: 'Timer',
        component: TimerPage,
      },
      {
        path: 'prefs',
        title: 'Settings',
        component: PrefsPage,
      },
    ],
  },
];
