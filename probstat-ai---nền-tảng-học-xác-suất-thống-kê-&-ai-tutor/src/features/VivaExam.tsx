import React, { useState, useRef, useEffect } from 'react';
import { VivaTurn, VivaReport, ErrorRecord } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  HelpCircle,
  Mic,
  MicOff,
  Send,
  Loader2,
  Award,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface VivaExamProps {
  onAddErrorRecord?: (record: ErrorRecord) => void;
}

export const VivaExam: React.FC<VivaExamProps> = ({ onAddErrorRecord }) => {
  const [topic, setTopic] = useState<string>('Bản chất Xác suất Điều kiện & Định lý Bayes');
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [studentInput, setStudentInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [vivaReport, setVivaReport] = useState<VivaReport | null>(null);

  const [history, setHistory] = useState<VivaTurn[]>([]);
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
          setStudentInput(str);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API. Bạn có thể gõ câu trả lời trực tiếp!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setStudentInput('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const startSession = () => {
    setSessionActive(true);
    setHistory([
      {
        role: 'examiner',
        content: `Chào em! Thầy là Giám khảo Vấn đáp môn Xác suất Thống kê. Hôm nay thầy và em sẽ cùng thảo luận sâu về chuyên đề "${topic}". Em hãy cho thầy biết: Trong định lý Bayes, xác suất tiên nghiệm (prior) và xác suất hậu nghiệm (posterior) khác nhau về bản chất như thế nào? Em hãy nêu một ví dụ trực quan.`,
        latex: 'P(A) \\quad \\text{vs} \\quad P(A|B)',
        timestamp: 'Bắt đầu',
      },
    ]);
    setTurnCount(1);
    setVivaReport(null);
  };

  const handleSendAnswer = async (endingEarly = false) => {
    if (!studentInput.trim() && !endingEarly) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    const newHistory: VivaTurn[] = [
      ...history,
      {
        role: 'student',
        content: studentInput || 'Em xin phép hoàn thành phiên vấn đáp và nhận đánh giá.',
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ];
    setHistory(newHistory);
    setStudentInput('');
    setIsProcessing(true);

    const shouldEnd = endingEarly || currentTurn >= 4;

    try {
      const res = await fetch('/api/ai/viva-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          history: newHistory,
          studentAnswer: studentInput,
          isEnding: shouldEnd,
        }),
      });

      const data = await res.json();

      if (data.isFinished && data.vivaReport) {
        setVivaReport(data.vivaReport);
        setHistory((prev) => [
          ...prev,
          {
            role: 'examiner',
            content: data.examinerFeedback || 'Phiên vấn đáp kết thúc tốt đẹp!',
            timestamp: 'Kết thúc',
          },
        ]);

        // Push error to log if misconceptions exist
        if (data.vivaReport.misconceptions?.length > 0 && onAddErrorRecord) {
          onAddErrorRecord({
            id: `viva-err-${Date.now()}`,
            source: 'viva',
            sourceTitle: `Vấn đáp: ${topic}`,
            topic,
            errorName: data.vivaReport.misconceptions[0],
            description: `Lỗ hổng: ${data.vivaReport.knowledgeGaps.join(', ')}`,
            studentAnswer: 'Ghi nhận qua phiên vấn đáp tương tác trực tiếp với AI Examiner',
            correctLogic: data.vivaReport.recommendation,
            timestamp: 'Hôm nay',
          });
        }
      } else {
        setHistory((prev) => [
          ...prev,
          {
            role: 'examiner',
            content: `${data.examinerFeedback} ${data.nextQuestion}`,
            latex: data.latexFormula,
            timestamp: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Session Controls */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>AI Oral Examination (Vấn Đáp Học Thuật)</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 mt-1">
            Vấn Đáp Lý Thuyết & Khám Phá Lỗ Hổng Kiến Thức
          </h2>
          <p className="text-xs text-slate-500">
            Giám khảo AI đối thoại trực tiếp, truy vấn bản chất toán học và phát hiện ngộ nhận nhận thức (misconceptions).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!sessionActive ? (
            <button
              onClick={startSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bắt Đầu Vấn Đáp</span>
            </button>
          ) : (
            <button
              onClick={() => handleSendAnswer(true)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
            >
              Kết thúc & Xuất Báo Cáo
            </button>
          )}
        </div>
      </div>

      {!sessionActive ? (
        /* Pre-viva Setup */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-slate-800 text-base">
              Chọn Chuyên Đề Vấn Đáp Cùng Giám Khảo AI
            </h3>
            <p className="text-xs text-slate-500">
              Mỗi phiên vấn đáp gồm 3-4 câu hỏi phản biện sâu. Bạn có thể trả lời bằng cách nói qua Micro hoặc gõ phím.
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="Bản chất Xác suất Điều kiện & Định lý Bayes">
                Xác suất Điều kiện & Định lý Bayes
              </option>
              <option value="Lược đồ Bernoulli & Các Phân phối Rời rạc">
                Lược đồ Bernoulli & Phân phối Rời rạc
              </option>
              <option value="Định lý Giới hạn Trung tâm (CLT) & Gauss">
                Định lý Giới hạn Trung tâm & Chuẩn Gauss
              </option>
              <option value="Kiểm định Giả thuyết, p-value & Mức ý nghĩa Alpha">
                Kiểm định Giả thuyết & p-value
              </option>
            </select>
          </div>

          <button
            onClick={startSession}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition"
          >
            Sẵn Sàng Tham Gia Vấn Đáp
          </button>
        </div>
      ) : (
        /* Active Viva Dialogue */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 max-h-[500px] overflow-y-auto">
            {history.map((turn, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  turn.role === 'student' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    turn.role === 'student'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                    <span
                      className={
                        turn.role === 'student'
                          ? 'text-indigo-200'
                          : 'text-indigo-700'
                      }
                    >
                      {turn.role === 'student'
                        ? 'Sinh viên (Bạn)'
                        : 'Giám Khảo AI (Professor)'}
                    </span>
                    <span className="opacity-60">{turn.timestamp}</span>
                  </div>

                  <FormattedMathText text={turn.content} />

                  {turn.latex && (
                    <div className="p-2 bg-white/90 rounded-xl text-center text-slate-900 font-bold border border-slate-200">
                      <MathView math={turn.latex} block={true} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Giám khảo đang lắng nghe và đánh giá tư duy...</span>
              </div>
            )}
          </div>

          {/* Student Answer Bar (if not finished) */}
          {!vivaReport && (
            <div className="p-4 bg-white rounded-3xl border border-slate-200 flex items-center gap-2 shadow-xs">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition shadow-xs ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                title={isListening ? 'Dừng nói' : 'Bật micro để trả lời vấn đáp'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                placeholder={
                  isListening
                    ? 'Đang lắng nghe câu trả lời vấn đáp của bạn...'
                    : 'Gõ câu trả lời của em hoặc bấm micro để nói...'
                }
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-500"
              />

              <button
                onClick={() => handleSendAnswer()}
                disabled={!studentInput.trim() || isProcessing}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <span>Trả Lời</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* VIVA EVALUATION REPORT (When finished) */}
          {vivaReport && (
            <div className="p-6 bg-white rounded-3xl border border-indigo-200 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800">
                      Báo Cáo Đánh Giá Vấn Đáp & Chẩn Đoán Lỗ Hổng
                    </h3>
                    <p className="text-xs text-slate-400">
                      Chuyên đề: {topic}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 bg-indigo-600 text-white rounded-2xl text-center">
                  <div className="text-xs text-indigo-200 uppercase font-bold">
                    Điểm Vấn Đáp
                  </div>
                  <div className="text-lg font-black">{vivaReport.score} / 10</div>
                </div>
              </div>

              {/* Grid: Knowledge Gaps & Misconceptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Knowledge Gaps */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-amber-950">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Lỗ hổng kiến thức phát hiện (Knowledge Gaps):
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-amber-900">
                    {vivaReport.knowledgeGaps.map((gap, gIdx) => (
                      <li key={gIdx}>{gap}</li>
                    ))}
                  </ul>
                </div>

                {/* Misconceptions */}
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2 text-rose-950">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Nhận thức sai lầm (Misconceptions):
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-rose-900">
                    {vivaReport.misconceptions.map((mis, mIdx) => (
                      <li key={mIdx}>{mis}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mastery highlights */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Điểm sáng nắm vững (Mastery Highlights):
                </span>
                <ul className="list-disc list-inside space-y-1 text-emerald-900">
                  {vivaReport.masteryHighlights.map((hi, hIdx) => (
                    <li key={hIdx}>{hi}</li>
                  ))}
                </ul>
              </div>

              {/* Concrete Recommendation */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Lời khuyên trọng tâm của Giám khảo:
                </span>
                <p className="leading-relaxed">{vivaReport.recommendation}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSessionActive(false);
                    setVivaReport(null);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  Phiên Vấn Đáp Mới
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
