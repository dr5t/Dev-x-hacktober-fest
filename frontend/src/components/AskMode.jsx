import React, { useState } from 'react';
import { MessageSquare, Send, RefreshCw, AlertCircle, HelpCircle, User, Bot, Trash2 } from 'lucide-react';

export default function AskMode({
  onAsk,
  loadingAsk,
  askError,
  hasText,
  isConnected,
  selectedModel
}) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim() || loadingAsk || !hasText) return;

    const qText = question.trim();
    setQuestion('');
    
    // Call ask API
    try {
      const resAnswer = await onAsk(qText);
      if (resAnswer) {
        setHistory(prev => [
          ...prev,
          { question: qText, answer: resAnswer, timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      // error handled in parent
    }
  };

  const handleQuickQuestion = (q) => {
    setQuestion(q);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Ask Study Material (Grounded Q&A)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask specific questions about your uploaded study notes. Model: {selectedModel || 'llama3.2'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Q&A History</span>
          </button>
        )}
      </div>

      {!hasText && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-xs font-medium text-slate-300">No Study Material Loaded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please switch to the "Study Material & Actions" tab to paste or upload text before asking questions.
          </p>
        </div>
      )}

      {askError && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-semibold text-rose-200">Question Answer Failure</h4>
            <p>{askError}</p>
          </div>
        </div>
      )}

      {/* Suggested Questions Quick Prompts */}
      {hasText && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Sample Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "What are the main key takeaways?",
              "List the most important definitions in this text.",
              "What are the primary arguments or formulas discussed?",
              "Explain the core concept in simple terms."
            ].map((sq, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(sq)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg transition-all text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Q&A History Conversation Stream */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            {/* User Question */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-200">{item.question}</div>
                <div className="text-[10px] text-slate-400 font-mono">{item.timestamp}</div>
              </div>
            </div>

            {/* AI Answer */}
            <div className="flex items-start gap-3 pt-3 border-t border-slate-800/60">
              <div className="p-1.5 bg-sky-600/20 text-sky-400 rounded-lg shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      {hasText && (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loadingAsk || !isConnected}
            placeholder="Type your question about the study material..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
          />
          <button
            type="submit"
            disabled={!question.trim() || loadingAsk || !isConnected}
            className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-xl text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loadingAsk ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
