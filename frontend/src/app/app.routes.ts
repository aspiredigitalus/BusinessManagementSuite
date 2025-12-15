import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./system/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'people',
        loadComponent: () => import('./peoplemanagement/people-list/people-list.component')
          .then(m => m.PeopleListComponent)
      },
      {
        path: 'modules',
        loadComponent: () => import('./modules/module-store/module-store.component')
          .then(m => m.ModuleStoreComponent)
      },
      {
        path: 'setup',
        loadComponent: () => import('./system/setup/setup.component')
          .then(m => m.SetupComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
