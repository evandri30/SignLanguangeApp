import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizActiveProps } from "@/types/quiz";

export function QuizActive({
  currentIdx,
  questions,
  selectedAns,
  handleAnswerSelect,
  API_BASE_URL,
}: QuizActiveProps) {
  const currentQuestion = questions[currentIdx];
  const progressPercent = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  if (!currentQuestion) return null;

  return (
    <motion.div
      key={currentIdx}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="max-w-2xl mx-auto space-y-8 w-full"
    >
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-bold text-neutral-400 uppercase tracking-widest">
            Pertanyaan {currentIdx + 1} dari {questions.length}
          </span>
          <span className="font-bold text-neutral-800 tabular-nums">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neutral-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-neutral-800 leading-relaxed whitespace-pre-line">
          {currentQuestion.question_text}
        </h2>

        {currentQuestion.image_path && (
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 flex flex-col items-center justify-center aspect-video max-h-64 shadow-inner overflow-hidden">
            <img
              src={`${API_BASE_URL}${currentQuestion.image_path}`}
              alt="Gerakan Isyarat SIBI"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAns === option;
          const isCorrect = option.toUpperCase() === currentQuestion.correct_answer.toUpperCase();
          const isWrongSelected = isSelected && !isCorrect;

          let btnStyle = "border-neutral-200 hover:border-neutral-800 hover:bg-neutral-50 text-neutral-800";
          let indicatorIcon = null;

          if (selectedAns !== null) {
            if (isCorrect) {
              btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold scale-[1.01]";
              indicatorIcon = <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
            } else if (isWrongSelected) {
              btnStyle = "border-red-600 bg-red-50 text-red-900 font-bold";
              indicatorIcon = <XCircle className="h-5 w-5 text-red-600 shrink-0" />;
            } else {
              btnStyle = "border-neutral-100 bg-white opacity-40 text-neutral-400";
            }
          }

          return (
            <button
              key={option}
              disabled={selectedAns !== null}
              onClick={() => handleAnswerSelect(option)}
              className={`flex items-center justify-between p-5 border-2 rounded-xl text-left text-sm font-semibold transition-all duration-150 active:scale-[0.99] ${btnStyle}`}
            >
              <span className="leading-snug">Pilihan {option}</span>
              {indicatorIcon}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
