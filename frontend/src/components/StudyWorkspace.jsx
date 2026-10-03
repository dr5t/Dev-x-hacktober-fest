import React, { useState } from 'react';
import { 
  FileText, Upload, HelpCircle, CheckSquare, 
  MessageSquare, Copy, Download, AlertCircle, RefreshCw, Layers, FileCheck 
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
  const [inputMode, setInputMode] = useState('paste');
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
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-300" />
            Study Material Workspace
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Paste or upload your notes. Local model: <code className="font-mono text-slate-300">{selectedModel || 'llama3.2'}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputMode('paste')}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
              inputMode === 'paste' 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
              inputMode === 'upload' 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Upload File (.txt, .pdf)
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        {inputMode === 'paste' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Study Material Input
              </label>
              {studyText && (
                <button
                  onClick={() => setStudyText('')}
                  className="text-xs text-slate-400 hover:text-rose-400"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              placeholder="Paste study material, lecture notes, or chapter text here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-slate-600 font-sans leading-relaxed resize-y"
            />
          </div>
        ) : (
          <div className="py-8 border border-dashed border-slate-800 rounded bg-slate-950 flex flex-col items-center justify-center text-center px-4">
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <h3 className="text-xs font-medium text-slate-200">Upload Study Document</h3>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1 mb-3">
              Select a .txt or .pdf file from your computer.
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
              className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs px-4 py-2 rounded font-medium"
            >
              {uploading ? 'Extracting File...' : 'Select File'}
            </label>
            {uploadError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {uploadError}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-slate-200 font-mono">{wordCount}</strong></span>
            <span>Characters: <strong className="text-slate-200 font-mono">{charCount}</strong></span>
            <span>Est. Read Time: <strong className="text-slate-200 font-mono">{estReadTime} min</strong></span>
          </div>
          <span className="text-[11px] text-slate-400">
            {studyText ? 'Material ready' : 'No material loaded'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            onClick={onSummarize}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-200">Summarize</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Concise summary</span>
          </button>

          <button
            onClick={() => setShowExplainModal(true)}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HelpCircle className="w-4 h-4 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-200">Explain</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Topic breakdown</span>
          </button>

          <button
            onClick={onRevisionNotes}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileCheck className="w-4 h-4 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-200">Make Revision Notes</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Exam points</span>
          </button>

          <button
            onClick={onGenerateQuiz}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckSquare className="w-4 h-4 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-200">Generate Quiz</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Multiple choice</span>
          </button>

          <button
            onClick={onAsk}
            disabled={!studyText || loadingAction || !isConnected}
            className="flex flex-col items-start p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-4 h-4 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-200">Ask</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Q&A mode</span>
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="bg-slate-900 border border-rose-500/40 rounded p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-rose-200">Local AI Disconnected</h4>
            <p>
              Ollama server is not detected on <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-rose-300">http://localhost:11434</code>. 
              Start Ollama locally using <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-rose-300">ollama serve</code> to execute actions.
            </p>
          </div>
        </div>
      )}

      {actionError && (
        <div className="bg-slate-900 border border-rose-500/40 rounded p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Action Failed</h4>
            <p>{actionError}</p>
          </div>
        </div>
      )}

      {loadingAction && (
        <div className="bg-slate-900 border border-slate-800 rounded p-6 flex flex-col items-center justify-center text-center space-y-2">
          <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
          <h4 className="text-xs font-medium text-slate-200">Processing Study Material...</h4>
          <p className="text-[11px] text-slate-400">Running inference with local model ({selectedModel || 'llama3.2'}).</p>
        </div>
      )}

      {result && !loadingAction && (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
              Result
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyResult}
                className="text-xs flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-800"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadResult}
                className="text-xs flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950 p-3 rounded border border-slate-800 max-h-[500px] overflow-y-auto">
            {result}
          </div>
        </div>
      )}

      {showExplainModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded max-w-md w-full p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-100">Explain Concept</h3>
            <p className="text-[11px] text-slate-400">
              Enter the topic or term to explain from your study material.
            </p>
            <form onSubmit={handleExplainSubmit} className="space-y-3">
              <input
                type="text"
                value={explainTopic}
                onChange={(e) => setExplainTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Neural networks, Ohm's law..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-slate-600"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExplainModal(false)}
                  className="text-xs px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!explainTopic.trim()}
                  className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium disabled:opacity-50"
                >
                  Explain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
