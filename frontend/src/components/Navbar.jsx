import React from 'react';
import { Cpu, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Navbar({ status, loadingStatus, onRefreshStatus, selectedModel, onSelectModel }) {
  const isConnected = status?.connected;
  const models = status?.models || [];

  return (
    <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 text-slate-200 p-2 rounded border border-slate-700">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-medium text-slate-100 text-sm flex items-center gap-2">
              StudyBuddy Local
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Private AI Study Companion</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local Inference</span>
          </div>

          {isConnected && models.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="bg-transparent text-[11px] text-slate-200 font-mono focus:outline-none cursor-pointer"
              >
                {models.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={`flex items-center gap-2 text-xs px-2.5 py-1 rounded border ${
            isConnected 
              ? 'bg-slate-950 border-emerald-500/40 text-emerald-400' 
              : 'bg-slate-950 border-rose-500/40 text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
            <span className="font-mono text-[11px]">
              Local AI: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <button 
              onClick={onRefreshStatus}
              title="Check Ollama Connection"
              className="ml-1 text-slate-400 hover:text-slate-200"
              disabled={loadingStatus}
            >
              <RefreshCw className={`w-3 h-3 ${loadingStatus ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
