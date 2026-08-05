import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(component => component.Login)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(component => component.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard/freelancer',
        loadComponent: () =>
          import('./pages/dashboard-freelancer/dashboard-freelancer')
            .then(component => component.DashboardFreelancer)
      },
      {
        path: 'dashboard/company',
        loadComponent: () =>
          import('./pages/dashboard-company/dashboard-company')
            .then(component => component.DashboardCompany)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./pages/jobs/jobs')
            .then(component => component.Jobs)
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications')
            .then(component => component.Applications)
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/chat/chat')
            .then(component => component.Chat)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile')
            .then(component => component.Profile)
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];