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
    
    try {
      const resAnswer = await onAsk(qText);
      if (resAnswer) {
        setHistory(prev => [
          ...prev,
          { question: qText, answer: resAnswer, timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-300" />
            Ask Study Material (Grounded Q&A)
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ask specific questions about your uploaded study material. Model: <code className="font-mono text-slate-300">{selectedModel || 'llama3.2'}</code>
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {!hasText && (
        <div className="bg-slate-900 border border-slate-800 rounded p-8 text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-slate-400 mx-auto" />
          <h3 className="text-xs font-medium text-slate-300">No Material Loaded</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Paste or upload text in the Study Material tab before asking questions.
          </p>
        </div>
      )}

      {askError && (
        <div className="bg-slate-900 border border-rose-500/40 rounded p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Question Failed</h4>
            <p>{askError}</p>
          </div>
        </div>
      )}

      {hasText && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Sample Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "What are the main key takeaways?",
              "List the most important definitions in this text.",
              "What formulas or arguments are discussed?",
              "Explain the core concept simply."
            ].map((sq, i) => (
              <button
                key={i}
                onClick={() => setQuestion(sq)}
                className="text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 px-2.5 py-1 rounded text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {history.map((item, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1 bg-slate-800 text-slate-300 rounded shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">{item.question}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.timestamp}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-3 border-t border-slate-800">
              <div className="p-1 bg-slate-800 text-slate-300 rounded shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasText && (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loadingAsk || !isConnected}
            placeholder="Ask a question about the study material..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-600 font-sans"
          />
          <button
            type="submit"
            disabled={!question.trim() || loadingAsk || !isConnected}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2 rounded text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 shrink-0"
          >
            {loadingAsk ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
