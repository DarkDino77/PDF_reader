import { Minus, Plus } from 'lucide-react';
import Button from './Button';

interface StepperControlProps {
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  atMin: boolean;
  atMax: boolean;
}

const StepperControl = ({
  label,
  value,
  onDecrement,
  onIncrement,
  atMin,
  atMax,
}: StepperControlProps) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-neutral-500 hidden sm:block">{label}</span>
    <Button
      variant="subtle"
      onClick={onDecrement}
      disabled={atMin}
      className="p-1 h-auto"
    >
      <Minus className="w-3 h-3"></Minus>
    </Button>
    <span className="text-xs text-neutral-300 w-8 text-center">{value}</span>
    <Button
      variant="subtle"
      onClick={onIncrement}
      disabled={atMax}
      className="p-1 h-auto"
    >
      <Plus className="w-3 h-3"></Plus>
    </Button>
  </div>
);

export default StepperControl;
