import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalSeoService } from '../../core/services/legal-seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class Terms implements OnInit {
  private readonly seo = inject(LegalSeoService);

  ngOnInit(): void {
    this.seo.setPage(
      'Termos de Uso | OpenFree',
      'Consulte as condições de uso da OpenFree para empresas e profissionais freelancers.',
      '/terms'
    );
  }
}