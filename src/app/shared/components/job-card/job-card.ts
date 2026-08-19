import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  CurrencyPipe,
  DatePipe
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { Vaga } from '../../../core/models/job.models';

@Component({
  selector: 'app-job-card',
  standalone: true,

  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink
  ],

  templateUrl: './job-card.html',
  styleUrl: './job-card.css'
})
export class JobCard {

  @Input({ required: true })
  job!: Vaga;

  @Input()
  isCompany = false;

  @Input()
  isFavorite = false;

  @Input()
  favoriteLoading = false;

  @Output()
  favoriteToggle =
    new EventEmitter<Vaga>();

  alternarFavorito(): void {

    if (
      this.isCompany
      || this.favoriteLoading
    ) {
      return;
    }

    this.favoriteToggle.emit(
      this.job
    );
  }
}