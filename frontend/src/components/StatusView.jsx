import React from 'react';
import { Terminal, Cpu, CheckCircle, AlertTriangle, RefreshCw, Copy, ExternalLink } from 'lucide-react';

export default function StatusView({ status, loadingStatus, onRefreshStatus, selectedModel, onSelectModel }) {
  const isConnected = status?.connected;
  const models = status?.models || [];

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Local AI Engine Status & Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify Ollama local server connection and model configuration.
          </p>
        </div>
        <button
          onClick={onRefreshStatus}
          disabled={loadingStatus}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-3.5 py-2 rounded-lg border border-slate-700 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
          <span>Recheck Status</span>
        </button>
      </div>

      {/* Connection Card */}
      <div className={`border rounded-xl p-5 space-y-4 ${
        isConnected ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            )}
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                Ollama Engine Status: {isConnected ? 'Connected & Operational' : 'Disconnected'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Target Endpoint: http://localhost:11434
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
            isConnected ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-rose-950 text-rose-300 border-rose-500/40'
          }`}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {!isConnected && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-200">How to Fix Ollama Connection:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>
                Install Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-1">ollama.com <ExternalLink className="w-3 h-3" /></a>
              </li>
              <li>
                Start the local Ollama daemon:
                <div className="mt-1 flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono text-[11px] text-emerald-400">
                  <span>ollama serve</span>
                  <button onClick={() => copyCommand('ollama serve')} className="text-slate-400 hover:text-slate-200">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
              <li>
                Pull a lightweight recommended study model:
                <div className="mt-1 flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono text-[11px] text-emerald-400">
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

      {/* Available Models */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            Installed Local Models ({models.length})
          </h3>
        </div>

        {models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {models.map((m) => (
              <div
                key={m}
                onClick={() => onSelectModel(m)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedModel === m
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-semibold flex items-center justify-between">
                  <span>{m}</span>
                  {selectedModel === m && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Open-Weight Local Model</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs text-slate-400 text-center">
            No local models detected. Run <code className="font-mono text-emerald-400">ollama pull llama3.2</code> in your terminal to install one.
          </div>
        )}
      </div>
    </div>
  );
}
