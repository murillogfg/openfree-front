import {
  DOCUMENT
} from '@angular/common';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Meta,
  Title
} from '@angular/platform-browser';

import {
  Vaga
} from '../models/job.models';


@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private readonly siteUrl =
    'https://openfree-front.vercel.app';


  private readonly jobPostingScriptId =
    'openfree-job-posting-jsonld';


  private readonly title =
    inject(Title);

  private readonly meta =
    inject(Meta);

  private readonly document =
    inject(DOCUMENT);


  /*
   * =====================================================
   * LISTAGEM PÚBLICA DE VAGAS
   * =====================================================
   *
   * A listagem pode ser indexada, mas NÃO recebe
   * JobPosting. O Google orienta usar JobPosting
   * somente na página individual da vaga.
   */
  setJobsPage(): void {

    this.removeJobPosting();

    const title =
      'Vagas e oportunidades para freelancers | OpenFree';

    const description =
      'Encontre vagas e oportunidades para freelancers na OpenFree. Consulte trabalhos publicados por empresas e encontre sua próxima oportunidade.';

    const url =
      `${this.siteUrl}/jobs`;


    this.applyPageMetadata(
      title,
      description,
      url,
      'website'
    );
  }


  /*
   * =====================================================
   * DETALHE PÚBLICO DA VAGA
   * =====================================================
   */
  setJobPage(
    job: Vaga
  ): void {

    const title =
      `${job.titulo} em ${job.cidade}, ${job.estado} | OpenFree`;


    const description =
      this.buildMetaDescription(
        job
      );


    const url =
      `${this.siteUrl}/jobs/${job.id}`;


    this.applyPageMetadata(
      title,
      description,
      url,
      'website'
    );


    this.setJobPosting(
      job,
      url
    );
  }


  /*
   * =====================================================
   * PÁGINA NÃO INDEXÁVEL
   * =====================================================
   */
  setNoIndex(
    title = 'OpenFree'
  ): void {

    this.removeJobPosting();

    this.title.setTitle(
      title
    );


    this.meta.updateTag({
      name: 'robots',
      content: 'noindex, nofollow'
    });


    this.removeCanonical();
  }


  /*
   * =====================================================
   * METADATA
   * =====================================================
   */
  private applyPageMetadata(
    title: string,
    description: string,
    url: string,
    type: string
  ): void {

    this.title.setTitle(
      title
    );


    this.meta.updateTag({
      name: 'description',
      content: description
    });


    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow'
    });


    this.meta.updateTag({
      property: 'og:site_name',
      content: 'OpenFree'
    });


    this.meta.updateTag({
      property: 'og:type',
      content: type
    });


    this.meta.updateTag({
      property: 'og:locale',
      content: 'pt_BR'
    });


    this.meta.updateTag({
      property: 'og:title',
      content: title
    });


    this.meta.updateTag({
      property: 'og:description',
      content: description
    });


    this.meta.updateTag({
      property: 'og:url',
      content: url
    });


    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary'
    });


    this.meta.updateTag({
      name: 'twitter:title',
      content: title
    });


    this.meta.updateTag({
      name: 'twitter:description',
      content: description
    });


    this.setCanonical(
      url
    );
  }


  /*
   * =====================================================
   * JOBPOSTING JSON-LD
   * =====================================================
   *
   * Apenas dados reais existentes na vaga são
   * enviados. Não inventamos CEP, endereço,
   * salário por hora nem prazo de candidatura.
   */
  private setJobPosting(
    job: Vaga,
    url: string
  ): void {

    this.removeJobPosting();


    const structuredData = {

      '@context':
        'https://schema.org/',

      '@type':
        'JobPosting',

      title:
        job.titulo,

      description:
        this.buildJobPostingDescription(
          job
        ),

      identifier: {
        '@type':
          'PropertyValue',

        name:
          'OpenFree',

        value:
          String(
            job.id
          )
      },

      datePosted:
        this.toIsoDate(
          job.createdAt
        ),

      employmentType:
        'CONTRACTOR',

      hiringOrganization: {
        '@type':
          'Organization',

        name:
          job.empresaNome
      },

      jobLocation: {
        '@type':
          'Place',

        address: {
          '@type':
            'PostalAddress',

          addressLocality:
            job.cidade,

          addressRegion:
            job.estado,

          addressCountry:
            'BR'
        }
      },

      url
    };


    const script =
      this.document
        .createElement(
          'script'
        );


    script.id =
      this.jobPostingScriptId;


    script.type =
      'application/ld+json';


    /*
     * O conteúdo das vagas vem de usuários.
     * Escapamos "<" para evitar que texto
     * inserido por usuário interfira na tag
     * <script>.
     */
    script.textContent =
      JSON.stringify(
        structuredData
      )
        .replace(
          /</g,
          '\\u003c'
        );


    this.document
      .head
      .appendChild(
        script
      );
  }


  private removeJobPosting(): void {

    const script =
      this.document
        .getElementById(
          this.jobPostingScriptId
        );


    script?.remove();
  }


  /*
   * =====================================================
   * DESCRIPTION COMPLETA PARA JOBPOSTING
   * =====================================================
   *
   * O Google pede uma descrição completa da vaga.
   * Por isso não usamos apenas job.descricao:
   * reunimos descrição, requisitos e informações
   * operacionais que já existem na própria vaga.
   */
  private buildJobPostingDescription(
    job: Vaga
  ): string {

    const partes:
      string[] =
      [];


    const descricao =
      this.escapeHtml(
        job.descricao
          ?? ''
      )
        .trim();


    if (
      descricao
    ) {

      partes.push(
        `<p>${descricao}</p>`
      );
    }


    const requisitos =
      this.escapeHtml(
        job.requisitos
          ?? ''
      )
        .trim();


    if (
      requisitos
    ) {

      partes.push(
        '<p>Requisitos:</p>',
        `<p>${requisitos}</p>`
      );
    }


    const detalhes:
      string[] =
      [];


    if (
      job.dataServico
    ) {

      detalhes.push(
        `Data do serviço: ${
          this.escapeHtml(
            String(
              job.dataServico
            )
          )
        }`
      );
    }


    if (
      job.horarioInicio
      && job.horarioFim
    ) {

      detalhes.push(
        `Horário: ${
          this.escapeHtml(
            String(
              job.horarioInicio
            )
          )
        } às ${
          this.escapeHtml(
            String(
              job.horarioFim
            )
          )
        }`
      );
    }


    if (
      job.quantidadePessoas
    ) {

      detalhes.push(
        `Quantidade de profissionais: ${
          job.quantidadePessoas
        }`
      );
    }


    if (
      detalhes.length > 0
    ) {

      partes.push(
        '<p>Informações da oportunidade:</p>',
        '<ul>',
        ...detalhes.map(
          detalhe =>
            `<li>${detalhe}</li>`
        ),
        '</ul>'
      );
    }


    return partes.join(
      ''
    );
  }


  /*
   * =====================================================
   * CANONICAL
   * =====================================================
   */
  private setCanonical(
    url: string
  ): void {

    let canonical =
      this.document
        .head
        .querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        );


    if (
      !canonical
    ) {

      canonical =
        this.document
          .createElement(
            'link'
          );


      canonical.setAttribute(
        'rel',
        'canonical'
      );


      this.document
        .head
        .appendChild(
          canonical
        );
    }


    canonical.setAttribute(
      'href',
      url
    );
  }


  private removeCanonical(): void {

    const canonical =
      this.document
        .head
        .querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        );


    canonical?.remove();
  }


  /*
   * =====================================================
   * META DESCRIPTION
   * =====================================================
   */
  private buildMetaDescription(
    job: Vaga
  ): string {

    const texto =
      `${job.titulo} na ${job.empresaNome}, em ${job.cidade} - ${job.estado}. ${job.descricao}`
        .replace(
          /\s+/g,
          ' '
        )
        .trim();


    if (
      texto.length <= 155
    ) {
      return texto;
    }


    return `${texto.substring(
      0,
      152
    ).trim()}...`;
  }


  /*
   * =====================================================
   * HELPERS
   * =====================================================
   */
  private toIsoDate(
    value: unknown
  ): string {

    const texto =
      String(
        value
        ?? ''
      );


    /*
     * createdAt já vem da API em formato ISO,
     * por exemplo:
     *
     * 2026-08-19T23:23:29.721931
     *
     * Para datePosted basta a data original.
     */
    return texto
      .substring(
        0,
        10
      );
  }


  private escapeHtml(
    value: string
  ): string {

    return value
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );
  }
}