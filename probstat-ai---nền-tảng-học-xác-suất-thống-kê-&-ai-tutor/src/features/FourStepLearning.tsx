import React, { useState } from 'react';
import { FOUR_STEP_LESSONS, FourStepLesson } from '../data/mockData';
import { MathView, FormattedMathText } from '../components/MathView';
import {
  Sparkles,
  HelpCircle,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  PenTool,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface FourStepLearningProps {
  onGoToCanvas?: (problemTitle: string, problemPrompt: string) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const FourStepLearning: React.FC<FourStepLearningProps> = ({
  onGoToCanvas,
  onNavigateTab,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const lesson = FOUR_STEP_LESSONS[selectedLessonIndex];

  const handleStepClick = (stepNum: number) => {
    setCurrentStep(stepNum);
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps((prev) => [...prev, stepNum]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      handleStepClick(currentStep + 1);
    }
  };

  const stepsConfig = [
    {
      step: 1,
      name: 'Bước 1: Khám phá / Vấn đề',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      step: 2,
      name: 'Bước 2: Bản chất Định lý',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      step: 3,
      name: 'Bước 3: Ví dụ & Chiến lược',
      icon: Lightbulb,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      step: 4,
      name: 'Bước 4: Luyện tập Ứng dụng',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Lesson Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Chương Trình Chuẩn Hóa 4 Bước (Scaffolded Learning Flow)
          </span>
          <h2 className="text-lg font-bold text-slate-800">{lesson.title}</h2>
          <p className="text-xs text-slate-500">{lesson.subtitle}</p>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FOUR_STEP_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => {
                setSelectedLessonIndex(idx);
                setCurrentStep(1);
                setCompletedSteps([1]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedLessonIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {l.topic.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Steps Stepper Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {stepsConfig.map((s) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.step;
          const isDone = completedSteps.includes(s.step);

          return (
            <button
              key={s.step}
              onClick={() => handleStepClick(s.step)}
              className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                isCurrent
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-100'
                  : isDone
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone && !isCurrent ? '✓' : s.step}
                </div>
                <div className="truncate">
                  <div
                    className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    {s.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {s.step === 1
                      ? 'Nghịch lý & Tò mò'
                      : s.step === 2
                      ? 'Định lý & Công thức'
                      : s.step === 3
                      ? 'Mẫu giải & Cạm bẫy'
                      : 'Thử thách Bảng vẽ'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {/* STEP 1: Khám phá / Nêu vấn đề */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 w-fit text-xs font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Khởi động Tư duy: Khám phá Tình huống Nghịch lý Thực tế</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">
                Tình huống thực tế:
              </h3>
              <FormattedMathText
                text={lesson.step1.scenario}
                className="text-slate-700 text-sm leading-relaxed"
              />

              <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-950 font-medium text-sm">
                <strong>Vấn đề đặt ra: </strong>
                {lesson.step1.realWorldProblem}
              </div>
            </div>

            {/* Guiding Questions */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-800">
                Câu hỏi gợi mở định hướng (Guiding Questions):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lesson.step1.guidingQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs flex items-start gap-2"
                  >
                    <span className="font-bold text-indigo-600 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intuition Key */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm">Chìa khóa Trực giác (Intuition): </span>
                <FormattedMathText text={lesson.step1.intuitionKey} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Bản chất Lý thuyết & Định lý */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 w-fit text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Cơ sở Toán học: Định lý & Bản chất Đại số</span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">
                {lesson.step2.theoremName}
              </h3>
              <FormattedMathText
                text={lesson.step2.statement}
                className="text-xs text-slate-600"
              />
            </div>

            {/* Main Formula Highlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md text-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-300">
                CÔNG THỨC TOÁN HỌC TRỌNG TÂM
              </span>
              <div className="my-4 text-xl sm:text-2xl font-bold">
                <MathView math={lesson.step2.latexFormula} block={true} />
              </div>
              <div className="text-xs text-indigo-200 max-w-xl mx-auto italic">
                "{lesson.step2.coreTakeaway}"
              </div>
            </div>

            {/* Variable explanation table */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-800">
                Ý nghĩa các ký hiệu trong công thức:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.step2.variablesExplanation.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3"
                  >
                    <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-mono font-bold text-indigo-700 shrink-0">
                      <MathView math={item.symbol} />
                    </div>
                    <span className="text-slate-700">{item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Ví dụ Minh họa & Chiến lược Giải */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 w-fit text-xs font-bold">
              <Lightbulb className="w-4 h-4" />
              <span>Thị phạm: Chiến Lược Giải Từng Bước (Scaffolded Walkthrough)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Bài toán mẫu
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">
                {lesson.step3.exampleProblem}
              </h3>
              {lesson.step3.latexExample && (
                <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 text-center">
                  <MathView math={lesson.step3.latexExample} block={true} />
                </div>
              )}
            </div>

            {/* Step by step strategy breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800">
                Chiến lược tư duy 3 pha chuẩn mực:
              </h4>
              {lesson.step3.stepByStepStrategy.map((s) => (
                <div
                  key={s.step}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs">
                      Pha {s.step}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {s.action}
                    </span>
                  </div>
                  <FormattedMathText
                    text={s.reasoning}
                    className="text-xs text-slate-600 leading-relaxed"
                  />
                  {s.intermediateLatex && (
                    <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-center font-bold text-sm text-blue-950">
                      <MathView math={s.intermediateLatex} block={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final result & Pitfall Advice */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Kết quả cuối cùng
                </span>
                <p className="font-bold text-base">{lesson.step3.finalResult}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-900">
                  Cạm bẫy học sinh hay mắc phải:
                </span>
                <FormattedMathText
                  text={lesson.step3.tutorAdvice}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Luyện tập Ứng dụng & Bảng vẽ */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Chinh phục: Bài tập Thử thách & Tự luyện trên Bảng vẽ</span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Thử thách mở rộng năng lực
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {lesson.step4.challengeProblem}
              </h3>
              {lesson.step4.latexChallenge && (
                <div className="p-2 bg-white rounded-xl border border-indigo-100 text-center">
                  <MathView math={lesson.step4.latexChallenge} block={true} />
                </div>
              )}

              {/* Action Button: Jump to Canvas */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (onGoToCanvas) {
                      onGoToCanvas(
                        `Thử thách Bước 4: ${lesson.title}`,
                        `${lesson.step4.challengeProblem}`
                      );
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Mở Bảng vẽ Canvas để làm bài nộp AI Tutor chấm</span>
                </button>

                <button
                  onClick={() => onNavigateTab && onNavigateTab('similar_generator')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition"
                >
                  <span>Sinh thêm 5 bài tập tương tự dạng này</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hints Accordion */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-800">
                Gợi ý định hướng giải (Scaffolding Hints):
              </h4>
              <div className="space-y-2">
                {lesson.step4.hints.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <span className="font-bold text-indigo-600 shrink-0">
                      💡 Gợi ý {idx + 1}:
                    </span>
                    <FormattedMathText text={h} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Bottom Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
          >
            ← Quay lại bước trước
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition"
            >
              <span>Tiếp tục Bước {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                const nextIdx = (selectedLessonIndex + 1) % FOUR_STEP_LESSONS.length;
                setSelectedLessonIndex(nextIdx);
                setCurrentStep(1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-100 transition"
            >
              <span>Chuyển sang Chuyên đề tiếp theo</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
