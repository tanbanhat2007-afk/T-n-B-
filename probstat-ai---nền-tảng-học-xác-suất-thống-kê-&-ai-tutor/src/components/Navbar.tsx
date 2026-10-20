import React from 'react';
import {
  Mic,
  Search,
  Layers,
  Sparkles,
  BookOpen,
  PenTool,
  HelpCircle,
  Bell,
  Smartphone,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onOpenVoiceAssistant: () => void;
  onOpenArchitectureModal: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onOpenVoiceAssistant,
  onOpenArchitectureModal,
  onNavigateTab,
  onToggleMobileMenu,
}) => {
  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'four_step':
        return 'Quy Trình Dạy Học & Giải Toán 4 Bước';
      case 'grader':
        return 'AI Tutor Chấm Điểm & Bảng Vẽ Điện Tử iPad Canvas';
      case 'voice_sync':
        return 'Tương Tác Giọng Nói & Đồng Bộ Vẽ Sơ Đồ';
      case 'similar_generator':
        return 'Sinh 5 Bài Tập Tự Luận Tương Tự & Chiến Lược Giải';
      case 'instant_quiz':
        return 'Trắc Nghiệm Chấm Tức Thì & Nút "Tại Sao?"';
      case 'viva_exam':
        return 'Vấn Đáp Lý Thuyết & Phát Hiện Lỗ Hổng Kiến Thức';
      case 'error_report':
        return 'Báo Cáo Thống Kê & Phân Tích Lỗi Sai 3 Nguồn';
      case 'mindmap':
        return 'Bản Đồ Tư Duy Tương Tác Xác Suất Thống Kê';
      case 'forum':
        return 'Diễn Đàn Điện Tử Học Tập XSTK';
      case 'profile':
        return 'Hồ Sơ AI Học Tập Cá Nhân Hóa & Lộ Trình Bổ Trợ';
      default:
        return 'Nền Tảng Học Xác Suất Thống Kê';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Title & Context */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            title="Menu tính năng"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
            {getTabTitle(activeTab)}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium truncate hidden sm:block">
            Môn Xác suất Thống kê • Đại học & Cao học • Chuẩn Quốc tế
          </p>
        </div>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Voice Search Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition border border-indigo-200/80 shadow-xs group"
          title="Mở Trợ lý AI và Tìm kiếm bằng Giọng nói"
        >
          <div className="relative">
            <Mic className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="hidden md:inline">Voice AI & Tìm kiếm</span>
        </button>

        {/* Quick Jump to iPad Canvas Workspace */}
        <button
          onClick={() => onNavigateTab('grader')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'grader'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Bảng vẽ iPad Canvas & Bút Stylus"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bảng vẽ iPad</span>
        </button>

        {/* Architecture & DB Schema Button */}
        <button
          onClick={onOpenArchitectureModal}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-xs transition border border-slate-200"
          title="Xem Sơ đồ Kiến trúc & Database Schema"
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="hidden lg:inline">Kiến trúc & Database Schema</span>
        </button>
      </div>
    </header>
  );
};
