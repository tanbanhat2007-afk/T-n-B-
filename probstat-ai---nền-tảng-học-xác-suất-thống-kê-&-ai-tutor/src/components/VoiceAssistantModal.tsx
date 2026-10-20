import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  Loader2,
  Cpu,
  Layers,
} from 'lucide-react';
import { MathView, FormattedMathText } from './MathView';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncToCanvas?: (diagram: {
    type: 'bayes_tree' | 'normal_curve' | 'prob_table' | 'venn_diagram' | 'formula';
    title: string;
    details?: string;
  }) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSyncToCanvas,
  onNavigateToTab,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<
    {
      role: 'user' | 'assistant';
      text: string;
      latex?: string;
      diagram?: any;
    }[]
  >([
    {
      role: 'assistant',
      text: 'Chào bạn! Thầy là AI Tutor XSTK. Bạn có thể nhấn vào micro để nói hoặc gõ câu hỏi tìm kiếm về Xác suất Thống kê. Thầy sẽ giải thích và tự động vẽ sơ đồ lên Bảng vẽ Canvas cho bạn!',
      latex: 'P(A|B) = \\frac{P(AB)}{P(B)}',
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

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        'Trình duyệt của bạn chưa hỗ trợ Web Speech API. Bạn có thể gõ trực tiếp câu hỏi vào ô bên dưới!'
      );
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
        console.warn('Speech start error:', err);
      }
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove LaTeX artifacts for smooth voice reading
      const cleanText = text.replace(/[\$\{\}\\_]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuestion = async (customQuery?: string) => {
    const query = customQuery || transcript;
    if (!query.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg = query;
    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg }]);
    setTranscript('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          currentTopic: 'Xác suất Thống kê Đại cương',
        }),
      });

      const data = await res.json();
      const assistantText = data.spokenAnswer || data.detailedExplanation;

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: assistantText,
          latex: data.keyLatex,
          diagram: data.syncDiagram,
        },
      ]);

      // Automatically speak the answer
      speakText(assistantText);

      // Automatically sync diagram to Canvas if requested
      if (data.syncDiagram && onSyncToCanvas) {
        onSyncToCanvas(data.syncDiagram);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Thầy đã nhận được câu hỏi. Trong Xác suất Thống kê, hãy luôn lưu ý phân biệt các đại lượng ngẫu nhiên và điều kiện của các định lý nhé!',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Trợ Lý AI Voice Tutor & Tìm Kiếm Giọng Nói
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 uppercase tracking-wider font-semibold">
                  Live STT / TTS
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Hỏi đáp tự nhiên và tự động đồng bộ sơ đồ lên Bảng vẽ Canvas
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-600'
                    }`}
                  >
                    {msg.role === 'user' ? 'Bạn (Voice)' : 'AI Tutor XSTK'}
                  </span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
                      title="Nghe lại giọng đọc"
                    >
                      {isPlayingAudio ? (
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <FormattedMathText text={msg.text} />

                {msg.latex && (
                  <div className="mt-2.5 p-2 bg-indigo-50/80 rounded-xl border border-indigo-100 text-center">
                    <MathView math={msg.latex} block={true} />
                  </div>
                )}

                {msg.diagram && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold">Đã đồng bộ lên Canvas: </span>
                        {msg.diagram.title}
                      </div>
                    </div>
                    {onNavigateToTab && (
                      <button
                        onClick={() => {
                          onNavigateToTab('grader');
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 transition"
                      >
                        Xem bảng vẽ
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-600 shadow-sm animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI Tutor đang lắng nghe và phân tích bài toán...</span>
            </div>
          )}
        </div>

        {/* Voice Input & Search Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              Gợi ý hỏi:
            </span>
            {[
              'Vẽ sơ đồ cây Bayes giúp mình với',
              'Giải thích phân phối chuẩn Gauss',
              'Khi nào dùng t-test thay cho z-test?',
              'Định lý giới hạn trung tâm là gì?',
            ].map((suggest, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(suggest)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 shrink-0 transition text-[11px]"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* Interactive Mic Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-2xl flex items-center justify-center transition shadow-md ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-200 ring-4 ring-rose-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
              title={isListening ? 'Dừng ghi âm' : 'Bật microphone để nói'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
                placeholder={
                  isListening
                    ? 'Đang lắng nghe giọng nói của bạn... Hãy nói câu hỏi XSTK!'
                    : 'Gõ câu hỏi hoặc bấm micro để nói...'
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm text-slate-800 outline-none transition pr-10"
              />
              <button
                onClick={() => handleSendQuestion()}
                disabled={!transcript.trim() || isProcessing}
                className="absolute right-2 top-2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl disabled:opacity-30 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
