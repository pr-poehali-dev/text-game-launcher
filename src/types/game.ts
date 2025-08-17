export interface Task {
  id: number;
  title: string;
  description: string;
  options: string[];
  solution: number;
  hint: string;
  level: number;
}

export interface GameState {
  currentLevel: number;
  currentTask: Task | null;
  score: number;
  isGameActive: boolean;
  showingHint: boolean;
}

export const LEVELS = {
  1: 'Новичок',
  2: 'Опытный', 
  3: 'Профессионал'
} as const;