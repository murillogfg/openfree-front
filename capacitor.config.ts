import type { CapacitorConfig } from '@capacitor/cli';

/*
 * Configuração do app OpenFree (Android e iOS).
 *
 * O app usa o mesmo build do site (Angular) e
 * conversa com a mesma API do Railway.
 *
 * Origem das requisições dentro do app:
 *   Android -> https://localhost
 *   iOS     -> capacitor://localhost
 * Por isso a API precisa liberar essas origens no CORS.
 */
const config: CapacitorConfig = {
  appId: 'br.com.genovaforge.openfree',
  appName: 'OpenFree',
  webDir: 'dist/openfree-front/browser',

  android: {
    // Só permite HTTPS (a API em produção já é HTTPS).
    allowMixedContent: false
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: false
    },

    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#080d1b'
    }
  }
};

export default config;
