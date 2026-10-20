import React, { useState } from 'react';
import {
  Layers,
  Database,
  Network,
  Cpu,
  BookOpen,
  X,
  Code2,
  CheckCircle,
  FileText,
  Server,
  Tablet,
  Mic,
  BrainCircuit,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'apis' | 'pedagogy'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Layers className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Kiến Trúc Hệ Thống & Cấu Trúc Cơ Sở Dữ Liệu
              </h2>
              <p className="text-xs text-indigo-100">
                Tài liệu kỹ thuật chi tiết: Full-stack, Database Schema, AI Endpoints & Sư phạm XSTK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          {[
            { id: 'architecture', label: '1. Sơ đồ Kiến trúc', icon: Network },
            { id: 'database', label: '2. Database Schema (PostgreSQL)', icon: Database },
            { id: 'apis', label: '3. API Endpoints Catalog', icon: Cpu },
            { id: 'pedagogy', label: '4. Mô hình Sư phạm 4 Bước', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-px ${
                  isActive
                    ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-indigo-600 border-transparent hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6 text-slate-700 text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-800 mb-3 flex items-center gap-2">
                  <Network className="w-5 h-5 text-indigo-600" />
                  Sơ đồ Phân tầng Kiến trúc (System Architecture)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Hệ thống thiết kế theo kiến trúc <strong>Client - Server - Multi-Agent AI</strong>, phân tách rõ ràng giữa giao diện tương tác thời gian thực trên iPad/Tablet và tầng xử lý AI chuyên biệt về Xác suất Thống kê.
                </p>

                {/* Architecture Layers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100">
                    <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2 text-xs">
                      <Tablet className="w-4 h-4 text-indigo-600" />
                      1. Presentation Layer
                    </div>
                    <ul className="text-xs text-indigo-800 space-y-1.5 list-disc list-inside">
                      <li>React 19 + TypeScript SPA</li>
                      <li>Tailwind CSS v4 (Light EdTech)</li>
                      <li>HTML5 Canvas Workspace (Touch & Stylus)</li>
                      <li>KaTeX Math Rendering Engine</li>
                      <li>Web Speech Recognition & Synthesis</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-violet-50/80 border border-violet-100">
                    <div className="flex items-center gap-2 font-bold text-violet-900 mb-2 text-xs">
                      <Server className="w-4 h-4 text-violet-600" />
                      2. Application Server
                    </div>
                    <ul className="text-xs text-violet-800 space-y-1.5 list-disc list-inside">
                      <li>Node.js + Express REST API</li>
                      <li>Vite Middleware Integration</li>
                      <li>Vision Payload Buffer (25MB)</li>
                      <li>Barem Scoring Evaluator</li>
                      <li>Error Log Grouping Engine</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100">
                    <div className="flex items-center gap-2 font-bold text-blue-900 mb-2 text-xs">
                      <BrainCircuit className="w-4 h-4 text-blue-600" />
                      3. AI Intelligence Layer
                    </div>
                    <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
                      <li>Google GenAI SDK (@google/genai)</li>
                      <li>Gemini 3.8 Flash (Multimodal OCR)</li>
                      <li>Structured JSON Schema Output</li>
                      <li>Pedagogical Scaffolding Guardrails</li>
                      <li>Voice-to-Diagram Canvas Syncer</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 mb-2 text-xs">
                      <Database className="w-4 h-4 text-emerald-600" />
                      4. Data & State Layer
                    </div>
                    <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                      <li>PostgreSQL / Cloud SQL Relational DB</li>
                      <li>User Learning Profiles & Streaks</li>
                      <li>Error Logs (Viva, Quiz, Essay)</li>
                      <li>Mindmap Knowledge Graph</li>
                      <li>Forum Discussions & Upvotes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Flow */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">Luồng Tương tác AI Tutor Chấm Điểm & Chiến Lược Giải:</h4>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                  {`[Học sinh viết/vẽ trên iPad Canvas / Upload Ảnh Bài Làm]
          │
          ▼  (Export Base64 Canvas PNG + Problem Context)
[POST /api/ai/grade-submission]
          │
          ▼  (Proxy qua Express Server với telemetry 'aistudio-build')
[Gemini 3.8 Flash Vision Model]
          ├──> 1. OCR giải mã nét chữ & công thức toán học
          ├──> 2. Đánh giá theo Barem 4 tiêu chí chuẩn hóa (Thang điểm 10)
          ├──> 3. Phát hiện lỗi nhận thức (Misconceptions)
          └──> 4. [QUY TẮC BẢO VỆ]: CHỈ sinh ra "Chiến lược tư duy từng bước",
                                  TUYỆT ĐỐI KHÔNG cấp đáp số hoàn chỉnh
          │
          ▼  (Structured JSON Response)
[Hiển thị Barem, Radar Nhận xét & Bút sửa lỗi ngay trên Workspace]`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4 text-slate-700 text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Cấu trúc Cơ sở Dữ liệu Quan hệ (Relational Database Schema)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Thiết kế chuẩn hóa DDL cho PostgreSQL nhằm tối ưu lưu trữ tiến trình học tập, lịch sử vấn đáp và truy vết lỗi sai 3 nguồn.
                </p>

                <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
                  <pre>{`-- 1. Bảng Người dùng & Học sinh
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    student_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hồ sơ Học tập AI Cá nhân hóa (AI Learning Profile)
CREATE TABLE user_learning_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    overall_mastery INTEGER DEFAULT 0 CHECK (overall_mastery BETWEEN 0 AND 100),
    streak_days INTEGER DEFAULT 0,
    total_problems_solved INTEGER DEFAULT 0,
    total_quizzes_taken INTEGER DEFAULT 0,
    total_vivas_conducted INTEGER DEFAULT 0,
    error_recovery_rate NUMERIC(5,2) DEFAULT 0.00,
    ai_diagnosis_summary TEXT,
    domain_scores JSONB, -- {"bayes": 70, "binomial": 85, "normal": 60, "clt": 65, "testing": 60}
    personalized_roadmap JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bài làm Tự luận & Chấm điểm Barem (Submissions)
CREATE TABLE problem_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_title VARCHAR(255) NOT NULL,
    problem_prompt TEXT NOT NULL,
    canvas_image_url TEXT,
    student_notes TEXT,
    total_score NUMERIC(4,2),
    barem_details JSONB, -- [ { criterion, maxScore, awardedScore, feedback } ]
    thinking_strategy JSONB, -- Danh sách các bước gợi ý tư duy
    misconceptions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ngân hàng Câu hỏi Trắc nghiệm & Lịch sử Chấm tức thì
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    latex_formula TEXT,
    options JSONB NOT NULL, -- [ { id: 'A', text: '...', latex: '...' } ]
    correct_option VARCHAR(5) NOT NULL,
    explanation_why_correct TEXT NOT NULL,
    explanation_why_wrong JSONB NOT NULL, -- { "A": "Lỗi cộng thẳng...", "C": "..." }
    common_pitfall TEXT
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id),
    selected_option VARCHAR(5) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    duration_seconds INTEGER,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Phiên Vấn đáp Lý thuyết & Lỗ hổng Kiến thức (Viva Sessions)
CREATE TABLE viva_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(150) NOT NULL,
    score NUMERIC(4,2),
    knowledge_gaps JSONB,
    misconceptions JSONB,
    mastery_highlights JSONB,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE viva_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES viva_sessions(id) ON DELETE CASCADE,
    turn_order INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'examiner' | 'student'
    content TEXT NOT NULL,
    latex_formula TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Nhật ký Gom nhóm Lỗi sai Tổng hợp (Error Logs 3 Nguồn)
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(20) NOT NULL, -- 'viva' | 'quiz' | 'essay'
    source_title VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    error_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    student_answer TEXT,
    correct_logic TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Diễn đàn Học tập XSTK (Community Forum)
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    latex_formula TEXT,
    tags TEXT[],
    upvotes INTEGER DEFAULT 0,
    has_ai_answer BOOLEAN DEFAULT FALSE,
    ai_hint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-4 text-slate-700 text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  Danh Sách API Endpoints (Express & Gemini Service)
                </h3>
                <div className="space-y-3 mt-4">
                  {[
                    {
                      method: 'POST',
                      path: '/api/ai/grade-submission',
                      desc: 'OCR hình ảnh Canvas/PDF, chấm điểm Barem 4 tiêu chí, trả về chiến lược giải (không giải hoàn chỉnh)',
                      badge: 'bg-indigo-100 text-indigo-800',
                    },
                    {
                      method: 'POST',
                      path: '/api/ai/voice-chat',
                      desc: 'Nhận diện thắc mắc giọng nói, trả lời âm thanh TTS và đồng bộ hình vẽ công thức lên Canvas',
                      badge: 'bg-emerald-100 text-emerald-800',
                    },
                    {
                      method: 'POST',
                      path: '/api/ai/generate-similar',
                      desc: 'Sinh ngẫu nhiên 5 bài toán tự luận cùng dạng kiến thức kèm chiến lược gợi ý',
                      badge: 'bg-amber-100 text-amber-800',
                    },
                    {
                      method: 'POST',
                      path: '/api/ai/generate-quiz',
                      desc: 'Tạo trắc nghiệm kèm giải thích logic đúng/sai sâu cho nút "Tại sao?"',
                      badge: 'bg-blue-100 text-blue-800',
                    },
                    {
                      method: 'POST',
                      path: '/api/ai/viva-turn',
                      desc: 'Hỏi - đáp vấn đáp lý thuyết trực tiếp, chẩn đoán lỗ hổng và nhận thức sai',
                      badge: 'bg-purple-100 text-purple-800',
                    },
                    {
                      method: 'POST',
                      path: '/api/ai/diagnose-errors',
                      desc: 'Phân tích gom nhóm toàn bộ lỗi sai từ 3 nguồn và xuất hướng khắc phục cụ thể',
                      badge: 'bg-rose-100 text-rose-800',
                    },
                  ].map((api, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-600 text-white">
                          {api.method}
                        </span>
                        <code className="text-xs font-bold text-slate-800">
                          {api.path}
                        </code>
                      </div>
                      <span className="text-xs text-slate-600 max-w-md">
                        {api.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pedagogy' && (
            <div className="space-y-4 text-slate-700 text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Quy Trình Sư Phạm Dạy Học & Giải Toán 4 Bước Chuẩn Hóa
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Ứng dụng triết lý kiến tạo (Constructivism): Học sinh tự khám phá quy luật toán học trước khi tiếp nhận công thức hình thức.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Bước 1: Khám phá / Nêu vấn đề
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">
                      Inquiry & Paradox Induction
                    </h4>
                    <p className="text-xs text-slate-600 mt-2">
                      Đưa ra tình huống thực tế hoặc nghịch lý xác suất (ví dụ: nghịch lý xét nghiệm y tế, nghịch lý Monty Hall) để kích hoạt sự tò mò và nhu cầu tìm kiếm công cụ toán học mới.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-violet-100 bg-violet-50/50">
                    <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                      Bước 2: Bản chất Lý thuyết & Định lý
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">
                      Mathematical Conceptualization
                    </h4>
                    <p className="text-xs text-slate-600 mt-2">
                      Trình bày định lý, điều kiện áp dụng và ý nghĩa trực giác của từng thành phần trong công thức (prior, likelihood, posterior, standard error).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Bước 3: Ví dụ Minh họa & Chiến lược
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">
                      Scaffolded Problem Solving
                    </h4>
                    <p className="text-xs text-slate-600 mt-2">
                      Giải mẫu theo các bước chuẩn: Đặt biến cố $\rightarrow$ Thiết lập công thức $\rightarrow$ Thay số $\rightarrow$ Kiểm chứng. AI chỉ dẫn các cạm bẫy dễ vấp ngã.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Bước 4: Luyện tập Ứng dụng & Mở rộng
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">
                      Mastery & Transfer
                    </h4>
                    <p className="text-xs text-slate-600 mt-2">
                      Học sinh tự giải trên Bảng vẽ Canvas, AI Tutor chấm điểm tự động, chỉ cung cấp gợi ý tư duy kích thích suy nghĩ và kết nối sang các bài toán tương tự.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>Hệ thống đạt chuẩn sư phạm EdTech & Toán học Ứng dụng</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Đóng tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};
