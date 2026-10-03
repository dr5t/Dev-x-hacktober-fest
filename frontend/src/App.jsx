import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudyWorkspace from './components/StudyWorkspace';
import QuizMode from './components/QuizMode';
import AskMode from './components/AskMode';
import StatusView from './components/StatusView';

export default function App() {
  const [activeTab, setActiveTab] = useState('study');
  const [status, setStatus] = useState({ connected: false, models: [], default_model: 'llama3.2', error: null });
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.2');

  const [studyText, setStudyText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [result, setResult] = useState('');

  const [quizData, setQuizData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');

  const [loadingAsk, setLoadingAsk] = useState(false);
  const [askError, setAskError] = useState('');

  const checkStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
      if (data.models && data.models.length > 0) {
        if (!data.models.includes(selectedModel)) {
          setSelectedModel(data.models[0]);
        }
      }
    } catch (err) {
      setStatus({ connected: false, models: [], default_model: 'llama3.2', error: 'Backend API unreachable' });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract text from file.');
      setStudyText(data.text);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!studyText.trim()) return;
    setLoadingAction(true);
    setActionError('');
    setResult('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyText, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary.');
      setResult(data.result);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleExplain = async (topic) => {
    if (!studyText.trim() || !topic.trim()) return;
    setLoadingAction(true);
    setActionError('');
    setResult('');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyText, topic, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to explain concept.');
      setResult(data.result);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRevisionNotes = async () => {
    if (!studyText.trim()) return;
    setLoadingAction(true);
    setActionError('');
    setResult('');

    try {
      const res = await fetch('/api/revision-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyText, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate revision notes.');
      setResult(data.result);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGenerateQuiz = async (numQuestions = 5) => {
    if (!studyText.trim()) return;
    setLoadingQuiz(true);
    setQuizError('');

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyText, num_questions: numQuestions, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz.');
      setQuizData(data.quiz);
      setActiveTab('quiz');
    } catch (err) {
      setQuizError(err.message);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAskQuestion = async (question) => {
    if (!studyText.trim() || !question.trim()) return;
    setLoadingAsk(true);
    setAskError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyText, question, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to answer question.');
      return data.answer;
    } catch (err) {
      setAskError(err.message);
      throw err;
    } finally {
      setLoadingAsk(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar
        status={status}
        loadingStatus={loadingStatus}
        onRefreshStatus={checkStatus}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasText={Boolean(studyText.trim())}
          isConnected={status.connected}
        />

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {activeTab === 'study' && (
            <StudyWorkspace
              studyText={studyText}
              setStudyText={setStudyText}
              onUploadFile={handleUploadFile}
              uploading={uploading}
              uploadError={uploadError}
              onSummarize={handleSummarize}
              onExplain={handleExplain}
              onRevisionNotes={handleRevisionNotes}
              onGenerateQuiz={() => handleGenerateQuiz(5)}
              onAsk={() => setActiveTab('ask')}
              loadingAction={loadingAction}
              actionError={actionError}
              result={result}
              selectedModel={selectedModel}
              isConnected={status.connected}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizMode
              quizData={quizData}
              loadingQuiz={loadingQuiz}
              quizError={quizError}
              onGenerateQuiz={handleGenerateQuiz}
              hasText={Boolean(studyText.trim())}
              isConnected={status.connected}
            />
          )}

          {activeTab === 'ask' && (
            <AskMode
              onAsk={handleAskQuestion}
              loadingAsk={loadingAsk}
              askError={askError}
              hasText={Boolean(studyText.trim())}
              isConnected={status.connected}
              selectedModel={selectedModel}
            />
          )}

          {activeTab === 'status' && (
            <StatusView
              status={status}
              loadingStatus={loadingStatus}
              onRefreshStatus={checkStatus}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
