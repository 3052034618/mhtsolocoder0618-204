import { Check } from 'lucide-react';
import { useWorkCardStore, type Border } from '../../store/useWorkCardStore';

export const BORDERS: Border[] = [
  { id: 'none', name: '无框', style: 'none', color: 'transparent', width: 0 },
  { id: 'white', name: '简约白边', style: 'solid', color: '#ffffff', width: 20 },
  { id: 'brown', name: '复古棕边', style: 'solid', color: '#8B4513', width: 24 },
  { id: 'pink', name: '花艺粉边', style: 'solid', color: '#FFB6C1', width: 22 },
  { id: 'gold', name: '陶土金边', style: 'solid', color: '#DAA520', width: 18 },
];

export function drawBorder(ctx: CanvasRenderingContext2D, border: Border, width: number, height: number) {
  if (border.id === 'none') return;

  ctx.strokeStyle = border.color;
  ctx.lineWidth = border.width;
  ctx.strokeRect(border.width / 2, border.width / 2, width - border.width, height - border.width);

  if (border.id === 'gold') {
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      border.width / 2 + 5,
      border.width / 2 + 5,
      width - border.width - 10,
      height - border.width - 10
    );
  }

  if (border.id === 'brown') {
    ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
    ctx.fillRect(0, 0, width, height);
  }
}

interface BorderSelectorProps {
  previewImage?: string | null;
}

function BorderSelector({ previewImage }: BorderSelectorProps) {
  const { selectedBorder, setBorder } = useWorkCardStore();

  const getPreviewStyle = (border: Border) => {
    if (border.id === 'none') return { border: 'none' };
    return {
      border: `${Math.max(4, border.width / 4)}px solid ${border.color}`,
      boxShadow: border.id === 'gold' ? 'inset 0 0 0 2px #B8860B' : 'none',
    };
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">边框样式</h3>
      <div className="grid grid-cols-5 gap-3">
        {BORDERS.map((border) => {
          const isSelected = selectedBorder?.id === border.id;
          return (
            <button
              key={border.id}
              onClick={() => setBorder(border)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:opacity-80'
              }`}
            >
              <div
                className="w-full h-16 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center"
                style={getPreviewStyle(border)}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={border.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-300 rounded" />
                )}
              </div>
              <span className="block text-xs text-gray-600 mt-1 text-center">{border.name}</span>
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

export default BorderSelector;
