import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-guess-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="guess-input-container">
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        (input)="onSearch()" 
        placeholder="Search for a character..."
        [disabled]="gameService.gameOver()"
      />
      
      @if (filteredCharacters().length > 0 && searchTerm()) {
        <ul class="suggestions">
          @for (char of filteredCharacters(); track char.id) {
            <li (click)="selectCharacter(char)">
              {{ char.name }}
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .guess-input-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
    }
    input {
      width: 100%;
      padding: 16px 20px;
      border-radius: 12px;
      border: 2px solid rgba(100, 255, 218, 0.2);
      background: rgba(17, 34, 64, 0.8);
      backdrop-filter: blur(5px);
      color: white;
      font-size: 18px;
      outline: none;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px -10px rgba(2, 12, 27, 0.5);
    }
    input:focus {
      border-color: #64ffda;
      background: rgba(17, 34, 64, 1);
      box-shadow: 0 0 20px rgba(100, 255, 218, 0.1);
    }
    .suggestions {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      right: 0;
      background: #112240;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      list-style: none;
      padding: 8px;
      margin: 0;
      z-index: 100;
      max-height: 250px;
      overflow-y: auto;
      box-shadow: 0 20px 40px -15px rgba(2, 12, 27, 0.8);
    }
    li {
      padding: 12px 16px;
      cursor: pointer;
      color: #8892b0;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    li:hover {
      background: rgba(100, 255, 218, 0.1);
      color: #64ffda;
    }
  `]
})
export class GuessInputComponent {
  searchTerm = signal('');
  
  filteredCharacters = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return [];
    
    // Simple filter, excluding characters already guessed
    const alreadyGuessed = this.gameService.guesses().map(g => g.character.id);
    return this.gameService.getAvailableCharacters()
      .filter(c => c.name.toLowerCase().includes(term) && !alreadyGuessed.includes(c.id));
  });

  constructor(public gameService: GameService) {}

  onSearch() {}

  selectCharacter(character: Character) {
    this.gameService.submitGuess(character);
    this.searchTerm.set('');
  }
}
