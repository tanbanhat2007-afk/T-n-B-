import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pen,
  Highlighter,
  Eraser,
  RotateCcw,
  Trash2,
  Download,
  Grid,
  Palette,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

interface CanvasWorkspaceProps {
  onExportImage?: (dataUrl: string) => void;
  syncDiagram?: {
    type: 'bayes_tree' | 'normal_curve' | 'prob_table' | 'venn_diagram' | 'formula';
    title: string;
    details?: string;
  } | null;
  height?: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface Stroke {
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  size: number;
  points: Point[];
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  onExportImage,
  syncDiagram,
  height = 420,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#2563eb'); // Indigo-blue
  const [brushSize, setBrushSize] = useState<number>(3);
  const [gridMode, setGridMode] = useState<'dots' | 'lines' | 'none'>('dots');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const isDrawing = useRef<boolean>(false);
  const currentPoints = useRef<Point[]>([]);

  // Redraw canvas with background grid and strokes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (gridMode === 'dots') {
      ctx.fillStyle = '#cbd5e1';
      const step = 24;
      for (let x = step; x < canvas.width; x += step) {
        for (let y = step; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridMode === 'lines') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const step = 28;
      for (let y = step; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw all completed strokes
    strokes.forEach((s) => {
      if (s.points.length === 0) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (s.tool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = s.size * 5;
      } else if (s.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 4;
      } else {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
      }

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [strokes, gridMode]);

  // Adjust canvas resolution to fit container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = (isFullScreen ? window.innerHeight - 100 : height) * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${isFullScreen ? window.innerHeight - 100 : height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    redraw();
  }, [isFullScreen, height, redraw]);

  // Handle Voice-assisted Diagram Synchronization onto Canvas
  useEffect(() => {
    if (!syncDiagram) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    if (syncDiagram.type === 'bayes_tree') {
      // Draw Bayes Tree
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px system-ui';

      // Root
      const startX = 60;
      const startY = h / 2;
      ctx.beginPath();
      ctx.arc(startX, startY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('Ω', startX - 20, startY + 5);

      // Branch A1, A2
      const midX = startX + 160;
      const y1 = startY - 90;
      const y2 = startY + 90;

      // Lines
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(midX, y1);
      ctx.moveTo(startX, startY);
      ctx.lineTo(midX, y2);
      ctx.stroke();

      ctx.fillText('A1: P(A1)', midX - 60, y1 + 35);
      ctx.fillText('A2: P(A2)', midX - 60, y2 - 25);

      // Leaves B | A1, B_bar | A1
      const leafX = midX + 180;
      ctx.strokeStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(midX, y1);
      ctx.lineTo(leafX, y1 - 40);
      ctx.moveTo(midX, y1);
      ctx.lineTo(leafX, y1 + 40);

      ctx.moveTo(midX, y2);
      ctx.lineTo(leafX, y2 - 40);
      ctx.moveTo(midX, y2);
      ctx.lineTo(leafX, y2 + 40);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.fillText('B | A1: P(B|A1)', leafX + 10, y1 - 35);
      ctx.fillText('B̄ | A1: 1 - P(B|A1)', leafX + 10, y1 + 45);
      ctx.fillText('B | A2: P(B|A2)', leafX + 10, y2 - 35);
      ctx.fillText('B̄ | A2: 1 - P(B|A2)', leafX + 10, y2 + 45);

      ctx.fillStyle = '#6366f1';
      ctx.font = '12px system-ui';
      ctx.fillText(
        '✨ Đồng bộ từ Voice AI: Sơ đồ Cây xác suất đầy đủ & Công thức Bayes',
        20,
        25
      );
    } else if (syncDiagram.type === 'normal_curve') {
      // Draw Bell Curve (Phân phối chuẩn)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';

      const mean = w / 2;
      const sigma = w / 7;
      const baseline = h - 60;

      // Axis
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(40, baseline);
      ctx.lineTo(w - 40, baseline);
      ctx.stroke();

      // Gauss curve
      ctx.beginPath();
      for (let x = 50; x < w - 50; x += 3) {
        const z = (x - mean) / sigma;
        const y = baseline - (180 * Math.exp(-0.5 * z * z));
        if (x === 50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#2563eb';
      ctx.stroke();

      // Fill ±1 sigma area
      ctx.beginPath();
      const xLeft = mean - sigma;
      const xRight = mean + sigma;
      ctx.moveTo(xLeft, baseline);
      for (let x = xLeft; x <= xRight; x += 3) {
        const z = (x - mean) / sigma;
        const y = baseline - (180 * Math.exp(-0.5 * z * z));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(xRight, baseline);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px system-ui';
      ctx.fillText('μ - σ', xLeft - 15, baseline + 25);
      ctx.fillText('μ (Trung bình)', mean - 35, baseline + 25);
      ctx.fillText('μ + σ', xRight - 15, baseline + 25);
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Vùng 68.26%', mean - 35, baseline - 50);

      ctx.fillStyle = '#6366f1';
      ctx.font = '12px system-ui';
      ctx.fillText('✨ Đồng bộ từ Voice AI: Đường cong Phân phối chuẩn Gauss N(μ, σ²)', 20, 25);
    }
    ctx.restore();
  }, [syncDiagram]);

  // Pointer event handlers (iPad touch + pen + mouse compatible)
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const pt = getCanvasCoords(e);
    currentPoints.current = [pt];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasCoords(e);
    currentPoints.current.push(pt);

    // Progressive direct rendering
    const pts = currentPoints.current;
    if (pts.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 5;
    } else if (tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (currentPoints.current.length > 0) {
      const newStroke: Stroke = {
        tool,
        color,
        size: brushSize,
        points: [...currentPoints.current],
      };
      setStrokes((prev) => [...prev, newStroke]);
      currentPoints.current = [];
    }
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      const updated = prev.slice(0, prev.length - 1);
      setTimeout(() => redraw(), 10);
      return updated;
    });
  };

  const handleClear = () => {
    if (strokes.length > 0 && !window.confirm('Bạn có chắc muốn xóa toàn bộ bảng vẽ?')) {
      return;
    }
    setStrokes([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTimeout(() => redraw(), 10);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onExportImage) {
      onExportImage(dataUrl);
    } else {
      // Download directly
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `bai-lam-xstk-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${
        isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
    >
      {/* Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 border-b border-slate-200 text-slate-700">
        {/* Tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTool('pen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tool === 'pen'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Bút mực (Stylus / Chuột)"
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Bút mực</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('highlighter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tool === 'highlighter'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Bút dạ quang / Đánh dấu"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Dạ quang</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tool === 'eraser'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Cục tẩy"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Tẩy</span>
          </button>
        </div>

        {/* Color Palette */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-1 px-2 border-l border-slate-300">
            {[
              '#1e293b', // Black
              '#2563eb', // Blue
              '#7c3aed', // Purple
              '#dc2626', // Red
              '#059669', // Green
              '#d97706', // Orange
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full transition transform hover:scale-110 ${
                  color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''
                }`}
                title={`Màu ${c}`}
              />
            ))}
          </div>
        )}

        {/* Brush Size Slider */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 border-l border-slate-300 text-xs text-slate-500">
          <span>Nét:</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-16 accent-indigo-600 cursor-pointer"
          />
          <span className="font-mono text-slate-700 w-4">{brushSize}</span>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-1">
          {/* Grid Mode */}
          <button
            type="button"
            onClick={() =>
              setGridMode((prev) =>
                prev === 'dots' ? 'lines' : prev === 'lines' ? 'none' : 'dots'
              )
            }
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
            title={`Lưới: ${gridMode}`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
            title="Hoàn tác (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition"
            title="Xóa trắng bảng vẽ"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export / Download */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
            title="Xuất bài vẽ nộp chấm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Nộp bài vẽ</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
            title={isFullScreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 bg-white overflow-hidden touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block"
        />

        {syncDiagram && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md border border-indigo-200 px-3 py-1.5 rounded-xl shadow-md text-xs text-indigo-800 flex items-center gap-2 pointer-events-none animate-fadeIn">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Voice AI Sync:</strong> Đã dựng sơ đồ trực quan{' '}
              {syncDiagram.title} lên bảng vẽ!
            </span>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
        <span>💡 Tối ưu cho bút Apple Pencil, Stylus & Touch trên iPad/Tablet</span>
        <span>{strokes.length} nét vẽ</span>
      </div>
    </div>
  );
};
