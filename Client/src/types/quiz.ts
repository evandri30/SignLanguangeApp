export interface QuizQuestion {
  id: number;
  question_text: string;
  image_path: string | null;
  options: string[];
  correct_answer: string;
}

export interface QuizHistoryItem {
  id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  created_at: string;
}

export interface QuizLobbyProps {
  loading: boolean;
  error: string | null;
  startQuiz: () => void;
  loadingHistory: boolean;
  history: QuizHistoryItem[];
}

export interface QuizActiveProps {
  currentIdx: number;
  questions: QuizQuestion[];
  selectedAns: string | null;
  handleAnswerSelect: (option: string) => void;
  API_BASE_URL: string;
}

export interface QuizFinishedProps {
  correctCount: number;
  totalQuestions: number;
  startQuiz: () => void;
}

export interface InfoCardProps {
    number: string;
    title: string;
    description: string;
}