import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class LegalSeoService {
  private readonly siteUrl = 'https://openfree-front.vercel.app';
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setPage(pageTitle: string, description: string, path: string): void {
    const url = `${this.siteUrl}${path}`;

    this.document
      .getElementById('openfree-job-posting-jsonld')
      ?.remove();

    this.title.setTitle(pageTitle);

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
      content: 'website'
    });

    this.meta.updateTag({
      property: 'og:locale',
      content: 'pt_BR'
    });

    this.meta.updateTag({
      property: 'og:title',
      content: pageTitle
    });

    this.meta.updateTag({
      property: 'og:description',
      content: description
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let canonical =
      this.document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
  }
}