import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { GuessInputComponent } from './components/guess-input/guess-input.component';
import { GuessRowComponent } from './components/guess-row/guess-row.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GuessInputComponent, GuessRowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Kisekidle');
  public gameService = inject(GameService);
}
