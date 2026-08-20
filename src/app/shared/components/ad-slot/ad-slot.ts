import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-ad-slot',
  standalone: true,

  template: `
    <section class="ad-slot">

      <button
        type="button"
        class="close-button"
        aria-label="Fechar anúncio"
        (click)="fechar()"
      >
        ×
      </button>

      <span class="ad-label">
        Conteúdo patrocinado
      </span>

      <div class="ad-placeholder">

        <strong>
          Ajude a manter a OpenFree aberta
        </strong>

        <p>
          Este espaço será usado para anúncios
          leves e selecionados.
        </p>

      </div>

    </section>
  `,

  styles: [`
    :host {
      display: block;
    }

    .ad-slot {
      position: relative;

      padding: 22px;

      border:
        1px solid
        rgba(255, 255, 255, 0.08);

      border-radius: 18px;

      background:
        rgba(15, 23, 44, 0.96);

      text-align: center;
    }

    .ad-label {
      display: block;

      margin-bottom: 12px;

      color: #707b99;

      font-size: 9px;
      font-weight: 800;

      text-transform: uppercase;

      letter-spacing: 0.12em;
    }

    .ad-placeholder {
      padding: 22px;

      border-radius: 14px;

      background:
        rgba(102, 113, 255, 0.05);
    }

    .ad-placeholder strong {
      color: #ffffff;
    }

    .ad-placeholder p {
      margin: 7px 0 0;

      color: #808ba7;

      font-size: 12px;
    }

    .close-button {
      position: absolute;

      top: 10px;
      right: 10px;

      width: 30px;
      height: 30px;

      border: 0;

      border-radius: 9px;

      background:
        rgba(255, 255, 255, 0.05);

      color: #9aa4bd;

      cursor: pointer;

      font-size: 18px;
    }

    .close-button:hover {
      background:
        rgba(255, 255, 255, 0.1);

      color: #ffffff;
    }
  `]
})
export class AdSlot {

  @Output()
  close =
    new EventEmitter<void>();

  fechar(): void {

    this.close.emit();
  }
}