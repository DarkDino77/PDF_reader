import type { JSX } from 'react';
import type { TextBlock } from '../../types/api';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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
        <BlockNode
          key={block.id}
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></BlockNode>
      ))}
    </div>
  );
};

const styles: Record<string, string> = {
  h1: 'font-bold text-white pt-6',
  h2: 'font-bold text-white pt-4',
  h3: 'font-semibold text-neutral-100 pt-3',
  h4: 'font-semibold text-neutral-200 pt-2',
  p: 'text-neutral-300',
};

const sizeMultipliers: Record<string, number> = {
  h1: 2.0,
  h2: 1.5,
  h3: 1.25,
  h4: 1.1,
  p: 1.0,
};
interface BlockNodeProps {
  block: TextBlock;
  fontSize: number;
  lineHeight: number;
}

const BlockNode = ({ block, fontSize, lineHeight }: BlockNodeProps) => {
  switch (block.block_type) {
    case 'figure':
      return (
        <FigureBlock
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></FigureBlock>
      );

    case 'table':
      return (
        <TableBlock
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></TableBlock>
      );

    case 'equation':
      return (
        <EquationBlock
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></EquationBlock>
      );

    case 'caption':
      return (
        <CaptionBlock
          block={block}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></CaptionBlock>
      );

    default:
      return (
        <TextNode block={block} fontSize={fontSize} lineHeight={lineHeight} />
      );
  }
};

const TextNode = ({ block, fontSize, lineHeight }: BlockNodeProps) => {
  const Tag = block.block_type as keyof JSX.IntrinsicElements;
  const multiplier = sizeMultipliers[block.block_type] ?? 1;

  return (
    <Tag
      style={{ fontSize: `${fontSize * multiplier}px`, lineHeight }}
      className={styles[block.block_type] ?? styles['p']}
    >
      {block.content}
    </Tag>
  );
};

const FigureBlock = ({ block }: BlockNodeProps) => {
  console.log(block.image);
  return (
    <figure className="my-6">
      {block.image ? (
        <img
          src={block.image}
          alt="Figure"
          className="max-w-full rounded border border-neutral-800"
        />
      ) : (
        <div className="flex items-center justify-center h-24 rounded border border-dashed border-neutral-700 text-neutral-600 text-sm">
          [Figure]
        </div>
      )}
    </figure>
  );
};

const TableBlock = ({ block }: BlockNodeProps) => {
  return (
    <figure className="my-6">
      {block.image ? (
        <img
          src={block.image}
          alt="Table"
          className="max-w-full rounded border border-neutral-800"
        />
      ) : (
        <div className="flex items-center justify-center h-24 rounded border border-dashed border-neutral-700 text-neutral-600 text-sm">
          [Table]
        </div>
      )}
    </figure>
  );
};

const EquationBlock = ({ block, fontSize }: BlockNodeProps) => {
  if (block.content && block.content !== '[EQUATION]') {
    try {
      const html = katex.renderToString(block.content, {
        throwOnError: true,
        displayMode: true,
      });
      return (
        <div
          className="my-4 overflow-x-auto py-2 text-neutral-200"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      );
    } catch {
      // logerror
    }
  }

  if (block.image) {
    return (
      <figure className="my-4">
        <img src={block.image} alt="Equation" className="max-h-16" />
      </figure>
    );
  }

  return (
    <pre className="my-4 text-neutral-400 overflow-x-auto text-sm font-mono bg-neutral-900 rounded px-3 py-2">
      {block.content}
    </pre>
  );
};

const CaptionBlock = ({ block, fontSize, lineHeight }: BlockNodeProps) => {
  return (
    <figcaption
      style={{ fontSize: `${fontSize * 0.85}px`, lineHeight }}
      className="text-neutral-500 italic -mt-4"
    >
      {block.content}
    </figcaption>
  );
};

export default TextContent;
