import React, { useState } from 'react';
import { MINDMAP_NODES } from '../data/mockData';
import { MindmapNode, ActiveTab } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  GitFork,
  Search,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  PenTool,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface InteractiveMindmapProps {
  onNavigateTab?: (tab: ActiveTab) => void;
  onSendToCanvas?: (title: string, prompt: string) => void;
}

export const InteractiveMindmap: React.FC<InteractiveMindmapProps> = ({
  onNavigateTab,
  onSendToCanvas,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('conditional-bayes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedNode =
    MINDMAP_NODES.find((n) => n.id === selectedNodeId) || MINDMAP_NODES[0];

  const filteredNodes = MINDMAP_NODES.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      activeCategory === 'all' || n.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'core':
        return 'border-indigo-400 bg-indigo-50/70 text-indigo-900';
      case 'probability':
        return 'border-blue-400 bg-blue-50/70 text-blue-900';
      case 'distribution':
        return 'border-violet-400 bg-violet-50/70 text-violet-900';
      case 'statistics':
        return 'border-emerald-400 bg-emerald-50/70 text-emerald-900';
      case 'inference':
        return 'border-amber-400 bg-amber-50/70 text-amber-900';
      default:
        return 'border-slate-300 bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>Interactive Knowledge Graph (Bản Đồ Tri Thức XSTK)</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 mt-1">
            Bản Đồ Tư Duy Toàn Cảnh Xác Suất Thống Kê
          </h2>
          <p className="text-xs text-slate-500">
            Trực quan hóa mạng lưới liên kết giữa Biến cố, Phân phối, Luật số lớn và Thống kê suy diễn.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhánh kiến thức..."
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'probability', label: 'Xác suất' },
              { id: 'distribution', label: 'Phân phối' },
              { id: 'inference', label: 'Suy diễn' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-2.5 py-1 rounded-xl font-semibold transition ${
                  activeCategory === c.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mindmap Interactive Canvas & Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Mindmap Tree Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-indigo-600" />
              Sơ Đồ Phân Cây (Nhấp vào node để khám phá chi tiết)
            </span>
            <span className="text-[11px] text-slate-400">
              {filteredNodes.length} nhánh kiến thức
            </span>
          </div>

          {/* Graphical Tree Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto p-1 scrollbar-thin">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isRoot = node.id === 'root';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer relative group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/90 shadow-md ring-4 ring-indigo-50'
                      : categoryColor(node.category) + ' hover:shadow-xs'
                  } ${isRoot ? 'sm:col-span-2 bg-gradient-to-r from-indigo-900 to-violet-900 text-white border-transparent' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isRoot
                            ? 'text-indigo-200'
                            : isSelected
                            ? 'text-indigo-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {node.category.toUpperCase()}
                      </span>
                      <h4
                        className={`text-sm font-extrabold mt-0.5 ${
                          isRoot ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {node.title}
                      </h4>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition ${
                        isSelected
                          ? 'text-indigo-600 translate-x-1'
                          : isRoot
                          ? 'text-white/60'
                          : 'text-slate-400 group-hover:translate-x-1'
                      }`}
                    />
                  </div>

                  <p
                    className={`text-xs mt-2 line-clamp-2 ${
                      isRoot ? 'text-indigo-100' : 'text-slate-600'
                    }`}
                  >
                    {node.description}
                  </p>

                  {/* Quick Formula Preview */}
                  {node.coreFormulas[0] && (
                    <div
                      className={`mt-2.5 p-1.5 rounded-xl text-center text-xs font-mono ${
                        isRoot
                          ? 'bg-white/10 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <MathView math={node.coreFormulas[0]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details & Exploration Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Chi Tiết Chuyên Đề
              </span>
              <h3 className="font-extrabold text-base text-slate-800">
                {selectedNode.title}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase bg-indigo-50 text-indigo-700">
              {selectedNode.category}
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            {/* Core Concept */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs block">
                Bản chất khái niệm (Core Intuition):
              </span>
              <FormattedMathText
                text={selectedNode.keyConcept}
                className="leading-relaxed"
              />
            </div>

            {/* Core Formulas */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 block">
                Hệ thống công thức then chốt (KaTeX):
              </span>
              <div className="space-y-1.5">
                {selectedNode.coreFormulas.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center text-indigo-950 font-bold"
                  >
                    <MathView math={f} block={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Example Problem Snippet */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                Ứng dụng thực tiễn điển hình:
              </span>
              <p className="leading-relaxed">
                {selectedNode.exampleProblemSnippet}
              </p>
            </div>

            {/* Common Trap */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Cạm bẫy tư duy thường gặp:
              </span>
              <FormattedMathText text={selectedNode.commonTrap} />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {onSendToCanvas && (
                <button
                  onClick={() =>
                    onSendToCanvas(
                      `Bài tập chuyên đề: ${selectedNode.title}`,
                      selectedNode.exampleProblemSnippet
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Luyện tập trên Canvas</span>
                </button>
              )}

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('similar_generator')}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  <span>Sinh bài tương tự</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
