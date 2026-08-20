import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  /*
   * ==========================================
   * CONFIGURAÇÕES DE PUBLICIDADE
   * ==========================================
   *
   * Por enquanto os anúncios reais ficam
   * DESATIVADOS.
   *
   * Quando decidirmos ativar a monetização,
   * alteramos esta configuração ou migramos
   * para environment.ts.
   */
  private readonly ADS_ENABLED = false;

  /*
   * Intervalo mínimo entre anúncios.
   */
  private readonly AD_COOLDOWN_MINUTES = 20;

  /*
   * Preparação para o futuro plano Free/Pro.
   *
   * Free  -> poderá receber anúncios.
   * Pro   -> não receberá anúncios.
   *
   * Ainda não usamos planos no sistema,
   * portanto esta flag fica preparada.
   */
  private readonly FREE_PLAN_ADS_ENABLED = true;

  /*
   * Chave utilizada para armazenar
   * o horário do último anúncio.
   */
  private readonly storageKey =
    'openfree_last_ad_at';

  /*
   * Converte o cooldown configurado
   * em milissegundos.
   */
  private get cooldownMs(): number {

    return (
      this.AD_COOLDOWN_MINUTES
      * 60
      * 1000
    );
  }

  /*
   * ==========================================
   * VERIFICAR SE PODE MOSTRAR ANÚNCIO
   * ==========================================
   */
  shouldShowAd(): boolean {

    /*
     * Publicidade globalmente desligada.
     */
    if (!this.ADS_ENABLED) {
      return false;
    }

    /*
     * Publicidade do plano gratuito
     * desligada.
     */
    if (!this.FREE_PLAN_ADS_ENABLED) {
      return false;
    }

    const lastAd =
      localStorage.getItem(
        this.storageKey
      );

    /*
     * Nunca recebeu anúncio.
     */
    if (!lastAd) {
      return true;
    }

    const lastAdTimestamp =
      Number(lastAd);

    /*
     * Se o valor salvo estiver inválido,
     * permitimos uma nova exibição.
     */
    if (
      !Number.isFinite(
        lastAdTimestamp
      )
    ) {
      return true;
    }

    const elapsed =
      Date.now()
      - lastAdTimestamp;

    /*
     * Só permite outro anúncio depois
     * do cooldown.
     */
    return (
      elapsed
      >= this.cooldownMs
    );
  }

  /*
   * ==========================================
   * REGISTRAR EXIBIÇÃO
   * ==========================================
   */
  registerAdShown(): void {

    /*
     * Não registra nada enquanto
     * publicidade estiver desativada.
     */
    if (!this.ADS_ENABLED) {
      return;
    }

    localStorage.setItem(
      this.storageKey,
      Date.now().toString()
    );
  }

  /*
   * ==========================================
   * TEMPO RESTANTE
   * ==========================================
   */
  getRemainingCooldownMs(): number {

    const lastAd =
      localStorage.getItem(
        this.storageKey
      );

    if (!lastAd) {
      return 0;
    }

    const lastAdTimestamp =
      Number(lastAd);

    if (
      !Number.isFinite(
        lastAdTimestamp
      )
    ) {
      return 0;
    }

    const elapsed =
      Date.now()
      - lastAdTimestamp;

    return Math.max(
      0,
      this.cooldownMs - elapsed
    );
  }

  /*
   * ==========================================
   * RESET
   * ==========================================
   *
   * Útil durante desenvolvimento/testes.
   */
  clearCooldown(): void {

    localStorage.removeItem(
      this.storageKey
    );
  }
}