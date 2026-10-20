import React, { useState } from 'react';
import { SAMPLE_QUIZZES } from '../data/mockData';
import { QuizQuestion, ErrorRecord } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Loader2,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface InstantQuizProps {
  onAddErrorRecord?: (record: ErrorRecord) => void;
}

export const InstantQuiz: React.FC<InstantQuizProps> = ({ onAddErrorRecord }) => {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(SAMPLE_QUIZZES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [whyModalOpen, setWhyModalOpen] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('Quy tắc Xác suất & Định lý Bayes');

  const currentQuiz = quizzes[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (selectedOption) return; // already answered
    setSelectedOption(optId);
    setShowExplanation(true);

    const isCorrect = optId === currentQuiz.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    } else {
      // Add error record to aggregate log
      if (onAddErrorRecord) {
        const errorRecord: ErrorRecord = {
          id: `quiz-err-${Date.now()}`,
          source: 'quiz',
          sourceTitle: `Trắc nghiệm: ${currentQuiz.topic}`,
          topic: currentQuiz.topic,
          errorName: `Sai lầm chọn đáp án ${optId}`,
          description: currentQuiz.explanation.whyWrong[optId] || 'Chọn sai phương án.',
          studentAnswer: `Phương án ${optId}`,
          correctLogic: currentQuiz.explanation.whyCorrect,
          timestamp: 'Vừa xong',
        };
        onAddErrorRecord(errorRecord);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setWhyModalOpen(false);
    }
  };

  const handleGenerateNewQuizzes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuizzes(data);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setWhyModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể tạo trắc nghiệm mới từ AI. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Score Bar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Trắc Nghiệm Tức Thì & Bóc Tách "Tại Sao?"
          </span>
          <h2 className="text-base font-extrabold text-slate-800">
            Kiểm tra Nhanh: {currentQuiz.topic}
          </h2>
          <div className="text-xs text-slate-500">
            Câu {currentIndex + 1} / {quizzes.length} • Điểm hiện tại: {score} / {quizzes.length}
          </div>
        </div>

        {/* Topic & New Question Generator */}
        <div className="flex items-center gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="Quy tắc Xác suất & Định lý Bayes">Xác suất & Bayes</option>
            <option value="Phân phối Nhị thức & Poisson">Nhị thức & Poisson</option>
            <option value="Phân phối Chuẩn & Định lý Giới hạn">Chuẩn Gauss & CLT</option>
            <option value="Ước lượng & Kiểm định Giả thuyết">Ước lượng & Kiểm định</option>
          </select>

          <button
            onClick={handleGenerateNewQuizzes}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 transition"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Sinh Đề Mới</span>
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700">
            Câu hỏi #{currentIndex + 1}
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            <FormattedMathText text={currentQuiz.question} />
          </div>
          {currentQuiz.latex && (
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <MathView math={currentQuiz.latex} block={true} />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQuiz.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = opt.id === currentQuiz.correctAnswer;

            let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';
            if (selectedOption) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200 font-bold';
              } else {
                btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={Boolean(selectedOption)}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 text-sm ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedOption && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : selectedOption && isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div>
                    <FormattedMathText text={opt.text} />
                    {opt.latex && <MathView math={opt.latex} />}
                  </div>
                </div>

                {selectedOption && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {selectedOption && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & "Tại sao?" Action Button */}
        {showExplanation && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuiz.correctAnswer ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Chính xác! (+1 điểm)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Chưa chính xác! Đáp án đúng là {currentQuiz.correctAnswer}
                  </span>
                )}
              </div>

              {/* TẠI SAO? DEEP DIVE BUTTON */}
              <button
                onClick={() => setWhyModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition group"
              >
                <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition" />
                <span>Tại sao? Bóc tách Logic Đúng / Sai</span>
              </button>
            </div>

            {/* Quick Answer Rationale */}
            <div className="text-xs text-slate-700 leading-relaxed pt-1">
              <strong>Giải thích nhanh: </strong>
              <FormattedMathText text={currentQuiz.explanation.whyCorrect} />
            </div>

            {/* Next Button */}
            {currentIndex < quizzes.length - 1 && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  <span>Sang câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* "TẠI SAO?" DEEP DIVE MODAL */}
      {whyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold text-base">
                  Truy Vấn "Tại Sao?" - Bóc Tách Bản Chất Lựa Chọn
                </h3>
              </div>
              <button
                onClick={() => setWhyModalOpen(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Why Correct is Correct */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-emerald-950">
                <span className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tại sao đáp án {currentQuiz.correctAnswer} lại đúng?
                </span>
                <FormattedMathText text={currentQuiz.explanation.whyCorrect} />
                {currentQuiz.explanation.formulaUsed && (
                  <div className="p-2 bg-white rounded-xl text-center text-sm font-bold text-emerald-900">
                    <MathView math={currentQuiz.explanation.formulaUsed} block={true} />
                  </div>
                )}
              </div>

              {/* Why Other Options are Wrong */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  Phân tích cạm bẫy các đáp án còn lại (Distractor Analysis):
                </span>
                {Object.entries(currentQuiz.explanation.whyWrong).map(([opt, reason]) => (
                  <div
                    key={opt}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <span className="font-bold text-rose-700">
                      Nếu chọn phương án {opt}:
                    </span>
                    <FormattedMathText text={reason} className="text-slate-600" />
                  </div>
                ))}
              </div>

              {/* Common Pitfall */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Bẫy tư duy thường gặp (Common Pitfall):
                </span>
                <FormattedMathText text={currentQuiz.explanation.commonPitfall} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setWhyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
