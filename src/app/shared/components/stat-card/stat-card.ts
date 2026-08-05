import { Component, Input } from '@angular/core';

export type StatCardVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css'
})
export class StatCard {

  @Input({ required: true })
  title = '';

  @Input({ required: true })
  value: string | number = 0;

  @Input()
  icon = '◇';

  @Input()
  description = '';

  @Input()
  variant: StatCardVariant = 'neutral';
}