import React, { useState, useRef } from 'react';
import { CanvasWorkspace } from '../components/CanvasWorkspace';
import { MathView, FormattedMathText } from '../components/MathView';
import { GradingResult, BaremItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Loader2,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  PenTool,
} from 'lucide-react';

interface AutoGraderProps {
  initialProblemTitle?: string;
  initialProblemPrompt?: string;
  syncDiagram?: any;
}

export const AutoGrader: React.FC<AutoGraderProps> = ({
  initialProblemTitle = 'Bài toán Xét nghiệm Y tế & Định lý Bayes',
  initialProblemPrompt = 'Một bệnh hiểm nghèo có tỷ lệ mắc 1% trong dân số. Xét nghiệm có độ nhạy 95% và tỷ lệ dương tính giả 5%. Một người có kết quả dương tính. Hãy tính xác suất người đó thực sự mắc bệnh.',
  syncDiagram,
}) => {
  const [problemTitle, setProblemTitle] = useState<string>(initialProblemTitle);
  const [problemPrompt, setProblemPrompt] = useState<string>(initialProblemPrompt);
  const [studentTextNotes, setStudentTextNotes] = useState<string>('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'upload'>('canvas');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick problem presets
  const sampleProblems = [
    {
      title: 'Định lý Bayes & Chẩn đoán Y tế',
      prompt:
        'Một bệnh hiểm nghèo có tỷ lệ mắc 1% trong dân số. Xét nghiệm có độ nhạy 95% và tỷ lệ dương tính giả 5%. Một người có kết quả dương tính. Hãy tính xác suất người đó thực sự mắc bệnh.',
    },
    {
      title: 'Phân phối Nhị thức - Bắn súng Xạ thủ',
      prompt:
        'Một xạ thủ bắn 5 phát độc lập vào bia với xác suất trúng mỗi phát là 0.8. Tính xác suất để xạ thủ bắn trúng ít nhất 4 phát.',
    },
    {
      title: 'Phân phối Chuẩn - Tra bảng Z-Score',
      prompt:
        'Điểm thi tuân theo phân phối Chuẩn N(6.5, 1.44). Tính xác suất chọn ngẫu nhiên một sinh viên có điểm từ 7.5 đến 9.0.',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageBase64(reader.result as string);
        setActiveTab('upload');
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other documents
      alert(`Đã nhận tài liệu: ${file.name}. Đang tạo bản xem trước cho bài làm.`);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageBase64(reader.result as string);
        setActiveTab('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGrade = async (canvasDataUrl?: string) => {
    setIsGrading(true);
    setGradingResult(null);

    const imageToSend = canvasDataUrl || uploadedImageBase64;

    try {
      const res = await fetch('/api/ai/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle,
          problemPrompt,
          studentText: studentTextNotes,
          imageBase64: imageToSend,
        }),
      });

      const data = await res.json();
      setGradingResult(data);

      if (data.totalScore >= 8) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra trong quá trình AI chấm điểm bài làm.');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem Header & Preset Selector */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Đề Bài Đang Làm (Active Problem)
            </span>
            <h2 className="text-base font-extrabold text-slate-800">
              {problemTitle}
            </h2>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">
              Đổi đề:
            </span>
            {sampleProblems.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setProblemTitle(p.title);
                  setProblemPrompt(p.prompt);
                  setGradingResult(null);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  problemTitle === p.title
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.title.split(' - ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <FormattedMathText text={problemPrompt} />
        </div>
      </div>

      {/* Workspace Area: iPad Canvas vs Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Writing & Drawing Zone (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'canvas'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Bảng vẽ Canvas (iPad/Tablet)</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh / File PDF</span>
              </button>
            </div>

            <button
              onClick={() => handleGrade()}
              disabled={isGrading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 transition"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI đang chấm điểm...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm Barem</span>
                </>
              )}
            </button>
          </div>

          {activeTab === 'canvas' ? (
            <div>
              <CanvasWorkspace
                height={460}
                onExportImage={(dataUrl) => handleGrade(dataUrl)}
                syncDiagram={syncDiagram}
              />
            </div>
          ) : (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/60 cursor-pointer transition flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-800">
                  Nhấn để chọn ảnh bài làm (JPG, PNG) hoặc kéo thả PDF
                </div>
                <p className="text-xs text-slate-400">
                  Hỗ trợ ảnh chụp vở bài tập viết tay, file scan hoặc bài làm từ tablet
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadedImageBase64 && (
                <div className="space-y-2 text-left">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Đã tải lên bài làm thành công!</span>
                  </div>
                  <div className="max-h-60 overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                    <img
                      src={uploadedImageBase64}
                      alt="Uploaded solution"
                      className="w-full object-contain bg-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student Text Note Input */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Ghi chú thêm cho AI Tutor (không bắt buộc):
            </label>
            <input
              type="text"
              value={studentTextNotes}
              onChange={(e) => setStudentTextNotes(e.target.value)}
              placeholder="Ví dụ: Em đang phân vân giữa dùng công thức cộng độc lập hay Bayes..."
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right Side: AI Tutor Barem Grading & Thinking Strategy (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Barem Điểm & Chiến Lược Tư Duy
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Quy chuẩn sư phạm: Gợi ý tư duy, không giải hộ
                  </p>
                </div>
              </div>

              {gradingResult && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-sm">
                  <span>{gradingResult.totalScore}</span>
                  <span className="text-xs text-indigo-400 font-normal">/ {gradingResult.maxScore}đ</span>
                </div>
              )}
            </div>

            {/* Grading State */}
            {isGrading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                <div className="text-xs font-bold text-slate-700">
                  AI đang nhận diện nét chữ OCR và đối chiếu Barem...
                </div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Quét ký hiệu toán học, tính toán trung gian và phân tích nhận thức sai lầm
                </p>
              </div>
            ) : gradingResult ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Pedagogical Notice Banner */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Quy tắc Sư phạm AI Tutor:</strong> Hệ thống cung cấp{' '}
                    <em>chiến lược giải</em> để bạn tự sửa lỗi, không đưa lời giải sẵn!
                  </div>
                </div>

                {/* Barem List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    Chi tiết Barem 4 Tiêu chí:
                  </span>
                  {gradingResult.barem.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {item.criterion}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-300 font-bold text-indigo-700">
                          {item.awardedScore}/{item.maxScore}đ
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {item.feedback}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Thinking Strategy */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Chiến Lược Tư Duy Định Hướng:
                  </span>
                  <div className="space-y-1.5">
                    {gradingResult.thinkingStrategy.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-indigo-600 shrink-0">
                          •
                        </span>
                        <FormattedMathText text={step} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Misconceptions */}
                {gradingResult.detectedMisconceptions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
                    <span className="font-bold text-rose-900 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Lỗ hổng nhận thức phát hiện:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
                      {gradingResult.detectedMisconceptions.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Encouragement */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  <strong>Lời khuyên của Thầy: </strong>
                  {gradingResult.encouragement}
                </div>
              </div>
            ) : (
              <div className="py-14 text-center space-y-2 text-slate-400">
                <PenTool className="w-8 h-8 mx-auto text-slate-300" />
                <div className="text-xs font-semibold text-slate-500">
                  Chưa có bài nộp nào
                </div>
                <p className="text-[11px] max-w-xs mx-auto">
                  Hãy dùng bút cảm ứng viết bài trên Bảng vẽ Canvas hoặc tải lên ảnh bài làm rồi nhấn "Nộp bài & Chấm điểm"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
