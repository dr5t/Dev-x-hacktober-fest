import React from 'react';
import { Terminal, Cpu, CheckCircle, AlertTriangle, RefreshCw, Copy, ExternalLink } from 'lucide-react';

export default function StatusView({ status, loadingStatus, onRefreshStatus, selectedModel, onSelectModel }) {
  const isConnected = status?.connected;
  const models = status?.models || [];

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-300" />
            Local AI Engine Status & Diagnostics
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Check local Ollama server connection and model configuration.
          </p>
        </div>
        <button
          onClick={onRefreshStatus}
          disabled={loadingStatus}
          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
          <span>Recheck</span>
        </button>
      </div>

      <div className={`border rounded p-4 space-y-3 bg-slate-900 ${
        isConnected ? 'border-emerald-500/40' : 'border-rose-500/40'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            )}
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                Ollama Engine: {isConnected ? 'Connected' : 'Disconnected'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Target Endpoint: http://localhost:11434
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isConnected ? 'bg-slate-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-rose-400 border-rose-500/40'
          }`}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {!isConnected && (
          <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">Setup Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>
                Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-slate-200 underline inline-flex items-center gap-1">ollama.com <ExternalLink className="w-3 h-3" /></a>
              </li>
              <li>
                Start the Ollama server:
                <div className="mt-1 flex items-center justify-between bg-slate-900 border border-slate-800 px-2.5 py-1 rounded font-mono text-[11px] text-slate-200">
                  <span>ollama serve</span>
                  <button onClick={() => copyCommand('ollama serve')} className="text-slate-400 hover:text-slate-200">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
              <li>
                Pull a recommended local model:
                <div className="mt-1 flex items-center justify-between bg-slate-900 border border-slate-800 px-2.5 py-1 rounded font-mono text-[11px] text-slate-200">
                  <span>ollama pull llama3.2</span>
                  <button onClick={() => copyCommand('ollama pull llama3.2')} className="text-slate-400 hover:text-slate-200">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          Installed Models ({models.length})
        </h3>

        {models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {models.map((m) => (
              <div
                key={m}
                onClick={() => onSelectModel(m)}
                className={`p-2.5 rounded border cursor-pointer transition-colors ${
                  selectedModel === m
                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-semibold flex items-center justify-between">
                  <span>{m}</span>
                  {selectedModel === m && <span className="text-[9px] bg-slate-700 text-slate-200 px-1 py-0.5 rounded">Active</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-400 text-center">
            No models detected. Run <code className="font-mono text-slate-200">ollama pull llama3.2</code> in terminal.
          </div>
        )}
      </div>
    </div>
  );
}
