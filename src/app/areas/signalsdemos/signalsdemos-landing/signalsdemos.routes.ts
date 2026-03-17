import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { HomePage } from './internal/pages/home';
import { CounterPage } from './internal/pages/counter';

export const signalsdemosFeatureRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: Home,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'counter',
        component: CounterPage,
      },
    ],
  },
];
