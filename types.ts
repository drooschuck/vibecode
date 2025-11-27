export enum Language {
  PYTHON = 'Python',
  JAVA = 'Java',
  C = 'C',
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // HTML/Markdown content
  initialCode: string;
  solutionCode: string;
  language: Language;
}

export interface Project {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  language: Language;
  starterCode: string;
}

export interface Course {
  id: string;
  language: Language;
  title: string;
  description: string;
  level: string;
  lessons: Lesson[];
  color: string;
  icon: string; // emoji or icon name
}

export interface UserProgress {
  completedLessonIds: string[];
  completedProjectIds: string[];
  hoursLearned: number;
  streakDays: number;
  lastLoginDate: string;
}

export interface AiResponse {
  text: string;
  error?: string;
}