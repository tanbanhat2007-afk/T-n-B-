import {
  MindmapNode,
  QuizQuestion,
  SimilarProblem,
  ErrorRecord,
  ForumPost,
  UserLearningProfile,
} from '../types';

export interface FourStepLesson {
  id: string;
  topic: string;
  title: string;
  subtitle: string;
  step1: {
    title: string;
    scenario: string;
    realWorldProblem: string;
    guidingQuestions: string[];
    intuitionKey: string;
  };
  step2: {
    title: string;
    theoremName: string;
    statement: string;
    latexFormula: string;
    variablesExplanation: { symbol: string; meaning: string }[];
    coreTakeaway: string;
  };
  step3: {
    title: string;
    exampleProblem: string;
    latexExample?: string;
    stepByStepStrategy: {
      step: number;
      action: string;
      reasoning: string;
      intermediateLatex?: string;
    }[];
    finalResult: string;
    tutorAdvice: string;
  };
  step4: {
    title: string;
    challengeProblem: string;
    latexChallenge?: string;
    hints: string[];
    practiceQuestions: string[];
  };
}

export const FOUR_STEP_LESSONS: FourStepLesson[] = [
  {
    id: 'bayes-theorem',
    topic: 'Công thức Xác suất Đầy đủ & Định lý Bayes',
    title: 'Giải mã Định lý Bayes trong Chẩn đoán Y khoa & AI',
    subtitle: 'Làm sao từ kết quả xét nghiệm dương tính tính được xác suất thực sự mắc bệnh?',
    step1: {
      title: 'Bước 1: Khám phá & Nêu vấn đề (Inquiry)',
      scenario: 'Một căn bệnh hiểm nghèo có tỷ lệ mắc trong cộng đồng là 1% ($P(B) = 0.01$). Một xét nghiệm y tế mới có độ chính xác 95% ($P(+|B) = 0.95$), nhưng nếu người khỏe mạnh đi xét nghiệm thì vẫn có 5% bị dương tính giả ($P(+|\\bar{B}) = 0.05$).',
      realWorldProblem: 'Một bệnh nhân đi khám tổng quát và nhận kết quả "DƯƠNG TÍNH". Bệnh nhân vô cùng hoảng sợ và tin chắc rằng mình có 95% nguy cơ mắc bệnh. Liệu nhận định đó có đúng hay không?',
      guidingQuestions: [
        'Tỷ lệ người thực sự không mắc bệnh trong cộng đồng là bao nhiêu?',
        'Có mấy nhóm người có thể nhận kết quả Dương tính?',
        'Tại sao độ nhạy 95% không đồng nghĩa với xác suất mắc bệnh khi dương tính là 95%?',
      ],
      intuitionKey: 'Ta cần phân biệt rõ giữa Xác suất có điều kiện thuận $P(+|B)$ và Xác suất hậu nghiệm nghịch đảo $P(B|+)$!',
    },
    step2: {
      title: 'Bước 2: Bản chất Lý thuyết & Định lý Toán học',
      theoremName: 'Hệ thống Công thức Xác suất Đầy đủ và Công thức Bayes',
      statement: 'Cho một hệ biến cố đầy đủ $A_1, A_2, \\dots, A_n$ với $P(A_i) > 0$. Với mọi biến cố $B$ có $P(B) > 0$, ta có:',
      latexFormula: 'P(A_k|B) = \\frac{P(A_k) \\cdot P(B|A_k)}{\\sum_{i=1}^n P(A_i) \\cdot P(B|A_i)}',
      variablesExplanation: [
        { symbol: 'P(A_k)', meaning: 'Xác suất tiên nghiệm (Prior probability) của nguyên nhân $A_k$' },
        { symbol: 'P(B|A_k)', meaning: 'Hàm hợp lý (Likelihood): xác suất biến cố $B$ xảy ra nếu nguyên nhân $A_k$ đúng' },
        { symbol: '\\sum P(A_i)P(B|A_i)', meaning: 'Công thức xác suất đầy đủ của biến cố bằng chứng $B$' },
        { symbol: 'P(A_k|B)', meaning: 'Xác suất hậu nghiệm (Posterior probability) cập nhật sau khi có thông tin $B$' },
      ],
      coreTakeaway: 'Bayes là cỗ máy cập nhật niềm tin khoa học: từ niềm tin ban đầu (tiên nghiệm) cộng thêm chứng cứ mới (dữ liệu) để đưa ra niềm tin mới chính xác hơn!',
    },
    step3: {
      title: 'Bước 3: Ví dụ Minh họa & Chiến lược Giải',
      exampleProblem: 'Tính chính xác xác suất bệnh nhân thực sự mắc bệnh khi đã nhận kết quả Dương tính $P(B|+)$ theo bài toán y khoa ở Bước 1.',
      latexExample: 'P(B) = 0.01, \\quad P(\\bar{B}) = 0.99, \\quad P(+|B) = 0.95, \\quad P(+|\\bar{B}) = 0.05',
      stepByStepStrategy: [
        {
          step: 1,
          action: 'Đặt ký hiệu biến cố rõ ràng',
          reasoning: 'Gọi $B$ là biến cố "Người đó mắc bệnh", $\\bar{B}$ là "Người đó không mắc bệnh". Gọi $+$ là biến cố "Xét nghiệm cho kết quả dương tính".',
        },
        {
          step: 2,
          action: 'Tính xác suất toàn phần của bằng chứng $P(+)$',
          reasoning: 'Áp dụng công thức xác suất đầy đủ qua hai nhánh người bệnh và người lành:',
          intermediateLatex: 'P(+) = P(B)P(+|B) + P(\\bar{B})P(+|\\bar{B}) = 0.01 \\times 0.95 + 0.99 \\times 0.05 = 0.0095 + 0.0495 = 0.059',
        },
        {
          step: 3,
          action: 'Cập nhật xác suất theo công thức Bayes',
          reasoning: 'Lấy tích xác suất của nhánh mong muốn chia cho tổng xác suất toàn phần:',
          intermediateLatex: 'P(B|+) = \\frac{P(B)P(+|B)}{P(+)} = \\frac{0.0095}{0.059} \\approx 0.161 \\; (16.1\\%)',
        },
      ],
      finalResult: 'Chỉ có khoảng 16.1% cơ hội người đó thực sự mắc bệnh!',
      tutorAdvice: 'Bẫy phổ biến: Nhiều sinh viên hay quên nhân tỷ lệ người lành $P(\\bar{B}) = 0.99$. Do người lành chiếm áp đảo trong dân số nên số ca dương tính giả (4.95%) gấp hơn 5 lần số ca dương tính thật (0.95%)!',
    },
    step4: {
      title: 'Bước 4: Luyện tập Ứng dụng & Phát triển Tư duy',
      challengeProblem: 'Nếu bệnh nhân trên tiến hành làm xét nghiệm lần thứ hai độc lập và lại tiếp tục nhận kết quả "DƯƠNG TÍNH", hãy tính xác suất người này mắc bệnh lúc này?',
      latexChallenge: 'P(B|+_1,+_2) = \\text{?}',
      hints: [
        'Xem xác suất hậu nghiệm của lần 1 (16.1%) như xác suất tiên nghiệm mới của lần 2!',
        'Áp dụng lại công thức Bayes với $P(B) = 0.161$ và $P(\\bar{B}) = 0.839$.',
      ],
      practiceQuestions: [
        'Bài toán phát hiện thư rác (Spam Filter) bằng Naive Bayes hoạt động như thế nào?',
        'Điều gì xảy ra với công thức Bayes nếu $A_1, A_2, A_3$ không tạo thành hệ đầy đủ?',
      ],
    },
  },
  {
    id: 'binomial-distribution',
    topic: 'Phân phối Xác suất Rời rạc - Phân phối Nhị thức',
    title: 'Lược đồ Bernoulli và Phân phối Nhị thức B(n, p)',
    subtitle: 'Mô hình hóa số lần thành công trong chuỗi phép thử độc lập',
    step1: {
      title: 'Bước 1: Khám phá & Nêu vấn đề (Inquiry)',
      scenario: 'Một xạ thủ bắn 5 phát đạn vào bia, xác suất trúng đích mỗi phát là 0.8 một cách độc lập.',
      realWorldProblem: 'Huấn luyện viên muốn biết xác suất để xạ thủ bắn trúng đúng 4 phát là bao nhiêu? Liệu có phải là $0.8^4 \\times 0.2$ không?',
      guidingQuestions: [
        'Thứ tự các phát bắn trúng có quan trọng không?',
        'Có bao nhiêu cách sắp xếp 4 phát trúng trong 5 phát bắn?',
        'Thế nào là một chuỗi phép thử độc lập thỏa mãn lược đồ Bernoulli?',
      ],
      intuitionKey: 'Phải nhân với tổ hợp $C_n^k$ vì 4 phát trúng có thể xuất hiện ở bất kỳ 4 trong 5 lần bắn!',
    },
    step2: {
      title: 'Bước 2: Bản chất Lý thuyết & Định lý Toán học',
      theoremName: 'Hàm khối xác suất (PMF) của Phân phối Nhị thức $X \\sim B(n, p)$',
      statement: 'Biến ngẫu nhiên $X$ biểu thị số lần thành công trong $n$ phép thử Bernoulli độc lập với xác suất thành công mỗi lần là $p$ ($0 < p < 1$):',
      latexFormula: 'P(X = k) = C_n^k \\cdot p^k \\cdot (1 - p)^{n - k}, \\quad k = 0, 1, 2, \\dots, n',
      variablesExplanation: [
        { symbol: 'n', meaning: 'Tổng số phép thử độc lập' },
        { symbol: 'p', meaning: 'Xác suất thành công trong 1 phép thử duy nhất' },
        { symbol: 'q = 1 - p', meaning: 'Xác suất thất bại' },
        { symbol: 'C_n^k = \\frac{n!}{k!(n-k)!}', meaning: 'Số cách chọn k lần thành công từ n lần thử' },
        { symbol: 'E[X] = np, \\; \\text{Var}(X) = np(1-p)', meaning: 'Kỳ vọng và Phương sai của biến ngẫu nhiên nhị thức' },
      ],
      coreTakeaway: 'Ba điều kiện bắt buộc: (1) Số phép thử cố định, (2) Chỉ có 2 kết cục (Thành công / Thất bại), (3) Các phép thử độc lập và $p$ không đổi.',
    },
    step3: {
      title: 'Bước 3: Ví dụ Minh họa & Chiến lược Giải',
      exampleProblem: 'Với xạ thủ trên ($n=5, p=0.8$), tính xác suất bắn trúng đúng 4 phát và ít nhất 4 phát.',
      latexExample: 'X \\sim B(5, 0.8)',
      stepByStepStrategy: [
        {
          step: 1,
          action: 'Xác định biến ngẫu nhiên và thông số',
          reasoning: 'Gọi $X$ là số phát bắn trúng bia. Do các phát bắn độc lập cùng xác suất $p=0.8$, $X \\sim B(5, 0.8)$.',
        },
        {
          step: 2,
          action: 'Tính xác suất trúng đúng 4 phát $P(X = 4)$',
          reasoning: 'Thay $n=5, k=4, p=0.8$ vào công thức:',
          intermediateLatex: 'P(X = 4) = C_5^4 \\cdot (0.8)^4 \\cdot (0.2)^1 = 5 \\cdot 0.4096 \\cdot 0.2 = 0.4096',
        },
        {
          step: 3,
          action: 'Tính xác suất trúng ít nhất 4 phát $P(X \\ge 4)$',
          reasoning: 'Gộp hai trường hợp rời nhau: trúng 4 phát hoặc trúng cả 5 phát:',
          intermediateLatex: 'P(X \\ge 4) = P(X=4) + P(X=5) = 0.4096 + C_5^5(0.8)^5 = 0.4096 + 0.32768 = 0.73728',
        },
      ],
      finalResult: 'Xác suất trúng đúng 4 phát là 40.96%; xác suất trúng ít nhất 4 phát là 73.73%.',
      tutorAdvice: 'Khi gặp cụm từ "ít nhất", hãy cân nhắc dùng biến cố đối nếu số trường hợp thuận quá dài!',
    },
    step4: {
      title: 'Bước 4: Luyện tập Ứng dụng & Mở rộng',
      challengeProblem: 'Nếu xạ thủ bắn 100 phát đạn, tính xác suất xạ thủ bắn trúng từ 75 đến 85 phát? Ta có nên tính tổng 11 số hạng của nhị thức không?',
      hints: [
        'Khi $n$ lớn và $p$ vừa phải ($np \\ge 5, nq \\ge 5$), hãy xấp xỉ Nhị thức bằng Phân phối Chuẩn (Định lý Moivre-Laplace)!',
        'Đừng quên hiệu chỉnh tính liên tục $\\pm 0.5$ (continuity correction).',
      ],
      practiceQuestions: [
        'Khi nào phân phối Nhị thức được xấp xỉ bằng phân phối Poisson thay vì Chuẩn?',
        'Số phát bắn trúng trung bình (kỳ vọng) khi bắn 5 phát là bao nhiêu?',
      ],
    },
  },
  {
    id: 'normal-distribution',
    topic: 'Phân phối Chuẩn & Định lý Giới hạn Trung tâm',
    title: 'Phân phối Chuẩn Gauss $\\mathcal{N}(\\mu, \\sigma^2)$ & Chuẩn hóa Z-Score',
    subtitle: 'Nền tảng của toàn bộ suy diễn thống kê hiện đại',
    step1: {
      title: 'Bước 1: Khám phá & Nêu vấn đề',
      scenario: 'Điểm thi môn Xác suất Thống kê của 5000 sinh viên tuân theo phân phối Chuẩn với điểm trung bình $\\mu = 6.5$ và độ lệch chuẩn $\\sigma = 1.2$.',
      realWorldProblem: 'Nhà trường muốn trao học bổng cho Top 5% sinh viên có điểm cao nhất. Sinh viên phải đạt tối thiểu bao nhiêu điểm để nhận được học bổng?',
      guidingQuestions: [
        'Làm thế nào để tra cứu xác suất cho một phân phối liên tục bất kỳ?',
        'Công cụ nào cho phép chuyển đổi mọi phân phối chuẩn về chuẩn tắc $Z \\sim \\mathcal{N}(0, 1)$?',
      ],
      intuitionKey: 'Phép chuẩn hóa Z-score đo lường xem một giá trị cách giá trị trung bình bao nhiêu độ lệch chuẩn!',
    },
    step2: {
      title: 'Bước 2: Bản chất Lý thuyết & Định lý Toán học',
      theoremName: 'Định nghĩa Phân phối Chuẩn & Công thức Chuẩn hóa Z-Score',
      statement: 'Biến ngẫu nhiên $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$. Đặt $Z = \\frac{X - \\mu}{\\sigma}$, khi đó $Z \\sim \\mathcal{N}(0, 1)$ có hàm mật độ đối xứng quanh 0:',
      latexFormula: 'P(a \\le X \\le b) = \\Phi\\left(\\frac{b - \\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{a - \\mu}{\\sigma}\\right)',
      variablesExplanation: [
        { symbol: '\\mu', meaning: 'Giá trị kỳ vọng trung bình, quyết định vị trí đỉnh chuông' },
        { symbol: '\\sigma', meaning: 'Độ lệch chuẩn, quyết định độ bẹt hoặc thon gọn của chuông' },
        { symbol: '\\Phi(z) = P(Z \\le z)', meaning: 'Hàm phân phối tích lũy của phân phối chuẩn tắc' },
      ],
      coreTakeaway: 'Quy tắc 68 - 95 - 99.7: 68% dữ liệu nằm trong $[\mu - \sigma, \mu + \sigma]$, 95% nằm trong $[\mu - 2\sigma, \mu + 2\sigma]$, 99.7% nằm trong $[\mu - 3\sigma, \mu + 3\sigma]$.',
    },
    step3: {
      title: 'Bước 3: Ví dụ Minh họa & Chiến lược Giải',
      exampleProblem: 'Tìm điểm chuẩn $x_0$ sao cho $P(X \\ge x_0) = 0.05$ với $\\mu = 6.5, \\sigma = 1.2$.',
      latexExample: 'P(X \\ge x_0) = 0.05 \\iff P(X < x_0) = 0.95',
      stepByStepStrategy: [
        {
          step: 1,
          action: 'Chuyển về biến cố tích lũy tích cực bên trái',
          reasoning: 'Do bảng Laplace hoặc Z-table thường cho giá trị bên trái: $P(X \\le x_0) = 1 - 0.05 = 0.95$.',
        },
        {
          step: 2,
          action: 'Tra ngược phân vị chuẩn tắc $z$',
          reasoning: 'Tra bảng tìm giá trị $z$ sao cho $\\Phi(z) = 0.95$, ta được $z_{0.95} \\approx 1.645$.',
          intermediateLatex: 'Z = \\frac{x_0 - 6.5}{1.2} = 1.645',
        },
        {
          step: 3,
          action: 'Giải tìm giá trị thực $x_0$',
          reasoning: 'Nhân chéo và cộng kỳ vọng:',
          intermediateLatex: 'x_0 = 6.5 + 1.645 \\times 1.2 = 6.5 + 1.974 = 8.474',
        },
      ],
      finalResult: 'Sinh viên cần đạt từ 8.47 điểm trở lên để lọt vào Top 5% nhận học bổng.',
      tutorAdvice: 'Chú ý phân biệt bảng cho $\\Phi(z) = P(Z \\le z)$ và bảng tích phân Laplace $\\Phi_0(z) = \\int_0^z \\dots$ vì $\\Phi(z) = 0.5 + \\Phi_0(z)$!',
    },
    step4: {
      title: 'Bước 4: Luyện tập Ứng dụng & Phát triển',
      challengeProblem: 'Nếu chọn ngẫu nhiên một mẫu gồm 36 sinh viên, tính xác suất để điểm trung bình của mẫu $\\bar{X}$ lớn hơn 7.0 điểm?',
      hints: [
        'Theo Định lý Giới hạn Trung tâm (CLT), trung bình mẫu $\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$.',
        'Độ lệch chuẩn của mẫu (sai số chuẩn SE) là $\\sigma / \\sqrt{n} = 1.2 / 6 = 0.2$.',
      ],
      practiceQuestions: [
        'Tại sao khi kích thước mẫu $n$ tăng thì sai số chuẩn lại thu hẹp lại?',
        'Điều kiện nào của mẫu để áp dụng phân phối Student-t thay cho Z?',
      ],
    },
  },
];

export const MINDMAP_NODES: MindmapNode[] = [
  {
    id: 'root',
    title: 'Xác suất & Thống kê Ứng dụng',
    category: 'core',
    description: 'Toàn bộ hệ thống kiến thức Toán xác suất và Thống kê suy diễn.',
    coreFormulas: ['P(\\Omega) = 1', 'E[X] = \\int x f(x) dx', '\\text{CI}_{1-\\alpha}: \\bar{X} \\pm Z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}'],
    keyConcept: 'Mô hình hóa sự không chắc chắn và ra quyết định dựa trên dữ liệu mẫu.',
    exampleProblemSnippet: 'Mọi vấn đề từ tung đồng xu đến mô hình học máy Deep Learning đều vận hành trên nền tảng XSTK.',
    commonTrap: 'Không phân biệt giữa biến ngẫu nhiên lý thuyết và giá trị quan sát trong mẫu cụ thể.',
  },
  {
    id: 'prob-rules',
    parentId: 'root',
    title: '1. Không gian mẫu & Quy tắc Xác suất',
    category: 'probability',
    description: 'Nền tảng biến cố, không gian mẫu Ω, công thức cộng và nhân xác suất.',
    coreFormulas: ['P(A \\cup B) = P(A) + P(B) - P(AB)', 'P(\\bar{A}) = 1 - P(A)'],
    keyConcept: 'Biến cố xung khắc thì $P(AB)=0$; biến cố độc lập thì $P(AB)=P(A)P(B)$.',
    exampleProblemSnippet: 'Rút ngẫu nhiên 2 lá bài từ bộ 52 lá, tính xác suất để có ít nhất 1 lá Át.',
    commonTrap: 'Đánh đồng "Biến cố xung khắc" và "Biến cố độc lập". Hai khái niệm này hoàn toàn khác nhau!',
  },
  {
    id: 'conditional-bayes',
    parentId: 'prob-rules',
    title: '2. Xác suất Điều kiện & Định lý Bayes',
    category: 'probability',
    description: 'Xác suất khi có thêm thông tin đã xảy ra, hệ đầy đủ và công thức đảo.',
    coreFormulas: ['P(A|B) = \\frac{P(AB)}{P(B)}', 'P(B) = \\sum P(A_i)P(B|A_i)', 'P(A_k|B) = \\frac{P(A_k)P(B|A_k)}{P(B)}'],
    keyConcept: 'Cập nhật xác suất từ tiên nghiệm $P(A)$ thành hậu nghiệm $P(A|B)$ khi có bằng chứng $B$.',
    exampleProblemSnippet: 'Xét nghiệm chẩn đoán bệnh ung thư hoặc phân loại thư rác Spam Filter.',
    commonTrap: 'Nhầm lẫn giữa $P(A|B)$ và $P(B|A)$ (Ngụy biện công tố viên - Prosecutor\'s Fallacy).',
  },
  {
    id: 'discrete-rv',
    parentId: 'root',
    title: '3. Biến Ngẫu Nhiên Rời Rạc',
    category: 'distribution',
    description: 'Biến nhận các giá trị rời rạc đếm được: Phân phối Nhị thức, Poisson, Siêu bội, Hình học.',
    coreFormulas: ['P(X=k) = C_n^k p^k (1-p)^{n-k}', 'P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}'],
    keyConcept: 'Hàm khối xác suất (PMF) có tổng xác suất trên mọi giá trị bằng 1.',
    exampleProblemSnippet: 'Đếm số lượng cuộc gọi đến tổng đài trong 1 phút hoặc số linh kiện lỗi trong lô hàng.',
    commonTrap: 'Quên điều kiện độc lập khi áp dụng phân phối Nhị thức thay vì Siêu bội.',
  },
  {
    id: 'continuous-rv',
    parentId: 'root',
    title: '4. Biến Ngẫu Nhiên Liên Tục',
    category: 'distribution',
    description: 'Biến nhận giá trị trên một khoảng liên tục: Phân phối Chuẩn Gauss, Phân phối Mũ, Student-t.',
    coreFormulas: ['f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}', 'P(X = c) = 0'],
    keyConcept: 'Xác suất tại 1 điểm cụ thể luôn bằng 0; xác suất tương ứng với diện tích dưới đường cong mật độ.',
    exampleProblemSnippet: 'Tính xác suất thời gian chờ xe buýt không vượt quá 15 phút.',
    commonTrap: 'Tưởng rằng hàm mật độ xác suất $f(x)$ chính là xác suất (thực tế $f(x)$ có thể $> 1$).',
  },
  {
    id: 'numerical-chars',
    parentId: 'root',
    title: '5. Các Đặc trưng Số của Biến Ngẫu Nhiên',
    category: 'core',
    description: 'Kỳ vọng, Phương sai, Độ lệch chuẩn, Hiệp phương sai và Hệ số tương quan.',
    coreFormulas: ['E[X] = \\sum x_i p_i', '\\text{Var}(X) = E[X^2] - (E[X])^2', '\\rho_{XY} = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}'],
    keyConcept: 'Kỳ vọng đo vị trí trung tâm, Phương sai đo độ rủi ro phân tán quanh trung bình.',
    exampleProblemSnippet: 'Tính lợi nhuận kỳ vọng và mức độ rủi ro của danh mục đầu tư 2 cổ phiếu.',
    commonTrap: 'Cho rằng $\\text{Var}(aX) = a\\text{Var}(X)$, trong khi đúng phải là $a^2\\text{Var}(X)$.',
  },
  {
    id: 'clt-sampling',
    parentId: 'root',
    title: '6. Luật Số Lớn & Định lý Giới hạn Trung tâm (CLT)',
    category: 'statistics',
    description: 'Cầu nối giữa tổng thể và mẫu. Khi cỡ mẫu đủ lớn, trung bình mẫu xấp xỉ chuẩn.',
    coreFormulas: ['\\bar{X} \\xrightarrow{P} \\mu', '\\bar{X} \\approx \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)'],
    keyConcept: 'Dù tổng thể có phân phối bất kỳ (lệch, rời rạc), trung bình mẫu với $n \\ge 30$ đều tiến về chuẩn!',
    exampleProblemSnippet: 'Mô phỏng 10,000 lần tung 100 xúc xắc và vẽ histogram tổng điểm.',
    commonTrap: 'Nghĩ rằng CLT áp dụng cho dữ liệu thô ban đầu thay vì áp dụng cho TRUNG BÌNH MẪU.',
  },
  {
    id: 'param-estimation',
    parentId: 'root',
    title: '7. Ước Lượng Tham Số & Khoảng Tin Cậy (CI)',
    category: 'inference',
    description: 'Ước lượng điểm (MLE, OLS) và ước lượng khoảng tin cậy cho kỳ vọng $\\mu$ và tỷ lệ $p$.',
    coreFormulas: ['\\text{CI}_{\\mu} = \\bar{X} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}', '\\text{CI}_{p} = \\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}'],
    keyConcept: 'Độ tin cậy $1 - \\alpha$ biểu thị tỷ lệ các khoảng xây dựng từ vô số mẫu chứa giá trị thực.',
    exampleProblemSnippet: 'Ước lượng tỷ lệ cử tri ủng hộ ứng viên A trong cuộc bầu cử với độ tin cậy 95%.',
    commonTrap: 'Phát biểu rằng "xác suất tham số thực rơi vào khoảng cụ thể là 95%". Tham số là hằng số cố định!',
  },
  {
    id: 'hypothesis-testing',
    parentId: 'root',
    title: '8. Kiểm Định Giả Thuyết Thống Kê',
    category: 'inference',
    description: 'Kiểm định giả thuyết $H_0$ vs $H_1$, mức ý nghĩa $\\alpha$, giá trị p-value, sai lầm loại I và loại II.',
    coreFormulas: ['Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}', 't = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}}', '\\text{Reject } H_0 \\iff p\\text{-value} < \\alpha'],
    keyConcept: 'Bác bỏ $H_0$ khi quan sát thấy bằng chứng mẫu quá bất thường nếu giả thiết $H_0$ là đúng.',
    exampleProblemSnippet: 'Kiểm định xem loại thuốc mới có hiệu quả hạ huyết áp tốt hơn thuốc chuẩn hay không.',
    commonTrap: 'Hiểu nhầm "không bác bỏ $H_0$" là "$H_0$ chắc chắn đúng". Ta chỉ không đủ chứng cứ bác bỏ!',
  },
];

export const SAMPLE_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Quy tắc Xác suất Cơ bản',
    question: 'Cho hai biến cố $A$ và $B$ có $P(A) = 0.4$, $P(B) = 0.5$ và $A, B$ là hai biến cố độc lập. Xác suất $P(A \\cup B)$ bằng bao nhiêu?',
    options: [
      { id: 'A', text: '0.90' },
      { id: 'B', text: '0.70' },
      { id: 'C', text: '0.20' },
      { id: 'D', text: '0.60' },
    ],
    correctAnswer: 'B',
    explanation: {
      whyCorrect: 'Theo công thức cộng xác suất: $P(A \\cup B) = P(A) + P(B) - P(AB)$. Vì $A$ và $B$ độc lập nên $P(AB) = P(A) \\cdot P(B) = 0.4 \\times 0.5 = 0.20$. Do đó $P(A \\cup B) = 0.4 + 0.5 - 0.20 = 0.70$.',
      whyWrong: {
        A: 'Sai lầm vì cộng thẳng $0.4 + 0.5 = 0.9$ mà quên trừ phần giao $P(AB)$. Công thức cộng thẳng chỉ đúng khi $A$ và $B$ xung khắc ($AB = \\emptyset$).',
        C: '0.20 chỉ là phần giao $P(AB)$, không phải xác suất của hợp $P(A \\cup B)$.',
        D: 'Tính nhầm phép trừ hoặc công thức nhân.',
      },
      commonPitfall: 'Đánh đồng biến cố "độc lập" với "xung khắc". Nếu hai biến cố có xác suất dương độc lập với nhau, chúng KHÔNG THỂ xung khắc!',
      formulaUsed: 'P(A \\cup B) = P(A) + P(B) - P(A)P(B)',
    },
  },
  {
    id: 'q2',
    topic: 'Phân phối Nhị thức & Đặc trưng số',
    question: 'Một biến ngẫu nhiên $X \\sim B(100, 0.2)$. Phương sai $\\text{Var}(X)$ của biến ngẫu nhiên này là bao nhiêu?',
    options: [
      { id: 'A', text: '20' },
      { id: 'B', text: '16' },
      { id: 'C', text: '4' },
      { id: 'D', text: '80' },
    ],
    correctAnswer: 'B',
    explanation: {
      whyCorrect: 'Đối với biến ngẫu nhiên nhị thức $X \\sim B(n, p)$, phương sai được tính bằng $\\text{Var}(X) = n \\cdot p \\cdot (1 - p) = 100 \\times 0.2 \\times 0.8 = 16$.',
      whyWrong: {
        A: '20 là Kỳ vọng $E[X] = np = 100 \\times 0.2 = 20$, không phải phương sai.',
        C: '4 là Độ lệch chuẩn $\\sigma = \\sqrt{\\text{Var}(X)} = \\sqrt{16} = 4$.',
        D: '80 là $n(1-p)$, thiếu nhân với xác suất $p$.',
      },
      commonPitfall: 'Nhầm lẫn giữa Kỳ vọng $E[X]$, Phương sai $\\text{Var}(X)$ và Độ lệch chuẩn $\\sigma = \\sqrt{\\text{Var}(X)}$.',
      formulaUsed: '\\text{Var}(X) = np(1-p)',
    },
  },
  {
    id: 'q3',
    topic: 'Kiểm định Giả thuyết Thống kê',
    question: 'Trong kiểm định giả thuyết thống kê, nếu giá trị $p\\text{-value} = 0.023$ và mức ý nghĩa kiểm định được chọn trước là $\\alpha = 0.05$, ta kết luận gì?',
    options: [
      { id: 'A', text: 'Bác bỏ giả thuyết không $H_0$' },
      { id: 'B', text: 'Chấp nhận giả thuyết không $H_0$' },
      { id: 'C', text: 'Bác bỏ giả thuyết đối $H_1$' },
      { id: 'D', text: 'Chưa đủ dữ liệu để đưa ra kết luận' },
    ],
    correctAnswer: 'A',
    explanation: {
      whyCorrect: 'Quy tắc vàng của kiểm định thống kê: "Nếu $p\\text{-value} \\le \\alpha$, ta bác bỏ $H_0$". Ở đây $0.023 < 0.05$, tức là xác suất xảy ra dữ liệu mẫu cực đoan như vậy khi $H_0$ đúng là rất nhỏ, do đó ta có đủ bằng chứng thống kê để bác bỏ $H_0$.',
      whyWrong: {
        B: 'Ngược lại với quy tắc. Khi $p < \\alpha$, ta bác bỏ $H_0$, chứ không chấp nhận.',
        C: 'Bác bỏ $H_0$ đồng nghĩa với việc ủng hộ giả thuyết đối $H_1$.',
        D: 'Khi đã tính được p-value và so sánh với mức ý nghĩa $\\alpha$, quyết định bác bỏ là hoàn toàn xác định.',
      },
      commonPitfall: 'Khẩu quyết ghi nhớ: "If p is low, the null must go" (Nếu p-value thấp hơn $\\alpha$, $H_0$ phải bị loại bỏ).',
      formulaUsed: 'p\\text{-value} < \\alpha \\implies \\text{Reject } H_0',
    },
  },
];

export const INITIAL_ERROR_RECORDS: ErrorRecord[] = [
  {
    id: 'err-1',
    source: 'quiz',
    sourceTitle: 'Trắc nghiệm: Phân biệt Biến cố Độc lập và Xung khắc',
    topic: 'Quy tắc Xác suất',
    errorName: 'Nhầm lẫn Độc lập và Xung khắc',
    description: 'Áp dụng công thức cộng $P(A \\cup B) = P(A) + P(B)$ cho hai biến cố độc lập thay vì phải trừ phần giao $P(AB)$.',
    studentAnswer: 'Chọn 0.90 ($0.4 + 0.5$)',
    correctLogic: '$P(A \\cup B) = P(A) + P(B) - P(A)P(B) = 0.70$. Độc lập không có nghĩa là giao bằng rỗng!',
    timestamp: 'Hôm qua lúc 15:30',
  },
  {
    id: 'err-2',
    source: 'viva',
    sourceTitle: 'Vấn đáp: Định lý Giới hạn Trung tâm (CLT)',
    topic: 'Thống kê Suy diễn',
    errorName: 'Nhầm lẫn đối tượng tuân theo phân phối chuẩn trong CLT',
    description: 'Sinh viên phát biểu rằng "khi $n \\ge 30$, các quan sát dữ liệu thô $X_i$ sẽ chuyển thành phân phối chuẩn".',
    studentAnswer: 'Mẫu dữ liệu tự động biến thành hình chuông chuẩn khi thu thập đủ 30 mẫu.',
    correctLogic: 'Chỉ có TRUNG BÌNH MẪU $\\bar{X}$ (hoặc tổng mẫu $\\sum X_i$) mới tiệm cận phân phối Chuẩn, dữ liệu gốc vẫn giữ nguyên phân phối ban đầu!',
    timestamp: '2 ngày trước lúc 10:15',
  },
  {
    id: 'err-3',
    source: 'essay',
    sourceTitle: 'Tự luận Canvas: Bài toán Xét nghiệm Y khoa Bayes',
    topic: 'Công thức Bayes',
    errorName: 'Bỏ quên tỷ lệ người lành khi tính xác suất toàn phần',
    description: 'Khi tính mẫu số $P(+)$, chỉ lấy $P(+) = 0.01 \\times 0.95$ mà quên cộng thêm lượng dương tính giả $0.99 \\times 0.05$.',
    studentAnswer: 'P(+) = 0.0095 và ra kết quả 100%',
    correctLogic: 'Phải dùng công thức xác suất đầy đủ: $P(+) = P(B)P(+|B) + P(\\bar{B})P(+|\\bar{B}) = 0.059$.',
    timestamp: '3 ngày trước lúc 20:45',
  },
];

export const SAMPLE_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Nguyễn Minh Quân (K64-Toán Tin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    title: 'Tại sao khi kiểm định t-test mẫu nhỏ lại dùng bậc tự do là n - 1 chứ không phải n?',
    content: 'Chào thầy cô và các bạn, mình đang học phần kiểm định giả thuyết cho kỳ vọng khi chưa biết phương sai tổng thể. Thầy giáo giảng bậc tự do là $df = n - 1$. Bản chất hình học hoặc trực giác xác suất của việc "mất đi 1 bậc tự do" là gì ạ?',
    latex: 't = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}} \\sim t(n-1)',
    tags: ['Kiểm định giả thuyết', 't-Student', 'Bậc tự do'],
    upvotes: 18,
    hasAIAnswer: true,
    aiHint: '💡 Gợi ý tư duy từ AI Tutor: Khi bạn tính độ lệch chuẩn mẫu $s$, bạn bắt buộc phải dùng giá trị trung bình mẫu $\\bar{X}$. Vì tổng các độ lệch $\\sum (X_i - \\bar{X}) = 0$ luôn bằng 0, nên nếu bạn biết trước $n-1$ sai lệch thì giá trị sai lệch cuối cùng hoàn toàn bị cố định. Bạn chỉ thực sự tự do chọn $n-1$ giá trị!',
    createdAt: '3 giờ trước',
    replies: [
      {
        id: 'rep-1',
        author: 'Trần Hoàng Long',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        content: 'Ví dụ bạn có 5 chiếc mũ cho 5 ngày. Bạn tự do chọn mũ cho 4 ngày đầu, còn ngày thứ 5 chiếc mũ cuối cùng đã bị cố định!',
        createdAt: '2 giờ trước',
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Lê Thuỳ Trang (Khoa Kinh tế Quốc tế)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    title: 'Phân biệt ý nghĩa thực tế giữa Sai lầm loại I ($\\alpha$) và Sai lầm loại II ($\\beta$)?',
    content: 'Có ai có cách nhớ mẹo trong kiểm định y tế hoặc toà án không? Lúc làm bài thi mình rất hay bị lúng túng giữa Bác bỏ nhầm $H_0$ đúng và Chấp nhận nhầm $H_0$ sai.',
    latex: '\\alpha = P(\\text{Bác bỏ } H_0 | H_0 \\text{ đúng}), \\quad \\beta = P(\\text{Chưa bác bỏ } H_0 | H_0 \\text{ sai})',
    tags: ['Sai lầm Alpha Beta', 'Kiểm định'],
    upvotes: 24,
    hasAIAnswer: true,
    aiHint: '💡 Mẹo từ AI Tutor: Hãy nhớ bài toán Toà án hình sự với $H_0$: "Bị cáo vô tội". Sai lầm loại I ($\\alpha$) = Tuyên án oan người vô tội (Rất nghiêm trọng). Sai lầm loại II ($\\beta$) = Bỏ lọt tội phạm nguy hiểm (Không đủ chứng cứ kết án).',
    createdAt: 'Hôm qua',
    replies: [],
  },
];

export const INITIAL_USER_PROFILE: UserLearningProfile = {
  name: 'Đặng Quốc Anh',
  studentId: 'BUH-2026-XSTK',
  streakDays: 7,
  overallMastery: 78,
  totalSolved: 42,
  totalQuizzes: 68,
  totalVivas: 5,
  errorRecoveryRate: 85,
  domainMastery: [
    { domain: 'Biến cố & Xác suất cơ bản', score: 92, status: 'Thành thạo' },
    { domain: 'Công thức Bayes & Đầy đủ', score: 70, status: 'Khá' },
    { domain: 'Biến ngẫu nhiên & Phân phối', score: 85, status: 'Vững vàng' },
    { domain: 'Đặc trưng số (Kỳ vọng, Phương sai)', score: 80, status: 'Vững vàng' },
    { domain: 'Ước lượng khoảng tin cậy', score: 65, status: 'Cần cải thiện' },
    { domain: 'Kiểm định giả thuyết (Z/t-test)', score: 60, status: 'Cần cải thiện' },
  ],
  aiDiagnosis:
    'Học sinh có tư duy giải toán đại số xác suất rất tốt, tính toán nhanh và nắm chắc lý thuyết phân phối rời rạc. Tuy nhiên, đang có khoảng cách nhận thức ở phần Thống kê suy diễn: hay nhầm lẫn cách chọn bảng phân vị (Student-t vs Chuẩn tắc Z) khi cỡ mẫu $n < 30$ và còn lúng túng khi phát biểu ý nghĩa thực tế của p-value.',
  personalizedRoadmap: [
    {
      stage: 'Chặng 1 (Hoàn thành)',
      title: 'Củng cố nền tảng Xác suất cổ điển & Lược đồ Bernoulli',
      description: 'Luyện 20 bài tập tổ hợp xác suất và lược đồ nhị thức $B(n, p)$.',
      tasks: ['Xác suất xúc xắc & lá bài', 'Nhị thức & Poisson xấp xỉ'],
      status: 'completed',
    },
    {
      stage: 'Chặng 2 (Đang thực hiện)',
      title: 'Đột phá Định lý Bayes qua Bảng vẽ Canvas & Cây xác suất',
      description: 'Thực hành dựng sơ đồ cây Bayes cho 5 bài toán y khoa và chẩn đoán kỹ thuật.',
      tasks: ['Bài tập y khoa 2 lần xét nghiệm liên tiếp', 'Cập nhật niềm tin hậu nghiệm trong Machine Learning'],
      status: 'in_progress',
    },
    {
      stage: 'Chặng 3 (Kế tiếp)',
      title: 'Khắc phục lỗ hổng Kiểm định Giả thuyết & Tra bảng phân vị',
      description: 'Chuyên đề so sánh trực quan Z-test và t-test với các điều kiện mẫu.',
      tasks: ['Bài tập chọn thống kê kiểm định z vs t', 'Phiên vấn đáp AI về ý nghĩa p-value & mức ý nghĩa $\\alpha$'],
      status: 'upcoming',
    },
  ],
};
