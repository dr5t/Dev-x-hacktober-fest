import React, { useState } from 'react';
import { CheckSquare, AlertCircle, RefreshCw, Check, X, HelpCircle, ArrowRight } from 'lucide-react';

export default function QuizMode({
  quizData,
  loadingQuiz,
  quizError,
  onGenerateQuiz,
  hasText,
  isConnected
}) {
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleGenerate = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    onGenerateQuiz(numQuestions);
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let score = 0;
    quizData.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns !== undefined && userAns === q.answer) {
        score += 1;
      }
    });
    return score;
  };

  const totalQuestions = quizData ? quizData.length : 0;
  const score = calculateScore();
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-300" />
            Local AI Quiz Generator
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Multiple choice quiz generated locally from your study notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <span>Questions:</span>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              disabled={loadingQuiz}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value={3} className="bg-slate-900">3 Questions</option>
              <option value={5} className="bg-slate-900">5 Questions</option>
              <option value={10} className="bg-slate-900">10 Questions</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!hasText || loadingQuiz || !isConnected}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs px-4 py-2 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loadingQuiz ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{quizData ? 'Regenerate Quiz' : 'Generate Quiz'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!hasText && (
        <div className="bg-slate-900 border border-slate-800 rounded p-8 text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-slate-400 mx-auto" />
          <h3 className="text-xs font-medium text-slate-300">No Study Material Loaded</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Paste or upload text in the Study Material tab to generate a quiz.
          </p>
        </div>
      )}

      {quizError && (
        <div className="bg-slate-900 border border-rose-500/40 rounded p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Quiz Generation Error</h4>
            <p>{quizError}</p>
          </div>
        </div>
      )}

      {submitted && quizData && (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-100">Quiz Results</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Score: <strong className="text-slate-200 font-mono">{score}</strong> / <strong className="text-slate-200 font-mono">{totalQuestions}</strong> ({percentage}%)
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded border border-slate-800"
          >
            Retake Quiz
          </button>
        </div>
      )}

      {quizData && quizData.length > 0 && (
        <div className="space-y-4">
          {quizData.map((q, idx) => {
            const userAns = selectedAnswers[q.id];

            return (
              <div key={q.id || idx} className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs font-semibold text-slate-200 flex items-start gap-2 leading-relaxed">
                    <span className="font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded text-[10px] shrink-0 border border-slate-800">
                      Q{idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h3>
                  {submitted && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                      userAns === q.answer 
                        ? 'bg-slate-950 text-emerald-400 border-emerald-500/40' 
                        : 'bg-slate-950 text-rose-400 border-rose-500/40'
                    }`}>
                      {userAns === q.answer ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((option, optIdx) => {
                    let optionStyle = "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700";

                    if (submitted) {
                      if (optIdx === q.answer) {
                        optionStyle = "bg-slate-950 text-emerald-400 border-emerald-500/50";
                      } else if (userAns === optIdx && userAns !== q.answer) {
                        optionStyle = "bg-slate-950 text-rose-400 border-rose-500/50";
                      }
                    } else if (userAns === optIdx) {
                      optionStyle = "bg-slate-800 text-slate-100 border-slate-600";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        className={`text-left p-2.5 rounded text-xs font-sans border transition-colors flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 uppercase w-4">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                        </div>
                        {submitted && optIdx === q.answer && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {submitted && userAns === optIdx && userAns !== q.answer && <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-400">
                    <strong className="text-slate-300 font-mono text-[10px] block mb-1">Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div className="flex justify-end">
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length < quizData.length}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs px-4 py-2 rounded font-medium transition-colors disabled:opacity-40"
              >
                <span>Submit Answers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
