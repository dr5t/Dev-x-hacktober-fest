import React from 'react';
import { CheckSquare, MessageSquare, Terminal, Shield, FileText } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, hasText, isConnected }) {
  const navItems = [
    {
      id: 'study',
      label: 'Study Material & Actions',
      icon: FileText,
      description: 'Upload, paste & generate notes'
    },
    {
      id: 'quiz',
      label: 'Quiz Generator & Practice',
      icon: CheckSquare,
      description: 'Interactive self-testing'
    },
    {
      id: 'ask',
      label: 'Ask Material Q&A',
      icon: MessageSquare,
      description: 'Grounded question answering'
    },
    {
      id: 'status',
      label: 'Local AI Setup & Diagnostics',
      icon: Terminal,
      description: 'Ollama models & configuration'
    }
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-900 p-4 flex flex-col justify-between">
      <div className="space-y-5">
        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 px-1">Navigation</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded text-left transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-950 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-slate-100' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-slate-950 rounded p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Material Status:</span>
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
              hasText ? 'bg-slate-900 text-emerald-400 border-slate-700' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              {hasText ? 'Loaded' : 'Empty'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inference Engine:</span>
            <span className="font-mono text-[10px] text-slate-300">
              {isConnected ? 'Ollama (Local)' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private Local Engine</span>
        </div>
        <p className="leading-tight text-slate-400">
          Your notes stay on your machine. Open-weight inference via Ollama.
        </p>
      </div>
    </aside>
  );
}
