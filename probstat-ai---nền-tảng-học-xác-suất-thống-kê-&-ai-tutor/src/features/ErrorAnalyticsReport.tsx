import React, { useState } from 'react';
import { ErrorRecord } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  Filter,
  Loader2,
  ArrowRight,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

interface ErrorAnalyticsReportProps {
  errorRecords: ErrorRecord[];
  onRemoveRecord?: (id: string) => void;
}

export const ErrorAnalyticsReport: React.FC<ErrorAnalyticsReportProps> = ({
  errorRecords,
  onRemoveRecord,
}) => {
  const [selectedSource, setSelectedSource] = useState<'all' | 'viva' | 'quiz' | 'essay'>('all');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);

  const [aiReport, setAiReport] = useState<{
    overallAssessment: string;
    groupedCategories: {
      categoryName: string;
      count: number;
      rootCause: string;
      actionableFix: string;
    }[];
    concreteRemedies: string[];
    recommendedExercises: string[];
  }>({
    overallAssessment:
      'Nguyên nhân lỗi sai chủ yếu xuất phát từ việc "đồng nhất các khái niệm có vẻ tương đồng" (ví dụ: nhầm lẫn độc lập với xung khắc, nhầm lẫn phân phối của dữ liệu gốc với phân phối của trung bình mẫu CLT). Sinh viên có kỹ năng biến đổi đại số tốt nhưng cần củng cố lại bản chất định nghĩa xác suất.',
    groupedCategories: [
      {
        categoryName: 'Nhóm Lỗi Khái niệm Biến cố & Xác suất Tiên nghiệm',
        count: 2,
        rootCause:
          'Áp dụng công thức cộng P(A ∪ B) = P(A) + P(B) máy móc mà bỏ quên điều kiện tiên quyết là hai biến cố phải xung khắc.',
        actionableFix:
          'Luôn vẽ biểu đồ Venn hoặc sơ đồ cây. Nếu hai biến cố độc lập có xác suất dương, chúng luôn có phần giao P(AB) = P(A)P(B) > 0.',
      },
      {
        categoryName: 'Nhóm Lỗi Thống kê Suy diễn & Định lý Giới hạn (CLT)',
        count: 1,
        rootCause:
          'Cho rằng cỡ mẫu lớn sẽ làm biến đổi hình dạng của phân phối dữ liệu gốc, thay vì hiểu đúng là áp dụng cho phân phối của Trung bình mẫu X_bar.',
        actionableFix:
          'Ghi nhớ: Dữ liệu dân số gốc giữ nguyên hình dáng của nó; chỉ có đại lượng thống kê mẫu X_bar mới biến thành hình chuông chuẩn khi gom nhiều mẫu lại.',
      },
    ],
    concreteRemedies: [
      'Thực hành 10 bài tập phân biệt Xung khắc vs Độc lập trên Bảng vẽ Canvas.',
      'Xem lại Bản đồ tư duy nhánh 2 (Bayes) và nhánh 6 (CLT) để nắm vững cây phân nhánh.',
      'Luyện tập bộ đề trắc nghiệm chuyên đề có giải thích "Tại sao?" để khắc phục bẫy tư duy.',
    ],
    recommendedExercises: [
      'Bài tập chứng minh: "Nếu P(A)>0 và P(B)>0, chứng minh A và B không thể vừa độc lập vừa xung khắc".',
      'Bài toán mô phỏng CLT với phân phối mũ và kiểm tra tính chuẩn của trung bình mẫu.',
      'Bài toán chẩn đoán y khoa 2 lần xét nghiệm liên tiếp sử dụng định lý Bayes.',
    ],
  });

  const filteredErrors =
    selectedSource === 'all'
      ? errorRecords
      : errorRecords.filter((e) => e.source === selectedSource);

  const vivaCount = errorRecords.filter((e) => e.source === 'viva').length;
  const quizCount = errorRecords.filter((e) => e.source === 'quiz').length;
  const essayCount = errorRecords.filter((e) => e.source === 'essay').length;

  const handleRunAIDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/ai/diagnose-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorRecords }),
      });
      const data = await res.json();
      if (data.overallAssessment) {
        setAiReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview 3 Sources Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng số lỗi sai ghi nhận
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {errorRecords.length}
            </div>
            <div className="text-[11px] text-slate-500">Từ cả 3 nguồn học tập</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              1. Lỗi Vấn Đáp Lý Thuyết
            </div>
            <div className="text-2xl font-extrabold text-purple-950 mt-0.5">
              {vivaCount}
            </div>
            <div className="text-[11px] text-slate-500">Đối thoại trực tiếp với AI</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              2. Lỗi Trắc Nghiệm Quiz
            </div>
            <div className="text-2xl font-extrabold text-blue-950 mt-0.5">
              {quizCount}
            </div>
            <div className="text-[11px] text-slate-500">Bẫy phương án nhiễu</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              3. Lỗi Tự Luận Canvas
            </div>
            <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
              {essayCount}
            </div>
            <div className="text-[11px] text-slate-500">Barem bài làm tự luận</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Root-Cause Diagnostic Analysis Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Nhận Định Chung & Hướng Khắc Phục Cụ Thể Từ AI
              </h3>
              <p className="text-xs text-indigo-200">
                AI phân tích đa biến toàn bộ dữ liệu lỗi từ Vấn đáp, Trắc nghiệm và Tự luận
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAIDiagnosis}
            disabled={isDiagnosing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
          >
            {isDiagnosing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Chẩn Đoán Lại Lỗi Sai</span>
          </button>
        </div>

        {/* Overall Assessment */}
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-xs sm:text-sm leading-relaxed text-indigo-100">
          <strong className="text-white">Nhận định nguyên nhân gốc rễ: </strong>
          {aiReport.overallAssessment}
        </div>

        {/* Grouped Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiReport.groupedCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 text-sm">
                  {cat.categoryName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 font-bold text-[10px]">
                  {cat.count} lỗi
                </span>
              </div>
              <p className="text-slate-300">
                <strong className="text-rose-300">Nguyên nhân: </strong>
                {cat.rootCause}
              </p>
              <p className="text-emerald-300">
                <strong>Khắc phục: </strong>
                {cat.actionableFix}
              </p>
            </div>
          ))}
        </div>

        {/* Concrete Remedies & Recommended Exercises */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              Lộ trình khắc phục từng bước:
            </span>
            <ul className="space-y-1.5 text-indigo-200">
              {aiReport.concreteRemedies.map((rem, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              Bài tập rèn luyện đề xuất:
            </span>
            <ul className="space-y-1.5 text-indigo-200">
              {aiReport.recommendedExercises.map((ex, eIdx) => (
                <li key={eIdx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Error Log Table with Filter */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Nhật Ký Chi Tiết Toàn Bộ Lỗi Sai
            </h3>
            <p className="text-xs text-slate-400">
              Đối chiếu câu trả lời của bạn với lập luận đúng chuẩn
            </p>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Nguồn:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'viva', label: 'Vấn đáp' },
              { id: 'quiz', label: 'Trắc nghiệm' },
              { id: 'essay', label: 'Tự luận' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSource(s.id as any)}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  selectedSource === s.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Items List */}
        <div className="space-y-3">
          {filteredErrors.map((err) => (
            <div
              key={err.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      err.source === 'viva'
                        ? 'bg-purple-100 text-purple-800'
                        : err.source === 'quiz'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {err.source === 'viva'
                      ? 'Vấn đáp'
                      : err.source === 'quiz'
                      ? 'Trắc nghiệm'
                      : 'Tự luận'}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {err.errorName}
                  </span>
                  <span className="text-slate-400">• {err.topic}</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  {err.timestamp}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {err.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950">
                  <strong className="text-rose-800 block text-[11px] mb-0.5">
                    Câu trả lời / suy nghĩ ban đầu:
                  </strong>
                  <FormattedMathText text={err.studentAnswer} />
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <strong className="text-emerald-800 block text-[11px] mb-0.5">
                    Lập luận toán học chính xác:
                  </strong>
                  <FormattedMathText text={err.correctLogic} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
