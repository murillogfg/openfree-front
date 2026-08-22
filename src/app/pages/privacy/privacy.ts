import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalSeoService } from '../../core/services/legal-seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class Privacy implements OnInit {
  private readonly seo = inject(LegalSeoService);

  ngOnInit(): void {
    this.seo.setPage(
      'Política de Privacidade | OpenFree',
      'Saiba como a OpenFree trata dados pessoais, cookies, publicidade, segurança e direitos de privacidade.',
      '/privacy'
    );
  }
}