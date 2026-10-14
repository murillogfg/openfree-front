import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Capacitor } from '@capacitor/core';

import { AuthService } from '../services/auth.service';

/*
 * Página inicial (landing):
 * - logado        -> vai direto para o painel
 * - no aplicativo -> abre a lista de vagas
 * - visitante web -> vê a landing page
 */
export const homeGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.parseUrl(
      authService.getDefaultDashboard()
    );
  }

  if (Capacitor.isNativePlatform()) {
    return router.parseUrl('/jobs');
  }

  return true;
};
