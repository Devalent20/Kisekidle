import { Injectable, signal, computed } from '@angular/core';
import { Character, GuessResult, AttributeFeedback, FeedbackStatus } from '../models/character.model';
import { CHARACTERS } from '../utils/characters.data';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly allCharacters = CHARACTERS;
  private readonly targetCharacter = signal<Character>(this.getRandomCharacter());
  
  readonly guesses = signal<GuessResult[]>([]);
  readonly gameOver = signal<boolean>(false);
  readonly won = signal<boolean>(false);

  private getRandomCharacter(): Character {
    const randomIndex = Math.floor(Math.random() * this.allCharacters.length);
    return this.allCharacters[randomIndex];
  }

  getAvailableCharacters(): Character[] {
    return this.allCharacters;
  }

  submitGuess(character: Character): void {
    if (this.gameOver()) return;

    const feedback = this.calculateFeedback(character, this.targetCharacter());
    const isCorrect = character.id === this.targetCharacter().id;

    const result: GuessResult = {
      character,
      feedback,
      isCorrect
    };

    this.guesses.update(prev => [result, ...prev]);

    if (isCorrect) {
      this.won.set(true);
      this.gameOver.set(true);
    }
  }

  private calculateFeedback(guess: Character, target: Character): GuessResult['feedback'] {
    return {
      gender: this.checkSimpleMatch(guess.gender, target.gender),
      weapon: this.checkArrayMatch(guess.weapon, target.weapon),
      nationality: this.checkArrayMatch(guess.nationality, target.nationality),
      affiliation: this.checkArrayMatch(guess.affiliation, target.affiliation),
      age: this.checkAgeMatch(Number(guess.age), Number(target.age)),
      debutGame: this.checkDebutMatch(guess.debutGame, target.debutGame)
    };
  }

  private checkSimpleMatch(guess: any, target: any): AttributeFeedback {
    return {
      status: guess === target ? 'correct' : 'incorrect',
      value: guess
    };
  }

  private checkArrayMatch(guess: string | string[], target: string | string[]): AttributeFeedback {
    const guessArr = Array.isArray(guess) ? guess : [guess];
    const targetArr = Array.isArray(target) ? target : [target];

    const intersections = guessArr.filter(item => targetArr.includes(item));
    
    if (intersections.length === targetArr.length && guessArr.length === targetArr.length) {
      return { status: 'correct', value: guess };
    } else if (intersections.length > 0) {
      return { status: 'partial', value: guess };
    }
    return { status: 'incorrect', value: guess };
  }

  private checkAgeMatch(guess: number, target: number): AttributeFeedback {
    if (guess === target) {
      return { status: 'correct', value: guess };
    }
    
    const diff = Math.abs(guess - target);
    return {
      status: diff <= 2 ? 'partial' : 'incorrect',
      value: guess,
      comparison: guess < target ? 'up' : 'down'
    };
  }

  private checkDebutMatch(guess: string, target: string): AttributeFeedback {
    if (guess === target) {
      return { status: 'correct', value: guess };
    }

    // Basic Arc logic
    const liberl = ['FC', 'SC', '3rd'];
    const crossbell = ['Zero', 'Azure'];
    const erebonia = ['CS1', 'CS2', 'CS3', 'CS4', 'Reverie'];
    const calvard = ['Daybreak', 'Daybreak 2'];

    const getArc = (game: string) => {
      if (liberl.includes(game)) return 'liberl';
      if (crossbell.includes(game)) return 'crossbell';
      if (erebonia.includes(game)) return 'erebonia';
      if (calvard.includes(game)) return 'calvard';
      return 'unknown';
    };

    if (getArc(guess) === getArc(target)) {
      return { status: 'partial', value: guess };
    }

    // Order of games for arrows
    const order = [...liberl, ...crossbell, ...erebonia, ...calvard];
    const guessIdx = order.indexOf(guess);
    const targetIdx = order.indexOf(target);

    return {
      status: 'incorrect',
      value: guess,
      comparison: guessIdx < targetIdx ? 'up' : 'down'
    };
  }
}
