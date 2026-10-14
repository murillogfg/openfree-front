export const environment = {
  production: true,

  apiUrl: 'https://openfree-api.genovaforge.com.br',

  /*
   * Pagamento simulado (sem gateway real).
   * Em produção fica desligado: nenhuma empresa
   * pode marcar um pagamento como feito sem pagar.
   */
  payments: {
    simulationEnabled: false
  },

  ads: {
    enabled: false,
    cooldownMinutes: 20
  }
};