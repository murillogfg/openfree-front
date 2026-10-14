import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

/*
 * Comportamentos que só existem quando o OpenFree
 * roda como aplicativo (Android/iOS).
 *
 * No navegador nada aqui é executado.
 */
@Injectable({
  providedIn: 'root'
})
export class NativeAppService {

  private readonly router =
    inject(Router);

  private readonly zone =
    inject(NgZone);

  /*
   * Telas "raiz": apertar voltar nelas
   * fecha o app em vez de voltar página.
   */
  private readonly telasRaiz = [
    '/',
    '/jobs',
    '/login',
    '/dashboard/freelancer',
    '/dashboard/company'
  ];

  get isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  init(): void {

    if (!this.isNative) {
      return;
    }

    document.documentElement
      .classList
      .add('native-app');

    this.configurarStatusBar();
    this.configurarBotaoVoltar();
  }

  private configurarStatusBar(): void {

    StatusBar
      .setStyle({ style: Style.Dark })
      .catch(() => undefined);

    if (Capacitor.getPlatform() === 'android') {
      StatusBar
        .setBackgroundColor({ color: '#080d1b' })
        .catch(() => undefined);
    }
  }

  /*
   * Botão voltar do Android:
   * volta a página quando dá; nas telas
   * principais, fecha o app.
   */
  private configurarBotaoVoltar(): void {

    App.addListener(
      'backButton',
      ({ canGoBack }) => {

        this.zone.run(() => {

          const rota =
            this.router.url.split('?')[0];

          if (
            !canGoBack
            || this.telasRaiz.includes(rota)
          ) {
            App.exitApp();
            return;
          }

          window.history.back();
        });
      }
    );
  }
}
