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
const TextBlockNode = ({ block, fontSize, lineHeight }: TextBlockNodeProps) => {
  if (block.block_type === 'heading') {
    return (
      <h2
        style={{ fontSize: `${Math.round(fontSize * 1.35)}px` }}
        className="font-bold text-white pt-4"
      >
        {block.content}
      </h2>
    );
  }

  return (
    <p
      style={{ fontSize: `${fontSize}px`, lineHeight }}
      className="text-neutral-300"
    >
      {block.content}
    </p>
  );
};

export default TextContent;
