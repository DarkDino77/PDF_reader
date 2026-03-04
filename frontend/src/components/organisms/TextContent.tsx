import type { JSX } from 'react';
import type { TextBlock } from '../../types/api';

interface TextContentProps {
  blocks: TextBlock[];
  fontSize: number;
  lineHeight: number;
}

const TextContent = ({ blocks, fontSize, lineHeight }: TextContentProps) => {
  if (blocks.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-20">
        <p>No content Extracted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <TextBlockNode
          key={block.id}
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></TextBlockNode>
      ))}
    </div>
  );
};

interface TextBlockNodeProps {
  block: TextBlock;
  fontSize: number;
  lineHeight: number;
}

const styles: Record<string, string> = {
  h1: 'text-3xl font-bold text-white pt-6',
  h2: 'text-2xl font-bold text-white pt-4',
  h3: 'text-xl font-semibold text-neutral-100 pt-3',
  h4: 'text-lg font-semibold text-neutral-200 pt-2',
  p: 'text-neutral-300',
};

const TextBlockNode = ({ block, fontSize, lineHeight }: TextBlockNodeProps) => {
  const Tag = block.block_type as keyof JSX.IntrinsicElements;

  return (
    <Tag
      style={{ fontSize: `${fontSize}px`, lineHeight }}
      className={styles[block.block_type] ?? styles['p']}
    >
      {block.content}
    </Tag>
  );
};

export default TextContent;
