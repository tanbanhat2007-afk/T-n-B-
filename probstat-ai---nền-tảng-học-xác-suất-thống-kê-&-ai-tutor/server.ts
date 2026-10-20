import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON parser with large limit for canvas image base64
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for Gemini calls with robust error handling and fallback
async function callGemini(params: {
  contents: any;
  systemInstruction?: string;
  responseSchema?: any;
  responseMimeType?: string;
}) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: params.contents,
    config: {
      systemInstruction: params.systemInstruction,
      responseSchema: params.responseSchema,
      responseMimeType: params.responseMimeType,
    },
  });

  return response.text || '';
}

// ---------------- API ENDPOINTS ----------------

/**
 * 1. AI TUTOR CHẤM ĐIỂM TỰ ĐỘNG (Ảnh, PDF, Bảng vẽ Canvas)
 * AI đọc hiểu qua OCR/Vision, cập nhật Barem điểm chi tiết và chấm điểm tự động.
 * QUAN TRỌNG: AI Tutor CHỈ cung cấp "chiến lược giải" (gợi ý từng bước tư duy),
 * KHÔNG cung cấp trực tiếp lời giải hoàn chỉnh để kích thích suy nghĩ của học sinh.
 */
app.post('/api/ai/grade-submission', async (req: Request, res: Response) => {
  try {
    const { problemTitle, problemPrompt, studentText, imageBase64 } = req.body;

    const parts: any[] = [];
    if (imageBase64) {
      // Extract base64 without prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: cleanBase64,
        },
      });
    }

    const promptText = `
Bạn là AI Tutor Chuyên gia Xác suất Thống kê (XSTK).
Hãy đọc bài làm của học sinh (từ hình vẽ bảng vẽ Canvas/hình ảnh nộp bài hoặc văn bản) cho bài toán sau:

[ĐỀ BÀI TOÁN XSTK]:
Tiêu đề: ${problemTitle || 'Bài toán Xác suất Thống kê'}
Nội dung: ${problemPrompt || 'Đọc từ hình bài làm'}

[BÀI LÀM CỦA HỌC SINH]:
${studentText ? `Văn bản ghi chú: ${studentText}` : 'Xem chi tiết trong hình ảnh đính kèm (nét chữ viết tay/hình vẽ trên Canvas).'}

QUY TẮC SƯ PHẠM QUAN TRỌNG NHẤT:
1. Đọc và nhận diện chính xác từng bước học sinh đã làm (OCR / Vision).
2. Xây dựng Barem 4 tiêu chuẩn chấm điểm:
   - Tiêu chí 1: Đặt biến cố, ký hiệu và giả thiết toán học (tối đa 2.5đ)
   - Tiêu chí 2: Lựa chọn và thiết lập công thức xác suất / thống kê phù hợp (tối đa 3.0đ)
   - Tiêu chí 3: Thay số và các bước biến đổi trung gian (tối đa 3.0đ)
   - Tiêu chí 4: Kết luận, đơn vị và ý nghĩa thực tiễn (tối đa 1.5đ)
3. ĐIỀU KIỆN TIÊN QUYẾT: Bạn CHỈ cung cấp "chiến lược giải" (gợi ý từng bước tư duy, hướng dẫn tự kiểm tra và câu hỏi định hướng), TUYỆT ĐỐI KHÔNG cung cấp trực tiếp đáp số hoàn chỉnh hay lời giải sẵn để học sinh tự mình tư duy và sửa lại!
4. Chỉ ra cụ thể nhận thức sai lầm (misconception) nếu có.
`;
    parts.push({ text: promptText });

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalScore: { type: Type.NUMBER, description: 'Điểm tổng trên thang 10' },
              maxScore: { type: Type.NUMBER, description: 'Điểm tối đa là 10' },
              barem: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    criterion: { type: Type.STRING },
                    maxScore: { type: Type.NUMBER },
                    awardedScore: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                  },
                  required: ['id', 'criterion', 'maxScore', 'awardedScore', 'feedback'],
                },
              },
              thinkingStrategy: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Gợi ý từng bước tư duy (KHÔNG đưa lời giải hoàn chỉnh)',
              },
              detectedMisconceptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Các nhận thức sai sót hoặc bẫy tư duy học sinh đã mắc phải',
              },
              remedialTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Mẹo khắc phục cụ thể cho dạng toán này',
              },
              encouragement: {
                type: Type.STRING,
                description: 'Lời khuyên khích lệ mang tính sư phạm',
              },
            },
            required: [
              'totalScore',
              'maxScore',
              'barem',
              'thinkingStrategy',
              'detectedMisconceptions',
              'remedialTips',
              'encouragement',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Pedagogical Fallback when API key is not present
      return res.json({
        totalScore: 7.5,
        maxScore: 10,
        barem: [
          {
            id: 'b1',
            criterion: 'Đặt biến cố & Ký hiệu toán học',
            maxScore: 2.5,
            awardedScore: 2.5,
            feedback: 'Ký hiệu biến cố A, B rõ ràng, xác định đúng không gian mẫu.',
          },
          {
            id: 'b2',
            criterion: 'Thiết lập công thức Xác suất/Thống kê',
            maxScore: 3.0,
            awardedScore: 2.5,
            feedback: 'Áp dụng đúng dạng công thức nhưng cần chú ý điều kiện độc lập của các biến cố.',
          },
          {
            id: 'b3',
            criterion: 'Thay số và biến đổi đại số',
            maxScore: 3.0,
            awardedScore: 1.5,
            feedback: 'Có sai sót khi tính xác suất của biến cố đối, chưa làm tròn đúng chuẩn 4 chữ số thập phân.',
          },
          {
            id: 'b4',
            criterion: 'Kết luận và giải thích ý nghĩa',
            maxScore: 1.5,
            awardedScore: 1.0,
            feedback: 'Kết luận cần nêu rõ đơn vị xác suất và ngữ cảnh thực tế của đề bài.',
          },
        ],
        thinkingStrategy: [
          'Bước 1: Kiểm tra lại xem hai biến cố đang xét có xung khắc hay độc lập.',
          'Bước 2: Sử dụng công thức xác suất toàn phần: Phân tích xem không gian mẫu đã được chia thành một hệ đầy đủ các trường hợp rời nhau chưa?',
          'Bước 3: Tự đặt câu hỏi: "Nếu biến cố đối xảy ra thì xác suất tương ứng là bao nhiêu?" để tự kiểm tra tính nhất quán (tổng các xác suất phải bằng 1).',
        ],
        detectedMisconceptions: [
          'Nhầm lẫn giữa công thức cộng hai biến cố độc lập và công thức cộng hai biến cố xung khắc.',
        ],
        remedialTips: [
          'Hãy vẽ sơ đồ cây (Probability Tree) trên bảng vẽ trước khi bắt tay vào thay số.',
          'Quy ước luôn viết ra công thức tổng quát bằng ký hiệu chữ trước khi thế số liệu.',
        ],
        encouragement: 'Bài làm của bạn thể hiện tư duy rất sáng sủa! Hãy xem các bước chiến lược trên để hoàn thiện nốt phần tính toán nhé.',
      });
    }
  } catch (error: any) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: error.message || 'Lỗi khi chấm điểm bài làm' });
  }
});

/**
 * 2. TƯƠNG TÁC BẰNG GIỌNG NÓI & ĐỒNG BỘ BẢNG VẼ CANVAS
 * Khi học sinh hỏi về các bài toán khó diễn đạt, AI trả lời bằng văn bản/voice
 * đồng thời xuất lệnh vẽ sơ đồ (Bayes Tree, Đường cong Chuẩn Gauss, Bảng phân phối) lên Canvas!
 */
app.post('/api/ai/voice-chat', async (req: Request, res: Response) => {
  try {
    const { question, currentTopic } = req.body;

    const systemInstruction = `
Bạn là AI Voice Tutor thông minh về môn Xác suất Thống kê (XSTK).
Học sinh đang hỏi bằng giọng nói/văn bản. Hãy trả lời ngắn gọn, khúc chiết, truyền cảm bằng tiếng Việt.
ĐẶC BIỆT: Nếu câu hỏi liên quan đến các khái niệm cần trực quan hóa như:
- Định lý Bayes / Xác suất toàn phần -> Đề xuất syncDiagram: 'bayes_tree'
- Phân phối Chuẩn Gauss / Z-score / Quy tắc 68-95-99.7 -> Đề xuất syncDiagram: 'normal_curve'
- Biến ngẫu nhiên rời rạc / Bảng phân phối xác suất -> Đề xuất syncDiagram: 'prob_table'
Nếu không cần vẽ sơ đồ đặc biệt, để syncDiagram là null.
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Câu hỏi của học sinh: "${question}". Chủ đề hiện tại: ${currentTopic || 'Tổng quát'}. Hãy trả lời giọng điệu ấm áp, giải thích bản chất toán học và quyết định xem có cần đồng bộ hình vẽ lên iPad Canvas không.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              spokenAnswer: {
                type: Type.STRING,
                description: 'Câu trả lời mạch lạc, súc tích dành cho phát giọng nói (TTS)',
              },
              detailedExplanation: {
                type: Type.STRING,
                description: 'Giải thích chi tiết kèm công thức LaTeX',
              },
              keyLatex: {
                type: Type.STRING,
                description: 'Công thức toán học trọng tâm nhất',
              },
              syncDiagram: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: 'bayes_tree | normal_curve | prob_table | venn_diagram',
                  },
                  title: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['type', 'title'],
                nullable: true,
              },
            },
            required: ['spokenAnswer', 'detailedExplanation', 'keyLatex'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Dynamic fallback based on keywords
      const isNormal = /chuẩn|gauss|z-score|lệch/i.test(question);
      const isBayes = /bayes|toàn phần|điều kiện|y khoa|xét nghiệm/i.test(question);

      let syncDiagram = null;
      if (isBayes) {
        syncDiagram = {
          type: 'bayes_tree',
          title: 'Sơ đồ Cây Xác suất Bayes & Hệ Đầy đủ',
          details: 'Phân nhánh tiên nghiệm và xác suất điều kiện',
        };
      } else if (isNormal) {
        syncDiagram = {
          type: 'normal_curve',
          title: 'Đường cong Phân phối Chuẩn Gauss N(μ, σ²)',
          details: 'Biểu diễn đối xứng qua kỳ vọng μ và độ rộng ±σ',
        };
      }

      return res.json({
        spokenAnswer: isBayes
          ? 'Chào bạn! Trong định lý Bayes, chìa khóa là ta cập nhật xác suất tiên nghiệm dựa trên bằng chứng mới. Thầy đã tự động vẽ sơ đồ cây Bayes lên bảng Canvas để bạn dễ theo dõi nhé!'
          : isNormal
          ? 'Phân phối chuẩn có hình quả chuông đối xứng hoàn hảo qua điểm trung bình mu. Thầy đã dựng đường cong Gauss và vùng 68% lên bảng vẽ Canvas cho bạn!'
          : 'Chào bạn! Xác suất thống kê là công cụ toán học nghiên cứu quy luật của các hiện tượng ngẫu nhiên và suy diễn từ dữ liệu thực nghiệm.',
        detailedExplanation:
          'Để giải quyết vấn đề này, trước tiên bạn cần xác định rõ không gian mẫu $\\Omega$, các biến cố thành phần và lựa chọn công thức giải tích phù hợp.',
        keyLatex: isBayes
          ? 'P(A_k|B) = \\frac{P(A_k)P(B|A_k)}{\\sum P(A_i)P(B|A_i)}'
          : isNormal
          ? 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}'
          : 'P(A) = \\frac{|A|}{|\\Omega|}',
        syncDiagram,
      });
    }
  } catch (error: any) {
    console.error('Voice chat error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý câu hỏi giọng nói' });
  }
});

/**
 * 3. TẠO BÀI TẬP TỰ LUẬN TƯƠNG TỰ (RANDOM GENERATOR)
 * Tự động sinh ngẫu nhiên 5 bài toán tự luận tương tự có cùng dạng kiến thức.
 * AI CHỈ cung cấp "chiến lược giải" và gợi ý hướng đi, KHÔNG cho lời giải hoàn chỉnh.
 */
app.post('/api/ai/generate-similar', async (req: Request, res: Response) => {
  try {
    const { topic, sampleProblem } = req.body;

    const promptText = `
Bạn là chuyên gia thiết kế đề thi Xác suất Thống kê.
Hãy sinh ra NGẪU NHIÊN ĐÚNG 5 BÀI TOÁN TỰ LUẬN TƯƠNG TỰ có cùng bản chất kiến thức với chủ đề: "${topic || 'Định lý Bayes & Xác suất Đầy đủ'}".
Bài toán mẫu tham chiếu: "${sampleProblem || 'Bài toán xét nghiệm y khoa hoặc phân loại'}"

YÊU CẦU QUAN TRỌNG:
1. 5 bài toán phải thuộc các ngữ cảnh thực tiễn đa dạng (ví dụ: Tài chính ngân hàng, Kiểm soát chất lượng sản xuất công nghiệp, Y tế chẩn đoán, Trí tuệ nhân tạo, Viễn thông mạng).
2. Với MỖI bài toán:
   - problemStatement: Đề bài rõ ràng, số liệu hợp lý.
   - thinkingStrategy: CHỈ cung cấp danh sách 3-4 bước gợi ý chiến lược giải và hướng tư duy. TUYỆT ĐỐI KHÔNG đưa ra đáp số cuối cùng hay lời giải hoàn chỉnh!
   - keyFormulas: Các công thức chìa khóa cần dùng (dạng LaTeX).
   - pitfallsToAvoid: Bẫy tính toán hoặc cạm bẫy khái niệm học sinh dễ vấp phải.
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                context: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                latex: { type: Type.STRING },
                thinkingStrategy: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                keyFormulas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                pitfallsToAvoid: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'id',
                'title',
                'context',
                'difficulty',
                'problemStatement',
                'thinkingStrategy',
                'keyFormulas',
                'pitfallsToAvoid',
              ],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json(parsed);
    } else {
      // High quality fallback 5 problems
      return res.json([
        {
          id: 'sim-1',
          title: 'Kiểm định Sản phẩm Lỗi tại Dây chuyền Lắp ráp Vi mạch',
          context: 'Sản xuất Công nghệ cao',
          difficulty: 'Trung bình',
          problemStatement:
            'Một nhà máy có 3 dây chuyền I, II, III lần lượt sản xuất 40%, 35%, 25% tổng sản lượng chip. Tỷ lệ phế phẩm tương ứng là 2%, 3% và 5%. Lấy ngẫu nhiên 1 con chip từ kho và thấy nó bị hỏng. Hãy tính xác suất con chip này do dây chuyền II sản xuất.',
          latex: 'P(A_2|F) = \\text{?}',
          thinkingStrategy: [
            'Bước 1: Gọi $A_1, A_2, A_3$ là biến cố chip do các dây chuyền sản xuất. Kiểm tra xem chúng có lập thành hệ đầy đủ không?',
            'Bước 2: Gọi $F$ là biến cố chip bị hỏng. Tính xác suất toàn phần $P(F)$ bằng công thức xác suất đầy đủ.',
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
            'Bước 1: Liệt kê tiên nghiệm $P(Attack)$ và xác suất phần bù $P(\\overline{Attack})$.',
            'Bước 2: Xác định rõ tỷ lệ báo động giả xảy ra ở nhóm nào (nhóm lưu lượng an toàn).',
            'Bước 3: Lập bảng phân tích 100,000 giờ để có trực giác số nguyên trước khi áp dụng công thức Bayes.',
          ],
          keyFormulas: [
            'P(Alert) = P(At)P(Al|At) + P(\\overline{At})P(Al|\\overline{At})',
            'P(At|Al) = \\frac{P(At)P(Al|At)}{P(Alert)}',
          ],
          pitfallsToAvoid: [
            'Đừng nghĩ độ nhạy 98% nghĩa là báo động luôn đúng tới 98%!',
          ],
        },
        {
          id: 'sim-3',
          title: 'Duyệt Hồ sơ Tín dụng Rủi ro Ngân hàng',
          context: 'Tài chính - Ngân hàng',
          difficulty: 'Trung bình',
          problemStatement:
            'Tại một ngân hàng thương mại, 80% khách hàng thuộc nhóm trả nợ tốt và 20% thuộc nhóm có nguy cơ nợ xấu. Qua mô hình chấm điểm tín dụng, 90% khách hàng tốt có điểm số cao, trong khi chỉ 15% khách nợ xấu đạt điểm cao. Một khách hàng nộp hồ sơ và đạt điểm cao, xác suất khách này thực sự thuộc nhóm tốt là bao nhiêu?',
          latex: 'P(Good|HighScore) = \\text{?}',
          thinkingStrategy: [
            'Bước 1: Xác định biến cố cơ sở và biến cố bằng chứng.',
            'Bước 2: Tính tổng xác suất nhận điểm cao trên toàn bộ khách hàng.',
            'Bước 3: Áp dụng định lý Bayes để cập nhật độ tin cậy của nhóm khách hàng tốt.',
          ],
          keyFormulas: [
            'P(HighScore) = P(G)P(HS|G) + P(B)P(HS|B)',
            'P(G|HS) = \\frac{P(G)P(HS|G)}{P(HighScore)}',
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
          latex: 'P(A|Error) = \\text{?}',
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
          latex: 'P(Spam|Keyword) = \\text{?}',
          thinkingStrategy: [
            'Bước 1: Thiết lập tiên nghiệm $P(Spam)=0.3, P(Ham)=0.7$.',
            'Bước 2: Tính hàm hợp lý của từ khóa trong cả 2 lớp email.',
            'Bước 3: Áp dụng Naive Bayes đơn biến để tìm xác suất hậu nghiệm.',
          ],
          keyFormulas: [
            'P(K) = P(Spam)P(K|Spam) + P(Ham)P(K|Ham)',
            'P(Spam|K) = \\frac{P(Spam)P(K|Spam)}{P(K)}',
          ],
          pitfallsToAvoid: [
            'Đánh đồng tần suất xuất hiện từ khóa với xác suất của bản thân email.',
          ],
        },
      ]);
    }
  } catch (error: any) {
    console.error('Generate similar error:', error);
    res.status(500).json({ error: error.message || 'Lỗi khi tạo bài tập tương tự' });
  }
});

/**
 * 4. TẠO BÀI TẬP TRẮC NGHIỆM & CHẤM ĐIỂM TỨC THÌ (KÈM NÚT "TẠI SAO?")
 */
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    const promptText = `
Bạn là chuyên gia ra đề thi trắc nghiệm Xác suất Thống kê.
Hãy tạo 3 câu hỏi trắc nghiệm chất lượng cao cho chủ đề: "${topic || 'Phân phối Xác suất & Ước lượng Thống kê'}".
Yêu cầu bắt buộc:
1. Mỗi câu có 4 phương án A, B, C, D và chỉ có 1 đáp án đúng.
2. Cung cấp phần "explanation" cực kỳ chi tiết:
   - whyCorrect: Tại sao đáp án đúng lại đúng (lý giải toán học chặt chẽ).
   - whyWrong: Đối với TỪNG phương án sai (A, B, C, D còn lại), phân tích rõ học sinh tính toán sai ở đâu hoặc mắc bẫy nhận thức nào mà chọn phương án đó.
   - commonPitfall: Bẫy thường gặp.
   - formulaUsed: Công thức toán học LaTeX.
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                question: { type: Type.STRING },
                latex: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      latex: { type: Type.STRING },
                    },
                    required: ['id', 'text'],
                  },
                },
                correctAnswer: { type: Type.STRING },
                explanation: {
                  type: Type.OBJECT,
                  properties: {
                    whyCorrect: { type: Type.STRING },
                    whyWrong: {
                      type: Type.OBJECT,
                      description: 'Giải thích cho từng phương án sai (ví dụ A, B, C)',
                      properties: {
                        A: { type: Type.STRING },
                        B: { type: Type.STRING },
                        C: { type: Type.STRING },
                        D: { type: Type.STRING },
                      },
                    },
                    commonPitfall: { type: Type.STRING },
                    formulaUsed: { type: Type.STRING },
                  },
                  required: ['whyCorrect', 'whyWrong', 'commonPitfall'],
                },
              },
              required: ['id', 'topic', 'question', 'options', 'correctAnswer', 'explanation'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json(parsed);
    } else {
      // Fallback
      return res.json([
        {
          id: 'q-dyn-1',
          topic: topic || 'Định lý Giới hạn Trung tâm',
          question:
            'Theo Định lý Giới hạn Trung tâm (CLT), nếu chọn mẫu ngẫu nhiên kích thước $n \\ge 30$ từ một tổng thể có kỳ vọng $\\mu$ và phương sai $\\sigma^2$, thì phân phối của trung bình mẫu $\\bar{X}$ xấp xỉ điều gì?',
          options: [
            { id: 'A', text: 'Phân phối đều trong khoảng [0, 1]' },
            { id: 'B', text: 'Phân phối Chuẩn N(μ, σ²/n)' },
            { id: 'C', text: 'Phân phối Chuẩn N(nμ, nσ²)' },
            { id: 'D', text: 'Phân phối Poisson với tham số λ = μ' },
          ],
          correctAnswer: 'B',
          explanation: {
            whyCorrect:
              'Định lý Giới hạn Trung tâm khẳng định rằng trung bình mẫu $\\bar{X}$ sẽ có kỳ vọng $E[\\bar{X}] = \\mu$ và phương sai $\\text{Var}(\\bar{X}) = \\sigma^2/n$, do đó xấp xỉ phân phối chuẩn $\\mathcal{N}(\\mu, \\sigma^2/n)$.',
            whyWrong: {
              A: 'Sai hoàn toàn vì phân phối của trung bình không phải phân phối đều.',
              C: 'Đây là phân phối của TỔNG mẫu $S_n = \\sum X_i$, không phải của trung bình mẫu $\\bar{X}$.',
              D: 'Poisson chỉ áp dụng cho biến ngẫu nhiên đếm số lần xuất hiện sự kiện hiếm, không phải trung bình mẫu liên tục.',
            },
            commonPitfall:
              'Nhầm lẫn giữa phương sai của một phần tử đơn lẻ $\\sigma^2$, phương sai của tổng $n\\sigma^2$, và phương sai của trung bình mẫu $\\sigma^2/n$.',
            formulaUsed: '\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)',
          },
        },
      ]);
    }
  } catch (error: any) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: error.message || 'Lỗi khi tạo câu hỏi trắc nghiệm' });
  }
});

/**
 * 5. TÍNH NĂNG VẤN ĐÁP LÝ THUYẾT & PHÁT HIỆN LỖ HỔNG KIẾN THỨC (VIVA EXAM)
 * AI đóng vai Giám khảo vấn đáp, hỏi - đáp trực tiếp, chỉ ra lỗ hổng và misconception.
 */
app.post('/api/ai/viva-turn', async (req: Request, res: Response) => {
  try {
    const { history, studentAnswer, topic, isEnding } = req.body;

    const promptText = `
Bạn là Giáo sư - Giám khảo Vấn đáp môn Xác suất Thống kê (XSTK).
Chủ đề vấn đáp: "${topic || 'Định lý Bayes, Phân phối Xác suất & Kiểm định Thống kê'}"
Lịch sử phiên vấn đáp đến nay:
${JSON.stringify(history || [])}

Câu trả lời mới nhất của sinh viên: "${studentAnswer || '(Sinh viên bắt đầu phiên vấn đáp)'}"
Trạng thái: ${isEnding ? 'KẾT THÚC VÀ XUẤT BÁO CÁO ĐÁNH GIÁ TỔNG HỢP' : 'TIẾP TỤC ĐẶT CÂU HỎI VẤN ĐÁP TIẾP THEO'}

YÊU CẦU:
- Nếu tiếp tục: Đóng vai giám khảo hỏi sâu vào bản chất toán học, kiểm tra xem sinh viên chỉ học vẹt công thức hay thực sự hiểu trực giác. Đặt 1 câu hỏi phản biện sâu sắc.
- Nếu kết thúc: Đưa ra báo cáo VivaReport gồm: Điểm vấn đáp thang 10, Danh sách các lỗ hổng kiến thức phát hiện được (knowledgeGaps), Các nhận thức sai lầm (misconceptions), Những điểm sáng nắm vững (masteryHighlights), và Lời khuyên cụ thể (recommendation).
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              examinerFeedback: {
                type: Type.STRING,
                description: 'Nhận xét ngắn về câu trả lời vừa rồi',
              },
              nextQuestion: {
                type: Type.STRING,
                description: 'Câu hỏi vấn đáp tiếp theo (hoặc câu kết luận nếu phiên kết thúc)',
              },
              latexFormula: {
                type: Type.STRING,
                description: 'Công thức toán học thảo luận nếu có',
              },
              isFinished: { type: Type.BOOLEAN },
              vivaReport: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  knowledgeGaps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  misconceptions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  masteryHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recommendation: { type: Type.STRING },
                },
                required: ['score', 'knowledgeGaps', 'misconceptions', 'masteryHighlights', 'recommendation'],
                nullable: true,
              },
            },
            required: ['examinerFeedback', 'nextQuestion', 'isFinished'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      if (isEnding) {
        return res.json({
          examinerFeedback: 'Cảm ơn em đã hoàn thành phiên vấn đáp trực tiếp hôm nay.',
          nextQuestion: 'Phiên vấn đáp kết thúc. Thầy đã lập báo cáo phân tích lỗ hổng kiến thức cho em.',
          isFinished: true,
          vivaReport: {
            score: 8.0,
            knowledgeGaps: [
              'Chưa phân biệt rõ phạm vi áp dụng giữa kiểm định Z-test (khi biết phương sai tổng thể) và t-test (khi dùng độ lệch mẫu s).',
              'Còn ngập ngừng khi phát biểu định nghĩa trực quan của mức ý nghĩa alpha.',
            ],
            misconceptions: [
              'Có xu hướng cho rằng "chấp nhận H0 nghĩa là H0 chắc chắn 100% đúng", trong khi thực tế chỉ là "chưa có đủ bằng chứng bác bỏ H0".',
            ],
            masteryHighlights: [
              'Nắm rất vững công thức xác suất toàn phần và lược đồ Bernoulli.',
              'Trình bày tự tin, tư duy logic mạch lạc.',
            ],
            recommendation:
              'Em nên ôn tập lại chương Kiểm định giả thuyết, đặc biệt là bảng so sánh điều kiện mẫu lớn/nhỏ và thực hành thêm 5 bài tập về p-value.',
          },
        });
      } else {
        return res.json({
          examinerFeedback:
            'Thầy ghi nhận em đã hiểu được ý niệm cơ bản của biến cố độc lập.',
          nextQuestion:
            'Bây giờ, em hãy cho thầy biết: Nếu hai biến cố A và B có xác suất dương P(A) > 0 và P(B) > 0, liệu chúng có thể VỪA ĐỘC LẬP VỪA XUNG KHẮC cùng một lúc được không? Tại sao?',
          latexFormula: 'P(AB) = P(A)P(B) \\quad \\text{vs} \\quad AB = \\emptyset',
          isFinished: false,
          vivaReport: null,
        });
      }
    }
  } catch (error: any) {
    console.error('Viva turn error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý phiên vấn đáp' });
  }
});

/**
 * 6. BÁO CÁO THỐNG KÊ LỖI SAI TỔNG HỢP (ERROR ANALYTICS)
 * Gom nhóm và thống kê tất cả câu hỏi sai từ 3 nguồn: Vấn đáp, Trắc nghiệm, Tự luận.
 * AI phân tích đưa ra "Nhận định chung về nguyên nhân lỗi sai" và "Hướng khắc phục cụ thể".
 */
app.post('/api/ai/diagnose-errors', async (req: Request, res: Response) => {
  try {
    const { errorRecords } = req.body;

    const promptText = `
Bạn là AI Giám định Học thuật môn Xác suất Thống kê.
Dưới đây là danh sách tổng hợp các lỗi sai của một sinh viên từ 3 nguồn:
- Vấn đáp lý thuyết (Viva)
- Trắc nghiệm kiểm tra (Quiz)
- Tự luận viết vẽ Canvas (Essay)

Dữ liệu lỗi sai:
${JSON.stringify(errorRecords || [])}

Hãy phân tích toàn diện và đưa ra:
1. overallAssessment: Nhận định chung về nguyên nhân gốc rễ dẫn đến các lỗi sai này (ví dụ: hổng kiến thức nền tảng, nhầm lẫn khái niệm tương đồng, hay bất cẩn tính toán).
2. groupedCategories: Gom nhóm các lỗi thành 3-4 cụm chủ đề lớn kèm số lượng lỗi và phân tích chi tiết.
3. concreteRemedies: Hướng khắc phục cụ thể từng bước (bài đọc, dạng bài tập cần làm lại, quy tắc ghi nhớ thần chú).
4. recommendedExercises: Danh sách 3 bài tập rèn luyện đúng điểm yếu.
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallAssessment: { type: Type.STRING },
              groupedCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    categoryName: { type: Type.STRING },
                    count: { type: Type.NUMBER },
                    rootCause: { type: Type.STRING },
                    actionableFix: { type: Type.STRING },
                  },
                  required: ['categoryName', 'count', 'rootCause', 'actionableFix'],
                },
              },
              concreteRemedies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedExercises: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'overallAssessment',
              'groupedCategories',
              'concreteRemedies',
              'recommendedExercises',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      return res.json({
        overallAssessment:
          'Phân tích cho thấy nguyên nhân lỗi sai chủ yếu xuất phát từ việc "đồng nhất các khái niệm có vẻ tương đồng" (ví dụ: nhầm lẫn độc lập với xung khắc, nhầm lẫn phân phối của dữ liệu gốc với phân phối của trung bình mẫu CLT). Sinh viên có kỹ năng biến đổi đại số tốt nhưng cần củng cố lại bản chất định nghĩa xác suất.',
        groupedCategories: [
          {
            categoryName: 'Nhóm Lỗi Khái niệm Biến cố & Xác suất Tiên nghiệm',
            count: 2,
            rootCause:
              'Áp dụng công thức cộng $P(A \\cup B) = P(A) + P(B)$ một cách máy móc mà bỏ quên điều kiện tiên quyết là hai biến cố phải xung khắc.',
            actionableFix:
              'Luôn vẽ biểu đồ Venn hoặc sơ đồ cây. Nếu hai biến cố độc lập có xác suất dương, chúng luôn có phần giao $P(AB) = P(A)P(B) > 0$.',
          },
          {
            categoryName: 'Nhóm Lỗi Thống kê Suy diễn & Định lý Giới hạn (CLT)',
            count: 1,
            rootCause:
              'Cho rằng cỡ mẫu lớn sẽ làm biến đổi hình dạng của phân phối dữ liệu gốc, thay vì hiểu đúng là áp dụng cho phân phối của Trung bình mẫu $\\bar{X}$.',
            actionableFix:
              'Ghi nhớ: Dữ liệu dân số gốc giữ nguyên hình dáng của nó; chỉ có đại lượng thống kê mẫu $\\bar{X}$ mới biến thành hình chuông chuẩn khi gom nhiều mẫu lại.',
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
    }
  } catch (error: any) {
    console.error('Diagnose errors error:', error);
    res.status(500).json({ error: error.message || 'Lỗi chẩn đoán lỗi sai' });
  }
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProbStat AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
