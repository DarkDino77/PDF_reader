import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { ArrowLeft } from 'lucide-react';
import ReaderControls from '../molecules/ReaderControls';

interface ReaderToolbarProps {
  title: string;
  fontSize: number;
  lineHeight: number;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
}

const ReaderToolbar = ({
  title,
  fontSize,
  lineHeight,
  onFontSizeChange,
  onLineHeightChange,
}: ReaderToolbarProps) => {
  const naigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800">
      <Button
        variant="subtle"
        onClick={() => naigate('/')}
        className="gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4"></ArrowLeft>
        <span className="text-sm font-medium">Vault</span>
      </Button>
      <h1 className="text-sm font-semibold text-neutral-200 truncate max-w-xs md:max-w-md">
        {title}
      </h1>

      <ReaderControls
        fontSize={fontSize}
        lineHeight={lineHeight}
        onFontSizeChange={onFontSizeChange}
        onLineHeightChange={onLineHeightChange}
      />
    </header>
  );
};

export default ReaderToolbar;
