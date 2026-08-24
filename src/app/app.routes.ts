import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [

  // =====================================================
  // PÁGINAS PÚBLICAS SEM O LAYOUT PRINCIPAL
  // =====================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(component => component.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(component => component.Register)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password')
        .then(component => component.ForgotPassword)
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password')
        .then(component => component.ResetPassword)
  },


  // =====================================================
  // LAYOUT PRINCIPAL
  // =====================================================
  //
  // O MainLayout pode ser carregado sem login porque
  // algumas páginas dentro dele são públicas:
  //
  // /jobs
  // /jobs/:id
  // /privacy
  // /terms
  //
  // O próprio MainLayout já está preparado para não
  // buscar perfil/notificações quando não há login.
  //
  {
    path: '',

    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(component => component.MainLayout),

    children: [

      // =================================================
      // ROTAS PÚBLICAS
      // =================================================

      {
        path: 'jobs',
        loadComponent: () =>
          import('./pages/jobs/jobs')
            .then(component => component.Jobs)
      },

      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy')
            .then(component => component.Privacy)
      },

      {
        path: 'terms',
        loadComponent: () =>
          import('./pages/terms/terms')
            .then(component => component.Terms)
      },


      // =================================================
      // ROTAS PRIVADAS
      // =================================================
      //
      // Tudo dentro deste grupo exige autenticação.
      //
      {
        path: '',

        canActivate: [
          authGuard
        ],

        children: [

          // =============================================
          // DASHBOARDS
          // =============================================

          {
            path: 'dashboard/freelancer',
            loadComponent: () =>
              import(
                './pages/dashboard-freelancer/dashboard-freelancer'
              )
                .then(
                  component =>
                    component.DashboardFreelancer
                )
          },

          {
            path: 'dashboard/company',
            loadComponent: () =>
              import(
                './pages/dashboard-company/dashboard-company'
              )
                .then(
                  component =>
                    component.DashboardCompany
                )
          },


          // =============================================
          // PERFIL PÚBLICO INTERNO
          // =============================================

          {
            path: 'profile/user/:id',
            loadComponent: () =>
              import(
                './pages/public-profile/public-profile'
              )
                .then(
                  component =>
                    component.PublicProfile
                )
          },


          // =============================================
          // VAGAS PRIVADAS
          // =============================================

          {
            path: 'jobs/create',
            loadComponent: () =>
              import('./pages/job-form/job-form')
                .then(
                  component =>
                    component.JobForm
                )
          },

          {
            path: 'jobs/:id/applications',
            loadComponent: () =>
              import(
                './pages/job-applications/job-applications'
              )
                .then(
                  component =>
                    component.JobApplications
                )
          },


          // =============================================
          // FREELANCER
          // =============================================

          {
            path: 'applications',
            loadComponent: () =>
              import('./pages/applications/applications')
                .then(
                  component =>
                    component.Applications
                )
          },

          {
            path: 'favorites',
            loadComponent: () =>
              import('./pages/favorites/favorites')
                .then(
                  component =>
                    component.Favorites
                )
          },

          {
            path: 'earnings',
            loadComponent: () =>
              import('./pages/earnings/earnings')
                .then(
                  component =>
                    component.Earnings
                )
          },


          // =============================================
          // CONTRATOS
          // =============================================

          {
            path: 'contracts',
            loadComponent: () =>
              import('./pages/contracts/contracts')
                .then(
                  component =>
                    component.Contracts
                )
          },


          // =============================================
          // EMPRESA
          // =============================================

          {
            path: 'finance',
            loadComponent: () =>
              import('./pages/finance/finance')
                .then(
                  component =>
                    component.Finance
                )
          },


          // =============================================
          // COMUNICAÇÃO
          // =============================================

          {
            path: 'chat',
            loadComponent: () =>
              import('./pages/chat/chat')
                .then(
                  component =>
                    component.Chat
                )
          },

          {
            path: 'notifications',
            loadComponent: () =>
              import(
                './pages/notifications/notifications'
              )
                .then(
                  component =>
                    component.Notifications
                )
          },


          // =============================================
          // CONTA
          // =============================================

          {
            path: 'profile',
            loadComponent: () =>
              import('./pages/profile/profile')
                .then(
                  component =>
                    component.Profile
                )
          },

          {
            path: 'company/create',
            loadComponent: () =>
              import(
                './pages/company-register/company-register'
              )
                .then(
                  component =>
                    component.CompanyRegister
                )
          }
        ]
      },


      // =================================================
      // DETALHE PÚBLICO DA VAGA
      // =================================================
      //
      // Fica DEPOIS de:
      //
      // /jobs/create
      // /jobs/:id/applications
      //
      // para evitar que "create" seja interpretado
      // como um ID.
      //
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./pages/job-details/job-details')
            .then(
              component =>
                component.JobDetails
            )
      }
    ]
  },


  // =====================================================
  // REDIRECIONAMENTOS
  // =====================================================

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'jobs'
  },

  {
    path: '**',
    redirectTo: 'jobs'
  }
];