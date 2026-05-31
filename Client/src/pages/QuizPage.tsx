import { AnimatePresence } from "motion/react";
import { Footer } from "@/components/Footer";
import { QuizLobby } from "@/components/Quiz/QuizLobby";
import { QuizActive } from "@/components/Quiz/QuizActive";
import { QuizFinished } from "@/components/Quiz/QuizFinished";
import { useQuiz } from "@/hooks/useQuiz";

export function QuizPage() {
  const {
    gameState,
    questions,
    currentIdx,
    selectedAns,
    correctCount,
    loading,
    error,
    history,
    loadingHistory,
    startQuiz,
    handleAnswerSelect,
    API_BASE_URL,
  } = useQuiz();

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {gameState === "lobby" && (
            <QuizLobby
              loading={loading}
              error={error}
              startQuiz={startQuiz}
              loadingHistory={loadingHistory}
              history={history}
            />
          )}

          {gameState === "playing" && (
            <QuizActive
              currentIdx={currentIdx}
              questions={questions}
              selectedAns={selectedAns}
              handleAnswerSelect={handleAnswerSelect}
              API_BASE_URL={API_BASE_URL}
            />
          )}

          {gameState === "finished" && (
            <QuizFinished
              correctCount={correctCount}
              totalQuestions={questions.length}
              startQuiz={startQuiz}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

