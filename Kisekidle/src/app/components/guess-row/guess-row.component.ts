import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { GuessResult } from '../../models/character.model';

@Component({
  selector: 'app-guess-row',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('reveal', [
      transition(':enter', [
        query('.cell', [
          style({ opacity: 0, transform: 'rotateX(-90deg)' }),
          stagger(150, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'rotateX(0deg)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="guess-row" @reveal>
      <div class="cell name">{{ guess.character.name }}</div>
      
      <div [class]="'cell ' + guess.feedback.gender.status">
        {{ guess.feedback.gender.value }}
      </div>
      
      <div [class]="'cell ' + guess.feedback.weapon.status">
        {{ formatArray(guess.feedback.weapon.value) }}
      </div>
      
      <div [class]="'cell ' + guess.feedback.nationality.status">
        {{ formatArray(guess.feedback.nationality.value) }}
      </div>
      
      <div [class]="'cell ' + guess.feedback.affiliation.status">
        {{ formatArray(guess.feedback.affiliation.value) }}
      </div>
      
      <div [class]="'cell ' + guess.feedback.age.status">
        {{ guess.feedback.age.value }}
        @if (guess.feedback.age.comparison === 'up') { <span>↑</span> }
        @if (guess.feedback.age.comparison === 'down') { <span>↓</span> }
      </div>
      
      <div [class]="'cell ' + guess.feedback.debutGame.status">
        {{ guess.feedback.debutGame.value }}
        @if (guess.feedback.debutGame.comparison === 'up') { <span>↑</span> }
        @if (guess.feedback.debutGame.comparison === 'down') { <span>↓</span> }
      </div>
    </div>
  `,
  styles: [`
    .guess-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      justify-content: center;
    }
    .cell {
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      color: white;
      padding: 8px;
      background: #112240;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .name {
      background: #0a192f;
      border-color: rgba(100, 255, 218, 0.2);
      font-weight: 700;
    }
    .correct {
      background: #10b981; /* Emerald-500 */
      border-color: #059669;
    }
    .partial {
      background: #fbbf24; /* Amber-400 */
      color: #78350f;
      border-color: #d97706;
    }
    .incorrect {
      background: #ef4444; /* Red-500 */
      border-color: #dc2626;
    }
    span {
      font-size: 24px;
      margin-top: 4px;
      filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
    }
  `]
})
export class GuessRowComponent {
  @Input({ required: true }) guess!: GuessResult;

  formatArray(value: string | number | string[]): string {
    if (typeof value === 'number') return value.toString();
    return Array.isArray(value) ? value.join(', ') : value;
  }
}
