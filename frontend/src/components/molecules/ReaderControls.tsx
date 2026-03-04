import StepperControl from '../atoms/StepperControl';

interface ReaderControlsProps {
  fontSize: number;
  lineHeight: number;
  width: number;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onWidthChange: (value: number) => void;
}

const MIN_FONT = 12;
const MAX_FONT = 28;
const MIN_LINE = 1.4;
const MAX_LINE = 2.4;
const MIN_WIDTH = 40;
const MAX_WIDTH = 100;

const ReaderControls = ({
  fontSize,
  lineHeight,
  width,
  onFontSizeChange,
  onLineHeightChange,
  onWidthChange,
}: ReaderControlsProps) => (
  <div className="flex items-center gap-4">
    <StepperControl
      label="Width"
      value={`${width}`}
      onDecrement={() => onWidthChange(width - 5)}
      onIncrement={() => onWidthChange(width + 5)}
      atMin={width <= MIN_WIDTH}
      atMax={width >= MAX_WIDTH}
    />
    <StepperControl
      label="Size"
      value={String(fontSize)}
      onDecrement={() => onFontSizeChange(fontSize - 1)}
      onIncrement={() => onFontSizeChange(fontSize + 1)}
      atMin={fontSize <= MIN_FONT}
      atMax={fontSize >= MAX_FONT}
    />
    <StepperControl
      label="Spacing"
      value={lineHeight.toFixed(1)}
      onDecrement={() =>
        onLineHeightChange(parseFloat((lineHeight - 0.1).toFixed(1)))
      }
      onIncrement={() =>
        onLineHeightChange(parseFloat((lineHeight + 0.1).toFixed(1)))
      }
      atMin={lineHeight <= MIN_LINE}
      atMax={lineHeight >= MAX_LINE}
    />
  </div>
);

export default ReaderControls;
