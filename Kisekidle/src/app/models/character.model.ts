export type FeedbackStatus = 'correct' | 'partial' | 'incorrect';

export interface CharacterAttributes {
  gender: string;
  weapon: string | string[];
  nationality: string | string[];
  affiliation: string[];
  age: number | string;
  debutGame: string;
}

export interface Character extends CharacterAttributes {
  id: string;
  name: string;
  imageUrl?: string;
  wikiUrl?: string;
}

export interface AttributeFeedback {
  status: FeedbackStatus;
  value: string | number | string[];
  comparison?: 'up' | 'down'; // For age/debutGame
}

export interface GuessResult {
  character: Character;
  feedback: {
    gender: AttributeFeedback;
    weapon: AttributeFeedback;
    nationality: AttributeFeedback;
    affiliation: AttributeFeedback;
    age: AttributeFeedback;
    debutGame: AttributeFeedback;
  };
  isCorrect: boolean;
}
