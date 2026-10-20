import React, { useState } from 'react';
import { SimilarProblem } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  Dices,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  PenTool,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

interface SimilarProblemGeneratorProps {
  onSendToCanvas?: (title: string, prompt: string) => void;
}

export const SimilarProblemGenerator: React.FC<SimilarProblemGeneratorProps> = ({
  onSendToCanvas,
}) => {
  const [topic, setTopic] = useState<string>('Công thức Bayes & Xác suất Toàn phần');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>('sim-1');

  const [problems, setProblems] = useState<SimilarProblem[]>([
    {
      id: 'sim-1',
      title: 'Kiểm định Sản phẩm Lỗi tại Dây chuyền Lắp ráp Vi mạch',
      context: 'Sản xuất Công nghệ cao',
      difficulty: 'Trung bình',
      problemStatement:
        'Một nhà máy có 3 dây chuyền I, II, III lần lượt sản xuất 40%, 35%, 25% tổng sản lượng chip. Tỷ lệ phế phẩm tương ứng là 2%, 3% và 5%. Lấy ngẫu nhiên 1 con chip từ kho và thấy nó bị hỏng. Hãy tính xác suất con chip này do dây chuyền II sản xuất.',
      latex: 'P(A_2|F) = \\text{?}',
      thinkingStrategy: [
        'Bước 1: Gọi $A_1, A_2, A_3$ là biến cố chip do các dây chuyền sản xuất. Kiểm tra xem chúng có lập thành hệ đầy đủ không? Tổng xác suất tiên nghiệm bằng bao nhiêu?',
        'Bước 2: Gọi $F$ là biến cố chip bị hỏng. Tính xác suất toàn phần $P(F)$ bằng cách lấy tổng các nhánh nhân $P(A_i)P(F|A_i)$.',
        'Bước 3: Dùng định lý Bayes đảo ngược để tìm $P(A_2|F)$. Hãy tự thế số và rút gọn phân số.',
      ],
      keyFormulas: [
        'P(F) = \\sum_{i=1}^3 P(A_i)P(F|A_i)',
        'P(A_2|F) = \\frac{P(A_2)P(F|A_2)}{P(F)}',
      ],
      pitfallsToAvoid: [
        'Nhầm lẫn giữa xác suất điều kiện đề bài cho $P(F|A_2) = 0.03$ với xác suất cần tìm $P(A_2|F)$.',
      ],
    },
    {
      id: 'sim-2',
      title: 'Hệ thống Cảnh báo Xâm nhập An ninh Mạng',
      context: 'An ninh Thông tin & AI',
      difficulty: 'Nâng cao',
      problemStatement:
        'Trong một mạng máy tính doanh nghiệp, xác suất xảy ra cuộc tấn công mạng trong một giờ bất kỳ là 0.005. Hệ thống IDS có xác suất báo động khi có tấn công là 98%, nhưng xác suất báo động giả khi không có tấn công là 1%. Nếu còi báo động vang lên, xác suất mạng thực sự bị tấn công là bao nhiêu?',
      latex: 'P(\\text{Attack}|\\text{Alert}) = \\text{?}',
      thinkingStrategy: [
        'Bước 1: Liệt kê tiên nghiệm $P(\\text{Attack}) = 0.005$ và xác suất phần bù $P(\\overline{\\text{Attack}}) = 0.995$.',
        'Bước 2: Xác định rõ tỷ lệ báo động giả xảy ra ở nhóm lưu lượng an toàn.',
        'Bước 3: Lập bảng phân tích trên 100,000 giờ để có trực giác số nguyên trước khi áp dụng công thức Bayes.',
      ],
      keyFormulas: [
        'P(\\text{Alert}) = P(\\text{At})P(\\text{Al}|\\text{At}) + P(\\overline{\\text{At}})P(\\text{Al}|\\overline{\\text{At}})',
        'P(\\text{At}|\\text{Al}) = \\frac{P(\\text{At})P(\\text{Al}|\\text{At})}{P(\\text{Alert})}',
      ],
      pitfallsToAvoid: [
        'Đừng ngộ nhận độ nhạy 98% nghĩa là báo động luôn đúng tới 98%! Tỷ lệ báo động giả nhân với dân số lớn sẽ lấn át.',
      ],
    },
    {
      id: 'sim-3',
      title: 'Duyệt Hồ sơ Tín dụng Rủi ro Ngân hàng',
      context: 'Tài chính - Ngân hàng',
      difficulty: 'Trung bình',
      problemStatement:
        'Tại một ngân hàng thương mại, 80% khách hàng thuộc nhóm trả nợ tốt và 20% thuộc nhóm có nguy cơ nợ xấu. Qua mô hình chấm điểm tín dụng, 90% khách hàng tốt có điểm số cao, trong khi chỉ 15% khách nợ xấu đạt điểm cao. Một khách hàng nộp hồ sơ và đạt điểm cao, xác suất khách này thực sự thuộc nhóm tốt là bao nhiêu?',
      latex: 'P(\\text{Good}|\\text{HighScore}) = \\text{?}',
      thinkingStrategy: [
        'Bước 1: Xác định biến cố cơ sở và biến cố bằng chứng.',
        'Bước 2: Tính tổng xác suất nhận điểm cao trên toàn bộ khách hàng.',
        'Bước 3: Áp dụng định lý Bayes để cập nhật độ tin cậy của nhóm khách hàng tốt.',
      ],
      keyFormulas: [
        'P(\\text{HighScore}) = P(G)P(HS|G) + P(B)P(HS|B)',
        'P(G|HS) = \\frac{P(G)P(HS|G)}{P(\\text{HighScore})}',
      ],
      pitfallsToAvoid: [
        'Quên rằng nhóm khách nợ xấu vẫn có một tỷ lệ nhỏ đạt điểm số cao do ngẫu nhiên.',
      ],
    },
    {
      id: 'sim-4',
      title: 'Kiểm soát Thất thoát Dữ liệu Cảm biến IoT',
      context: 'Internet of Things',
      difficulty: 'Cơ bản',
      problemStatement:
        'Một trạm thời tiết sử dụng hai loại cảm biến nhiệt độ: loại A chiếm 60% số lượng với sai số vượt mức 2%, loại B chiếm 40% với sai số vượt mức 5%. Lấy ngẫu nhiên một cảm biến kiểm tra và thấy sai số vượt mức. Tính xác suất cảm biến đó là loại A.',
      latex: 'P(A|\\text{Error}) = \\text{?}',
      thinkingStrategy: [
        'Bước 1: Tính xác suất cảm biến bất kỳ bị lỗi vượt mức.',
        'Bước 2: Chia phần đóng góp của loại A cho tổng lỗi chung.',
      ],
      keyFormulas: ['P(A|E) = \\frac{P(A)P(E|A)}{P(E)}'],
      pitfallsToAvoid: [
        'Không cộng tổng xác suất toàn phần trước khi tính tỷ lệ.',
      ],
    },
    {
      id: 'sim-5',
      title: 'Thuật toán Lọc Email Spam Đa lớp',
      context: 'Trí tuệ nhân tạo (NLP)',
      difficulty: 'Nâng cao',
      problemStatement:
        'Hộp thư người dùng nhận được 30% email là Spam và 70% là Ham (hợp lệ). Trong email Spam, từ khóa "Khuyến mãi đặc biệt" xuất hiện với tần suất 60%; trong email Ham, từ khóa này xuất hiện với tần suất 3%. Một email mới nhận có chứa từ khóa này, hãy tính xác suất email đó là Spam.',
      latex: 'P(\\text{Spam}|\\text{Keyword}) = \\text{?}',
      thinkingStrategy: [
        'Bước 1: Thiết lập tiên nghiệm $P(\\text{Spam})=0.3, P(\\text{Ham})=0.7$.',
        'Bước 2: Tính hàm hợp lý của từ khóa trong cả 2 lớp email.',
        'Bước 3: Áp dụng Naive Bayes đơn biến để tìm xác suất hậu nghiệm.',
      ],
      keyFormulas: [
        'P(K) = P(\\text{Spam})P(K|\\text{Spam}) + P(\\text{Ham})P(K|\\text{Ham})',
        'P(\\text{Spam}|K) = \\frac{P(\\text{Spam})P(K|\\text{Spam})}{P(K)}',
      ],
      pitfallsToAvoid: [
        'Đánh đồng tần suất xuất hiện từ khóa với xác suất của bản thân email.',
      ],
    },
  ]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          sampleProblem: 'Bài toán xác suất toàn phần và định lý Bayes trong thực tế',
        }),
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProblems(data);
        setExpandedProblemId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể tạo bài tập mới từ AI. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Dices className="w-4 h-4" />
            <span>Random Generator (5 Bài Tập Tự Luận Cùng Dạng)</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 mt-1">
            Bộ 5 Bài Toán Tự Luyện Tương Tự Có Kèm Chiến Lược Tư Duy
          </h2>
          <p className="text-xs text-slate-500">
            AI tự động đổi số liệu, biến hóa đa dạng ngữ cảnh thực tiễn và giữ nguyên cốt lõi kiến thức.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="Công thức Bayes & Xác suất Toàn phần">
              Bayes & Xác suất Toàn phần
            </option>
            <option value="Phân phối Nhị thức & Bernoulli">
              Phân phối Nhị thức B(n, p)
            </option>
            <option value="Phân phối Chuẩn & Tra Z-score">
              Phân phối Chuẩn Gauss
            </option>
            <option value="Định lý Giới hạn Trung tâm (CLT)">
              Định lý Giới hạn Trung tâm
            </option>
            <option value="Kiểm định Giả thuyết Z-test & t-test">
              Kiểm định Giả thuyết
            </option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Sinh 5 Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Lưu ý Sư phạm:</strong> Với mỗi bài tập, AI Tutor chỉ cung cấp <em>chiến lược giải</em> (gợi ý từng bước tư duy), KHÔNG cung cấp đáp số hoàn chỉnh để bạn tự rèn luyện tính toán.
        </span>
      </div>

      {/* 5 Problems Accordion List */}
      <div className="space-y-4">
        {problems.map((p, idx) => {
          const isExpanded = expandedProblemId === p.id;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                isExpanded ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-slate-200'
              }`}
            >
              {/* Problem Title Bar */}
              <div
                onClick={() => setExpandedProblemId(isExpanded ? null : p.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">
                        {p.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        {p.context}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.difficulty === 'Cơ bản'
                            ? 'bg-emerald-100 text-emerald-700'
                            : p.difficulty === 'Trung bình'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onSendToCanvas && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendToCanvas(p.title, p.problemStatement);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
                      title="Chuyển bài tập này sang Bảng vẽ Canvas để làm và nộp AI Tutor chấm"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Làm trên Canvas</span>
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-fadeIn">
                  {/* Problem Statement */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block mb-1">
                      Nội dung đề bài
                    </span>
                    <FormattedMathText
                      text={p.problemStatement}
                      className="text-slate-800 text-sm leading-relaxed"
                    />
                    {p.latex && (
                      <div className="mt-2 text-center p-1.5 bg-slate-50 rounded-lg">
                        <MathView math={p.latex} block={true} />
                      </div>
                    )}
                  </div>

                  {/* Thinking Strategy Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strategy Hints */}
                    <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Chiến Lược Tư Duy Định Hướng (Không giải hộ):
                      </span>
                      <div className="space-y-1.5 text-indigo-950">
                        {p.thinkingStrategy.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5">
                            <span className="font-bold text-indigo-600 shrink-0">•</span>
                            <FormattedMathText text={step} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key formulas & Pitfalls */}
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">
                          Công thức chìa khóa cần vận dụng:
                        </span>
                        <div className="space-y-1">
                          {p.keyFormulas.map((f, fIdx) => (
                            <div key={fIdx} className="p-1 bg-slate-50 rounded text-center">
                              <MathView math={f} block={true} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-rose-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Cạm bẫy cần tránh:
                        </span>
                        <div className="space-y-1">
                          {p.pitfallsToAvoid.map((pit, pIdx) => (
                            <div key={pIdx}>
                              <FormattedMathText text={pit} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
