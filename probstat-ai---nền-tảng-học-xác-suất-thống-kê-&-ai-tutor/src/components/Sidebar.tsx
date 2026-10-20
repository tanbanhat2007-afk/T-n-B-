import React from 'react';
import { ActiveTab } from '../types';
import {
  BookOpen,
  PenTool,
  Mic,
  Dices,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  GitFork,
  MessageSquare,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  className = '',
}) => {
  const menuItems: {
    id: ActiveTab;
    label: string;
    sublabel: string;
    icon: any;
    badge?: string;
  }[] = [
    {
      id: 'four_step',
      label: '1. Quy Trình Dạy 4 Bước',
      sublabel: 'Khám phá → Định lý → Mẫu → Ứng dụng',
      icon: BookOpen,
      badge: 'Chuẩn',
    },
    {
      id: 'grader',
      label: '2. Chấm Điểm & Bảng Canvas',
      sublabel: 'iPad Stylus, OCR Barem, Chiến lược giải',
      icon: PenTool,
      badge: 'AI Vision',
    },
    {
      id: 'voice_sync',
      label: '3. Voice AI & Đồng Bộ Vẽ',
      sublabel: 'Hỏi đáp giọng nói, tự vẽ sơ đồ Bayes/Gauss',
      icon: Mic,
      badge: 'Live',
    },
    {
      id: 'similar_generator',
      label: '4. Sinh 5 Bài Tự Luận Tương Tự',
      sublabel: 'Đổi mới dữ liệu, gợi ý chiến lược giải',
      icon: Dices,
    },
    {
      id: 'instant_quiz',
      label: '5. Trắc Nghiệm & Nút "Tại Sao?"',
      sublabel: 'Chấm tức thì, bóc tách nguyên nhân sai',
      icon: CheckCircle2,
    },
    {
      id: 'viva_exam',
      label: '6. Vấn Đáp & Lỗ Hổng Kiến Thức',
      sublabel: 'Giám khảo AI, phát hiện misconception',
      icon: HelpCircle,
    },
    {
      id: 'error_report',
      label: '7. Báo Cáo Lỗi Sai 3 Nguồn',
      sublabel: 'Gom nhóm Vấn đáp - Trắc nghiệm - Tự luận',
      icon: AlertTriangle,
      badge: 'AI Audit',
    },
    {
      id: 'mindmap',
      label: '8. Bản Đồ Tư Duy Tương Tác',
      sublabel: 'Cây tri thức XSTK, công thức & ví dụ',
      icon: GitFork,
    },
    {
      id: 'forum',
      label: '9. Diễn Đàn Học Tập XSTK',
      sublabel: 'Cộng đồng hỏi đáp & AI trợ giúp',
      icon: MessageSquare,
    },
    {
      id: 'profile',
      label: '10. Hồ Sơ AI Cá Nhân Hóa',
      sublabel: 'Radar năng lực, lộ trình bổ trợ',
      icon: UserCheck,
    },
  ];

  return (
    <aside
      className={`w-72 bg-white border-r border-slate-200 flex flex-col justify-between select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm text-slate-800 tracking-tight flex items-center gap-1.5">
            ProbStat AI
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-100 text-indigo-700 font-bold uppercase">
              XSTK
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            AI Tutor & Learning Platform
          </p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          10 Tính Năng Cốt Lõi
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-900 font-bold border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate font-normal">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-indigo-200/80 text-indigo-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Quick Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 m-2 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ĐA
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700">Đặng Quốc Anh</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Streak: 7 ngày liên tiếp 🔥
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
