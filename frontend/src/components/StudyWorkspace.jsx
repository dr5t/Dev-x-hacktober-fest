import React, { useState } from 'react';
import { 
  FileText, Upload, Sparkles, HelpCircle, CheckSquare, 
  MessageSquare, Copy, Download, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';

export default function StudyWorkspace({
  studyText,
  setStudyText,
  onUploadFile,
  uploading,
  uploadError,
  onSummarize,
  onExplain,
  onRevisionNotes,
  onGenerateQuiz,
  onAsk,
  loadingAction,
  actionError,
  result,
  selectedModel,
  isConnected
}) {
  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'upload'
  const [explainTopic, setExplainTopic] = useState('');
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = studyText.trim() ? studyText.trim().split(/\s+/).length : 0;
  const charCount = studyText.length;
  const estReadTime = Math.ceil(wordCount / 200);

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study_notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExplainSubmit = (e) => {
    e.preventDefault();
    if (explainTopic.trim()) {
      onExplain(explainTopic);
      setShowExplainModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Privacy Callout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Study Material Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste or upload your notes. All processing runs locally through Ollama ({selectedModel || 'llama3.2'}).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputMode('paste')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              inputMode === 'paste' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              inputMode === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File (.txt, .pdf)
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        {inputMode === 'paste' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Paste Notes / Textbook Content
              </label>
              {studyText && (
                <button
                  onClick={() => setStudyText('')}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear Input
                </button>
              )}
            </div>
            <textarea
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              placeholder="Paste study material, lecture notes, textbook chapters, or articles here..."
              rows={8}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-y"
            />
          </div>
        ) : (
          <div className="py-6 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center text-center px-4">
            <Upload className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-xs font-medium text-slate-200">Upload Study Document</h3>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1 mb-3">
              Select a .txt or .pdf file from your device. Text will be extracted locally.
            </p>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={onUploadFile}
              disabled={uploading}
              className="hidden"
              id="study-file-upload"
            />
            <label
              htmlFor="study-file-upload"
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all"
            >
              {uploading ? 'Processing File...' : 'Choose File'}
            </label>
            {uploadError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Material Stats Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-slate-200 font-mono">{wordCount}</strong></span>
            <span>Characters: <strong className="text-slate-200 font-mono">{charCount}</strong></span>
            <span>Est. Read Time: <strong className="text-slate-200 font-mono">{estReadTime} min</strong></span>
          </div>
          <span className="text-[11px] text-slate-400">
            {studyText ? 'Ready for AI processing' : 'Please provide study material first'}
          </span>
        </div>
      </div>

      {/* Suggested Action Buttons */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          AI Suggested Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            onClick={onSummarize}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Sparkles className="w-4 h-4 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-200">Summarize</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Concise overview</span>
          </button>

          <button
            onClick={() => setShowExplainModal(true)}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-200">Explain</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Difficult concepts</span>
          </button>

          <button
            onClick={onRevisionNotes}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <FileText className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-200">Make Revision Notes</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Exam key points</span>
          </button>

          <button
            onClick={onGenerateQuiz}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <CheckSquare className="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-200">Generate Quiz</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Test knowledge</span>
          </button>

          <button
            onClick={onAsk}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <MessageSquare className="w-4 h-4 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-200">Ask</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Q&A from notes</span>
          </button>
        </div>
      </div>

      {/* Disconnected Warning Banner */}
      {!isConnected && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-rose-200">Local AI Engine Not Connected</h4>
            <p>
              Ollama server is not running on <code className="font-mono bg-rose-900/40 px-1 py-0.5 rounded">http://localhost:11434</code>. 
              Start Ollama locally using <code className="font-mono bg-rose-900/40 px-1 py-0.5 rounded">ollama serve</code> to enable AI features.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {actionError && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="text-xs">
            <h4 className="font-semibold text-rose-200">Action Execution Failed</h4>
            <p>{actionError}</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loadingAction && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <div>
            <h4 className="text-xs font-medium text-slate-200">Processing Study Material...</h4>
            <p className="text-[11px] text-slate-400 mt-1">Running local model inference ({selectedModel || 'llama3.2'}). This might take a few seconds.</p>
          </div>
        </div>
      )}

      {/* Output / Results Panel */}
      {result && !loadingAction && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Generated Result
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyResult}
                className="text-xs flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadResult}
                className="text-xs flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg border border-slate-800/80 max-h-[500px] overflow-y-auto">
            {result}
          </div>
        </div>
      )}

      {/* Explain Concept Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">Explain Difficult Concept</h3>
            <p className="text-xs text-slate-400">
              Enter the topic, term, or question you want explained based on your provided material.
            </p>
            <form onSubmit={handleExplainSubmit} className="space-y-3">
              <input
                type="text"
                value={explainTopic}
                onChange={(e) => setExplainTopic(e.target.value)}
                placeholder="e.g. Mitochondria function, Quantum entanglement, Photosynthesis..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExplainModal(false)}
                  className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!explainTopic.trim()}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50"
                >
                  Explain Concept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
