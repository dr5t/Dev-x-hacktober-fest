import React, { useState } from 'react';
import { CheckSquare, AlertCircle, RefreshCw, Award, Check, X, HelpCircle, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Quiz Header Control */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            Local AI Quiz Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your understanding with AI-generated multiple choice questions from your material.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
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
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingQuiz ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Quiz...</span>
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-xs font-medium text-slate-300">No Study Material Provided</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please switch to the "Study Material & Actions" tab to paste or upload text before generating a quiz.
          </p>
        </div>
      )}

      {quizError && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-semibold text-rose-200">Quiz Generation Error</h4>
            <p>{quizError}</p>
          </div>
        </div>
      )}

      {/* Score Summary Card after submission */}
      {submitted && quizData && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Quiz Completed</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                You scored <strong className="text-slate-200 font-mono text-sm">{score}</strong> out of <strong className="text-slate-200 font-mono text-sm">{totalQuestions}</strong> ({percentage}%)
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 transition-all"
          >
            Take Another Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions List */}
      {quizData && quizData.length > 0 && (
        <div className="space-y-4">
          {quizData.map((q, idx) => {
            const userAns = selectedAnswers[q.id];
            const isAnswered = userAns !== undefined;

            return (
              <div key={q.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs font-semibold text-slate-200 flex items-start gap-2 leading-relaxed">
                    <span className="font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h3>
                  {submitted && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                      userAns === q.answer 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-950 text-rose-400 border-rose-500/30'
                    }`}>
                      {userAns === q.answer ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((option, optIdx) => {
                    let optionStyle = "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700";

                    if (submitted) {
                      if (optIdx === q.answer) {
                        optionStyle = "bg-emerald-950/60 text-emerald-300 border-emerald-500/50";
                      } else if (userAns === optIdx && userAns !== q.answer) {
                        optionStyle = "bg-rose-950/60 text-rose-300 border-rose-500/50";
                      }
                    } else if (userAns === optIdx) {
                      optionStyle = "bg-purple-600/20 text-purple-300 border-purple-500/50";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        className={`text-left p-3 rounded-lg text-xs font-sans border transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 uppercase w-5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                        </div>
                        {submitted && optIdx === q.answer && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {submitted && userAns === optIdx && userAns !== q.answer && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submitted state */}
                {submitted && q.explanation && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">
                    <strong className="text-slate-300 font-mono text-[11px] block mb-1">Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length < quizData.length}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                <span>Submit Answers & View Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
