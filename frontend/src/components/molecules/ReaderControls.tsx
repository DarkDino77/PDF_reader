import StepperControl from '../atoms/StepperControl';

interface ReaderControlsProps {
  fontSize: number;
  lineHeight: number;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
}

const MIN_FONT = 12;
const MAX_FONT = 28;
const MIN_LINE = 1.4;
const MAX_LINE = 2.4;

const ReaderControls = ({
  fontSize,
  lineHeight,
  onFontSizeChange,
  onLineHeightChange,
}: ReaderControlsProps) => (
  <div>
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
