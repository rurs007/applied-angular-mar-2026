import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { HomePage } from './internal/pages/home';
import { ListPage } from './internal/pages/list';
import { AddPage } from './internal/pages/add';
import { Add2Page } from './internal/pages/add2';

export const resourcesFeatureRoutes: Routes = [
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
        path: 'list',
        component: ListPage,
      },
      {
        path: 'add',
        component: AddPage,
      },
      {
        path: 'add-2',
        component: Add2Page,
      },
    ],
  },
];
