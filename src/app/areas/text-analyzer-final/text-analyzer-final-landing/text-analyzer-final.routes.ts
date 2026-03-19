import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { AnalyzerPage } from './internal/pages/analyzer';
import { SettingsPage } from './internal/pages/settings';
import { HistoryPage } from './internal/pages/history';

export const textAnalyzerFeatureRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: Home,
    children: [
      {
        path: '',
        redirectTo: 'analyze',
        pathMatch: 'full',
      },
      {
        path: 'analyze',
        title: 'Analyze',
        component: AnalyzerPage,
      },
      {
        path: 'settings',
        title: 'Settings',
        component: SettingsPage,
      },
      {
        path: 'history',
        title: 'History',
        component: HistoryPage,
      },
    ],
  },
];
