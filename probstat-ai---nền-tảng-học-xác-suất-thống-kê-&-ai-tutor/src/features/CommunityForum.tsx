import React, { useState } from 'react';
import { SAMPLE_FORUM_POSTS } from '../data/mockData';
import { ForumPost } from '../types';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Send,
  PlusCircle,
  Tag,
  Filter,
  Search,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';

export const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(SAMPLE_FORUM_POSTS);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newLatex, setNewLatex] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('Bayes, Xác suất');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleAddReply = (postId: string) => {
    const text = replyInput[postId];
    if (!text?.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `rep-${Date.now()}`,
                author: 'Đặng Quốc Anh (Bạn)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                content: text,
                createdAt: 'Vừa xong',
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyInput((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleAskAIHelper = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            hasAIAnswer: true,
            aiHint:
              p.aiHint ||
              '💡 Gợi ý tư duy từ AI Tutor: Đối với bài toán này, hãy phân tích không gian mẫu và xác định rõ hệ đầy đủ. Lưu ý không đánh đồng biến cố độc lập với xung khắc!',
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: 'Đặng Quốc Anh (K64-Toán)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      title: newTitle,
      content: newContent,
      latex: newLatex || undefined,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      upvotes: 1,
      hasAIAnswer: true,
      aiHint:
        '💡 Gợi ý tư duy nhanh từ AI Tutor: Chào bạn! Câu hỏi của bạn rất hay. Hãy xem xét định lý Bayes hoặc phân phối chuẩn tùy thuộc vào điều kiện biến ngẫu nhiên nhé!',
      createdAt: 'Vừa xong',
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewLatex('');
    setIsModalOpen(false);
  };

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  const filteredPosts = posts.filter((p) => {
    const matchTag = activeTag === 'all' || p.tags.includes(activeTag);
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner & New Question Trigger */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Community Forum (Cộng Đồng Học XSTK)</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 mt-1">
            Diễn Đàn Thảo Luận & Hỏi Đáp Toán Xác Suất Thống Kê
          </h2>
          <p className="text-xs text-slate-500">
            Học tập cộng đồng, cùng thảo luận bài toán khó và nhận trợ lực tức thì từ AI Tutor.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đặt Câu Hỏi Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold px-1">Chủ đề:</span>
          <button
            onClick={() => setActiveTag('all')}
            className={`px-3 py-1 rounded-xl font-semibold transition ${
              activeTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài đăng..."
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-44"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            {/* Author & Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {post.author}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {post.createdAt}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Title & Content */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {post.title}
              </h3>
              <FormattedMathText
                text={post.content}
                className="text-slate-700 text-xs sm:text-sm leading-relaxed"
              />
              {post.latex && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-900 font-bold border border-slate-200">
                  <MathView math={post.latex} block={true} />
                </div>
              )}
            </div>

            {/* AI Scaffolding Hint Badge */}
            {post.hasAIAnswer && post.aiHint && (
              <div className="p-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Trợ Lực Định Hướng Từ AI Tutor</span>
                </div>
                <FormattedMathText
                  text={post.aiHint}
                  className="leading-relaxed"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} Hữu ích</span>
                </button>

                {!post.hasAIAnswer && (
                  <button
                    onClick={() => handleAskAIHelper(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nhờ AI Gợi ý</span>
                  </button>
                )}
              </div>

              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.replies.length} phản hồi
              </span>
            </div>

            {/* Existing Replies */}
            {post.replies.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {post.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 bg-slate-50 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">
                        {rep.author}
                      </span>
                      <span className="text-slate-400">{rep.createdAt}</span>
                    </div>
                    <p className="text-slate-600">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Bar */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={replyInput[post.id] || ''}
                onChange={(e) =>
                  setReplyInput({ ...replyInput, [post.id]: e.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                placeholder="Viết câu trả lời hoặc thảo luận..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
              />
              <button
                onClick={() => handleAddReply(post.id)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Đăng Câu Hỏi Lên Diễn Đàn XSTK</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề câu hỏi / Vấn đề:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Phân biệt xác suất hậu nghiệm Bayes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết:
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Mô tả băn khoăn hoặc khúc mắc của bạn..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Công thức toán học LaTeX (tùy chọn):
                </label>
                <input
                  type="text"
                  value={newLatex}
                  onChange={(e) => setNewLatex(e.target.value)}
                  placeholder="Ví dụ: P(A|B) = P(AB)/P(B)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thẻ tags (phân cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Bayes, Phân phối, Z-Score"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Đăng Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
