import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useState, useCallback } from 'react';

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Rating = ({ value, onChange, readOnly = false, size = 'md' }: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = useCallback(
    (index: number, isHalf: boolean) => {
      if (readOnly || !onChange) return;
      const newValue = isHalf ? index + 0.5 : index + 1;
      onChange(newValue);
    },
    [readOnly, onChange]
  );

  const handleMouseMove = useCallback(
    (index: number, event: React.MouseEvent<HTMLDivElement>) => {
      if (readOnly || !onChange) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const isHalf = x < rect.width / 2;
      setHoverValue(isHalf ? index + 0.5 : index + 1);
    },
    [readOnly, onChange]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = displayValue >= starValue;
    const halfFilled = displayValue >= starValue - 0.5 && displayValue < starValue;
    const starSize = sizes[size];

    return (
      <div
        key={index}
        className={cn(
          'relative inline-block',
          !readOnly && onChange && 'cursor-pointer'
        )}
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isHalf = x < rect.width / 2;
          handleClick(index, isHalf);
        }}
      >
        <Star
          size={starSize}
          className="text-sand-200 transition-colors"
          fill="currentColor"
          strokeWidth={1.5}
        />
        {halfFilled && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star
              size={starSize}
              className="text-candle transition-colors"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </div>
        )}
        {filled && (
          <Star
            size={starSize}
            className="absolute inset-0 text-candle transition-colors"
            fill="currentColor"
            strokeWidth={1.5}
          />
        )}
      </div>
    );
  };

  return (
    <div className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(renderStar)}
    </div>
  );
};

export default Rating;
