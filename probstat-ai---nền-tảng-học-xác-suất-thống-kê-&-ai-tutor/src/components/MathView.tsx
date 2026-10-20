import React from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  children?: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  children,
  block = false,
  className = '',
}) => {
  const content = math || children || '';

  if (!content) return null;

  try {
    const html = katex.renderToString(content, {
      displayMode: block,
      throwOnError: false,
    });

    return (
      <span
        className={`math-container ${block ? 'block my-2 overflow-x-auto py-1' : 'inline-block'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className={`font-mono text-sm ${className}`}>{content}</code>;
  }
};

/**
 * Helper component that parses mixed text containing $...$ or $$...$$ and renders LaTeX parts
 */
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  // Split by $$...$$ (block) and $...$ (inline)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  const blockRegex = /\$\$([\s\S]*?)\$\$/;
  const inlineRegex = /\$([^\$]+?)\$/;

  while (remaining.length > 0) {
    const blockMatch = remaining.match(blockRegex);
    const inlineMatch = remaining.match(inlineRegex);

    if (
      blockMatch &&
      (!inlineMatch || (blockMatch.index ?? 0) <= (inlineMatch.index ?? 0))
    ) {
      const idx = blockMatch.index!;
      if (idx > 0) {
        parts.push(<span key={keyIdx++}>{remaining.slice(0, idx)}</span>);
      }
      parts.push(
        <MathView key={keyIdx++} math={blockMatch[1]} block={true} />
      );
      remaining = remaining.slice(idx + blockMatch[0].length);
    } else if (inlineMatch) {
      const idx = inlineMatch.index!;
      if (idx > 0) {
        parts.push(<span key={keyIdx++}>{remaining.slice(0, idx)}</span>);
      }
      parts.push(
        <MathView key={keyIdx++} math={inlineMatch[1]} block={false} />
      );
      remaining = remaining.slice(idx + inlineMatch[0].length);
    } else {
      parts.push(<span key={keyIdx++}>{remaining}</span>);
      break;
    }
  }

  return <div className={`leading-relaxed ${className}`}>{parts}</div>;
};
