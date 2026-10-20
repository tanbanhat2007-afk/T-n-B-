import React, { useState, useRef, useEffect } from 'react';
import { CanvasWorkspace } from '../components/CanvasWorkspace';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Loader2,
  GitBranch,
  TrendingUp,
  Table,
  CircleDot,
  PenTool,
} from 'lucide-react';

export const VoiceSyncTutor: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const [syncDiagram, setSyncDiagram] = useState<{
    type: 'bayes_tree' | 'normal_curve' | 'prob_table' | 'venn_diagram' | 'formula';
    title: string;
    details?: string;
  } | null>({
    type: 'bayes_tree',
    title: 'Sơ đồ Cây Xác Suất Bayes',
    details: 'Đã sẵn sàng đồng bộ trực quan từ giọng nói',
  });

  const [conversation, setConversation] = useState<
    {
      id: string;
      role: 'student' | 'ai';
      text: string;
      latex?: string;
      diagramTitle?: string;
    }[]
  >([
    {
      id: '1',
      role: 'ai',
      text: 'Chào bạn! Thầy là Trợ lý Voice AI chuyên về Xác suất Thống kê. Bạn hãy nhấn micro và nói những bài toán phức tạp khó diễn đạt. Thầy vừa giảng giải bằng giọng nói, vừa tự động vẽ sơ đồ trực quan lên Bảng vẽ Canvas bên cạnh cho bạn!',
      latex: 'P(A_k|B) = \\frac{P(A_k)P(B|A_k)}{\\sum P(A_i)P(B|A_i)}',
      diagramTitle: 'Sơ đồ Cây Bayes khởi tạo',
    },
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          let str = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            str += event.results[i][0].transcript;
          }
          setTranscript(str);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API. Bạn có thể nhập văn bản trực tiếp!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\$\{\}\\_]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAsk = async (customPrompt?: string) => {
    const q = customPrompt || transcript;
    if (!q.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userEntry = {
      id: Date.now().toString(),
      role: 'student' as const,
      text: q,
    };
    setConversation((prev) => [...prev, userEntry]);
    setTranscript('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          currentTopic: 'Xác suất Thống kê & Vẽ sơ đồ Canvas',
        }),
      });

      const data = await res.json();
      const aiResponseText = data.spokenAnswer || data.detailedExplanation;

      setConversation((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: aiResponseText,
          latex: data.keyLatex,
          diagramTitle: data.syncDiagram?.title,
        },
      ]);

      if (data.syncDiagram) {
        setSyncDiagram(data.syncDiagram);
      }

      playTTS(aiResponseText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const manualSync = (type: 'bayes_tree' | 'normal_curve') => {
    if (type === 'bayes_tree') {
      setSyncDiagram({
        type: 'bayes_tree',
        title: 'Cây Xác suất Bayes',
        details: 'Phân nhánh hệ đầy đủ A1, A2 và điều kiện B',
      });
      playTTS('Thầy đã đồng bộ sơ đồ cây Bayes lên bảng vẽ iPad cho em.');
    } else {
      setSyncDiagram({
        type: 'normal_curve',
        title: 'Đường cong Chuẩn Gauss N(μ, σ²)',
        details: 'Phân phối chuẩn hình chuông và vùng 68%',
      });
      playTTS('Thầy đã dựng đường cong phân phối chuẩn Gauss lên bảng vẽ cho em.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/20 tracking-wider">
            Voice AI + Live Canvas Synchronization
          </span>
          <h2 className="text-lg font-bold mt-1">
            Hỏi - Đáp Bằng Giọng Nói & Tự Động Vẽ Sơ Đồ Lên iPad Canvas
          </h2>
          <p className="text-xs text-blue-100 max-w-xl">
            Khi gặp các bài toán khó diễn đạt bằng lời (sơ đồ cây Bayes, phân phối Gauss, bảng xác suất), AI sẽ vừa giảng giải bằng âm thanh vừa tự động minh họa trực quan lên bảng vẽ!
          </p>
        </div>

        {/* Manual Trigger Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => manualSync('bayes_tree')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Vẽ Cây Bayes</span>
          </button>
          <button
            onClick={() => manualSync('normal_curve')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vẽ Đường Gauss</span>
          </button>
        </div>
      </div>

      {/* Split View: Left Voice Interaction | Right Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Voice Conversation Console (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-indigo-600" />
              Phiên Thoại Trực Tiếp (Voice Stream)
            </span>
            {isPlayingAudio && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                Đang phát âm thanh...
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {conversation.map((c) => (
              <div
                key={c.id}
                className={`flex flex-col ${
                  c.role === 'student' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs space-y-1.5 ${
                    c.role === 'student'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold ${
                        c.role === 'student' ? 'text-indigo-200' : 'text-indigo-600'
                      }`}
                    >
                      {c.role === 'student' ? 'Bạn (Voice)' : 'AI Tutor'}
                    </span>
                    {c.role === 'ai' && (
                      <button
                        onClick={() => playTTS(c.text)}
                        className="text-slate-400 hover:text-indigo-600"
                        title="Nghe lại"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <FormattedMathText text={c.text} />

                  {c.latex && (
                    <div className="p-1.5 bg-indigo-50/80 rounded-lg text-center text-xs">
                      <MathView math={c.latex} block={true} />
                    </div>
                  )}

                  {c.diagramTitle && (
                    <div className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Đã vẽ: {c.diagramTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI đang xử lý giọng nói và trích xuất hình vẽ...</span>
              </div>
            )}
          </div>

          {/* Quick Voice Suggestions */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Hỏi mẫu:</span>
            {[
              'Vẽ sơ đồ cây Bayes giúp em',
              'Đường cong Gauss 68% vẽ thế nào?',
              'Giải thích xấp xỉ Poisson',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(q)}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 shrink-0 text-slate-600 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Microphone & Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={toggleMic}
              className={`p-2.5 rounded-xl transition shadow-xs ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title={isListening ? 'Dừng nói' : 'Nhấn để nói'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder={
                isListening ? 'Đang lắng nghe... Nói câu hỏi XSTK' : 'Nói hoặc gõ câu hỏi tại đây...'
              }
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
            />

            <button
              onClick={() => handleAsk()}
              disabled={!transcript.trim() || isProcessing}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Synchronized Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-indigo-600" />
              Bảng Vẽ Đồng Bộ Trực Tiếp (iPad / Tablet Canvas)
            </span>
            <span className="text-indigo-600 font-semibold text-[11px]">
              Tự động cập nhật từ Voice AI
            </span>
          </div>

          <CanvasWorkspace height={510} syncDiagram={syncDiagram} />
        </div>
      </div>
    </div>
  );
};
