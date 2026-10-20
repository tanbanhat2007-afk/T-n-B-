export type ActiveTab =
  | 'four_step'
  | 'grader'
  | 'voice_sync'
  | 'similar_generator'
  | 'instant_quiz'
  | 'viva_exam'
  | 'error_report'
  | 'mindmap'
  | 'forum'
  | 'profile';

export interface BaremItem {
  id: string;
  criterion: string;
  maxScore: number;
  awardedScore: number;
  feedback: string;
}

export interface GradingResult {
  totalScore: number;
  maxScore: number;
  barem: BaremItem[];
  thinkingStrategy: string[]; // Step-by-step thinking hints (NO complete direct solution)
  detectedMisconceptions: string[];
  remedialTips: string[];
  encouragement: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  latex?: string;
  options: {
    id: string;
    text: string;
    latex?: string;
  }[];
  correctAnswer: string;
  explanation: {
    whyCorrect: string;
    whyWrong: Record<string, string>;
    commonPitfall: string;
    formulaUsed?: string;
  };
}

export interface VivaTurn {
  role: 'examiner' | 'student';
  content: string;
  latex?: string;
  timestamp: string;
}

export interface VivaReport {
  score: number;
  knowledgeGaps: string[];
  misconceptions: string[];
  masteryHighlights: string[];
  recommendation: string;
}

export interface SimilarProblem {
  id: string;
  title: string;
  context: string;
  problemStatement: string;
  latex?: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  thinkingStrategy: string[]; // Gợi ý hướng đi & chiến lược giải
  keyFormulas: string[];
  pitfallsToAvoid: string[];
}

export interface ErrorRecord {
  id: string;
  source: 'viva' | 'quiz' | 'essay';
  sourceTitle: string;
  topic: string;
  errorName: string;
  description: string;
  studentAnswer: string;
  correctLogic: string;
  timestamp: string;
}

export interface MindmapNode {
  id: string;
  title: string;
  parentId?: string;
  category: 'core' | 'probability' | 'distribution' | 'statistics' | 'inference';
  description: string;
  coreFormulas: string[];
  keyConcept: string;
  exampleProblemSnippet: string;
  commonTrap: string;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  latex?: string;
  tags: string[];
  upvotes: number;
  hasAIAnswer: boolean;
  aiHint?: string;
  createdAt: string;
  replies: {
    id: string;
    author: string;
    avatar: string;
    isAI?: boolean;
    content: string;
    createdAt: string;
  }[];
}

export interface UserLearningProfile {
  name: string;
  studentId: string;
  streakDays: number;
  overallMastery: number; // 0 - 100
  domainMastery: {
    domain: string;
    score: number; // 0 - 100
    status: 'Cần cải thiện' | 'Khá' | 'Vững vàng' | 'Thành thạo';
  }[];
  totalSolved: number;
  totalQuizzes: number;
  totalVivas: number;
  errorRecoveryRate: number; // percentage
  aiDiagnosis: string;
  personalizedRoadmap: {
    stage: string;
    title: string;
    description: string;
    tasks: string[];
    status: 'completed' | 'in_progress' | 'upcoming';
  }[];
}
