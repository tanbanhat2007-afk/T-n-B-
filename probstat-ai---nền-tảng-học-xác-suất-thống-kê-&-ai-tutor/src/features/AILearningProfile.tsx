import React from 'react';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { UserLearningProfile, ActiveTab } from '../types';
import {
  UserCheck,
  Flame,
  Award,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  PenTool,
} from 'lucide-react';

interface AILearningProfileProps {
  profile?: UserLearningProfile;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const AILearningProfile: React.FC<AILearningProfileProps> = ({
  profile = INITIAL_USER_PROFILE,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Student Banner Card */}
      <div className="p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-800 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center font-extrabold text-2xl border border-white/20 shadow-inner">
            ĐA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">{profile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                {profile.studentId}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Học phần: Xác suất Thống kê Nâng cao • Khóa 2026
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                Streak {profile.streakDays} ngày liên tiếp
              </span>
              <span>•</span>
              <span className="text-emerald-300">
                Hồi phục lỗi sai: {profile.errorRecoveryRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Overall Mastery Ring/Box */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center sm:text-right shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
            Năng Lực Tổng Thể (Mastery)
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {profile.overallMastery}%
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold">
            Đạt chuẩn Xuất sắc
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Bài tự luận đã giải
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {profile.totalSolved}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            +5 bài trong tuần
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Câu trắc nghiệm
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {profile.totalQuizzes}
          </div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
            Độ chính xác 82%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Phiên vấn đáp AI
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {profile.totalVivas}
          </div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">
            Điểm TB: 8.2 / 10
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Tỷ lệ sửa lỗi
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {profile.errorRecoveryRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Tự tin sau 3 lần luyện
          </div>
        </div>
      </div>

      {/* AI Qualitative Diagnosis Box */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800">
              Nhận Định Năng Lực Học Thuật Từ AI Tutor
            </h3>
            <p className="text-xs text-slate-400">
              Tổng hợp từ hành vi làm bài Canvas, trắc nghiệm và vấn đáp
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {profile.aiDiagnosis}
        </div>
      </div>

      {/* Domain Mastery Radar Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-800">
            Đánh Giá Điểm Mạnh / Điểm Yếu Theo Từng Chuyên Đề
          </h3>
          <span className="text-xs text-slate-400">6 Chuyên đề cốt lõi</span>
        </div>

        <div className="space-y-3">
          {profile.domainMastery.map((item, idx) => {
            const statusColor =
              item.status === 'Thành thạo'
                ? 'bg-emerald-100 text-emerald-800'
                : item.status === 'Vững vàng'
                ? 'bg-indigo-100 text-indigo-800'
                : item.status === 'Khá'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-rose-100 text-rose-800';

            const barColor =
              item.status === 'Thành thạo'
                ? 'bg-emerald-500'
                : item.status === 'Vững vàng'
                ? 'bg-indigo-600'
                : item.status === 'Khá'
                ? 'bg-blue-500'
                : 'bg-rose-500';

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.domain}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${statusColor}`}
                    >
                      {item.status}
                    </span>
                    <span className="font-mono font-bold text-slate-700 w-8 text-right">
                      {item.score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized AI Roadmap */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">
              Lộ Trình Bổ Trợ Khắc Phục Lỗ Hổng Cá Nhân Hóa
            </h3>
            <p className="text-xs text-slate-400">
              Kế hoạch học tập thiết kế riêng nhằm đưa tỷ lệ làm chủ lên trên 90%
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
            3 Chặng
          </span>
        </div>

        <div className="space-y-3">
          {profile.personalizedRoadmap.map((stage, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition text-xs space-y-2 ${
                stage.status === 'in_progress'
                  ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-50'
                  : stage.status === 'completed'
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    stage.status === 'in_progress'
                      ? 'text-indigo-600'
                      : stage.status === 'completed'
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.stage}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    stage.status === 'in_progress'
                      ? 'bg-indigo-600 text-white'
                      : stage.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {stage.status === 'in_progress'
                    ? 'Đang thực hiện'
                    : stage.status === 'completed'
                    ? 'Đã hoàn thành'
                    : 'Kế tiếp'}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">
                {stage.title}
              </h4>
              <p className="text-slate-600">{stage.description}</p>

              {/* Tasks */}
              <div className="space-y-1 pt-1">
                {stage.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        stage.status === 'completed'
                          ? 'text-emerald-500'
                          : 'text-indigo-400'
                      }`}
                    />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              {stage.status === 'in_progress' && onNavigateTab && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigateTab('grader')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Làm bài tập chặng này ngay</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
