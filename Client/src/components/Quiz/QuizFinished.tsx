import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Trophy, RotateCcw, BookOpen, Award, Sparkles, ChevronRight } from "lucide-react";
import { getFeedbackDetails } from "@/utils/quiz";
import type { QuizFinishedProps } from "@/types/quiz";

const FEEDBACK_ICONS = {
  Sparkles: <Sparkles className="h-10 w-10 text-emerald-500" />,
  Award: <Award className="h-10 w-10 text-blue-500" />,
  Trophy: <Trophy className="h-10 w-10 text-yellow-500" />,
  BookOpen: <BookOpen className="h-10 w-10 text-neutral-500" />,
};

export function QuizFinished({
  correctCount,
  totalQuestions,
  startQuiz,
}: QuizFinishedProps) {
  const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const feedback = getFeedbackDetails(finalScore);

  return (
    <motion.div
      key="finished"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-lg mx-auto space-y-10 text-center w-full"
    >
      <div className="space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-neutral-900 opacity-5 rounded-full scale-105" />
          <div className="h-40 w-40 rounded-full border-4 border-neutral-950 flex flex-col items-center justify-center p-4 bg-neutral-900 text-white shadow-xl">
            <span className="text-5xl font-extrabold tracking-tighter">
              {finalScore}
            </span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
              Skor Akhir
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Hasil Kuis</p>
          <p className="text-sm font-bold text-neutral-800 mt-1">
            {correctCount} Jawaban Benar dari {totalQuestions} Soal
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border border-neutral-100 space-y-3 ${feedback.color}`}>
        <div className="flex justify-center">{FEEDBACK_ICONS[feedback.iconName]}</div>
        <p className="text-xl font-extrabold">{feedback.title}</p>
        <p className="text-xs leading-relaxed max-w-sm mx-auto font-medium">
          {feedback.desc}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={startQuiz}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl shadow hover:bg-neutral-800 transition-colors active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Ulangi Kuis Baru
        </button>
        <Link
          to="/sibi-info"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Belajar Abjad SIBI
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
