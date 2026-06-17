import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useWorkCardStore, type Filter } from '../../store/useWorkCardStore';

export const FILTERS: Filter[] = [
  { id: 'none', name: '原图', value: 'none' },
  { id: 'vintage', name: '复古', value: 'vintage' },
  { id: 'film', name: '胶片', value: 'film' },
  { id: 'japanese', name: '日系', value: 'japanese' },
  { id: 'mono', name: '黑白', value: 'mono' },
  { id: 'warm', name: '暖调', value: 'warm' },
];

export function applyFilter(ctx: CanvasRenderingContext2D, filterId: string, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    switch (filterId) {
      case 'vintage':
        data[i] = Math.min(255, r * 1.1 + 30);
        data[i + 1] = Math.min(255, g * 0.9 + 20);
        data[i + 2] = Math.min(255, b * 0.7);
        break;
      case 'film':
        data[i] = Math.min(255, r * 1.05 + 10);
        data[i + 1] = Math.min(255, g * 1.05 + 10);
        data[i + 2] = Math.min(255, b * 0.95 + 10);
        break;
      case 'japanese':
        data[i] = Math.min(255, r * 0.95 + 20);
        data[i + 1] = Math.min(255, g * 1.05 + 30);
        data[i + 2] = Math.min(255, b * 1.1 + 40);
        break;
      case 'mono':
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
        break;
      case 'warm':
        data[i] = Math.min(255, r * 1.15 + 20);
        data[i + 1] = Math.min(255, g * 1.05 + 10);
        data[i + 2] = Math.min(255, b * 0.85);
        break;
      default:
        break;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

interface FilterSelectorProps {
  previewImage?: string | null;
}

function FilterSelector({ previewImage }: FilterSelectorProps) {
  const { selectedFilter, setFilter } = useWorkCardStore();
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    if (!previewImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      FILTERS.forEach((filter, index) => {
        const canvas = canvasRefs.current[index];
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (filter.id !== 'none') {
          applyFilter(ctx, filter.id, canvas.width, canvas.height);
        }
      });
    };
    img.src = previewImage;
  }, [previewImage]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">滤镜效果</h3>
      <div className="grid grid-cols-3 gap-3">
        {FILTERS.map((filter, index) => {
          const isSelected = selectedFilter?.id === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setFilter(filter)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:opacity-80'
              }`}
            >
              <canvas
                ref={(el) => (canvasRefs.current[index] = el)}
                width={80}
                height={80}
                className="w-full h-20 bg-gray-100"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <span className="text-xs text-white font-medium">{filter.name}</span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterSelector;
