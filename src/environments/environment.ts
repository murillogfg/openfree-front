export const environment = {
  production: false,

  apiUrl: 'http://localhost:8080',

  /*
   * Pagamento simulado (sem gateway real).
   * Em produção fica desligado: nenhuma empresa
   * pode marcar um pagamento como feito sem pagar.
   */
  payments: {
    simulationEnabled: true
  },

  ads: {
    enabled: false,
    cooldownMinutes: 20
  }
};