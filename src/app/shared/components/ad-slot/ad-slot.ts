import {
  AfterViewInit,
  Component,
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';


@Component({
  selector: 'app-ad-slot',

  standalone: true,

  template: `
    <section
      class="ad-container"
      aria-label="Anúncios"
    >

      <span class="ad-label">
        Anúncios
      </span>

      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-5599361534576915"
        data-ad-slot="7941347963"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

    </section>
  `,

  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .ad-container {
      width: 100%;
      min-height: 120px;

      padding: 18px;

      border:
        1px solid
        rgba(255, 255, 255, 0.07);

      border-radius: 16px;

      background:
        rgba(14, 21, 42, 0.58);

      overflow: hidden;
    }

    .ad-label {
      display: block;

      margin-bottom: 12px;

      color: #707b99;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.08em;
    }

    .adsbygoogle {
      width: 100%;
    }
  `]
})
export class AdSlot
  implements AfterViewInit {

  private readonly platformId =
    inject(PLATFORM_ID);


  ngAfterViewInit(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    /*
     * O script principal do AdSense já está
     * carregado no <head> do index.html.
     *
     * Aqui apenas solicitamos a renderização
     * deste bloco específico.
     */
    setTimeout(
      () => {

        try {

          const adsbygoogle =
            (
              window as Window & {
                adsbygoogle?: unknown[];
              }
            ).adsbygoogle
            ?? [];


          (
            window as Window & {
              adsbygoogle?: unknown[];
            }
          ).adsbygoogle =
            adsbygoogle;


          adsbygoogle.push(
            {}
          );

        }
        catch (
          error
        ) {

          /*
           * Durante a revisão do AdSense ou
           * quando não há inventário disponível,
           * o bloco pode não receber anúncio.
           *
           * Isso não deve quebrar a página.
           */
          console.warn(
            'AdSense ainda não conseguiu renderizar o bloco.',
            error
          );
        }

      },
      0
    );
  }
}