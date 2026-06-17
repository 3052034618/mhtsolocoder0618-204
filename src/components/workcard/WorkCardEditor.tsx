import { useEffect, useRef, useState } from 'react';
import { Upload, Download, Share2, Image as ImageIcon } from 'lucide-react';
import { useWorkCardStore } from '../../store/useWorkCardStore';
import FilterSelector, { applyFilter } from './FilterSelector';
import BorderSelector, { drawBorder } from './BorderSelector';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

function WorkCardEditor() {
  const {
    currentImage,
    selectedFilter,
    selectedBorder,
    courseName,
    workshopName,
    setCurrentImage,
    setCourseName,
    setWorkshopName,
  } = useWorkCardStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCurrentImage(result);
      setImageLoaded(true);
    };
    reader.readAsDataURL(file);
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.85;

    const gradient = ctx.createLinearGradient(0, height - 100, 0, height);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 100, width, 100);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (courseName) {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(courseName, 20, height - 55);
    }

    if (workshopName) {
      ctx.font = '14px sans-serif';
      ctx.globalAlpha = 0.75;
      ctx.fillText(workshopName, 20, height - 30);
    }

    ctx.restore();
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!currentImage) {
      ctx.fillStyle = '#d1d5db';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('请上传作品图片', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
      const x = (CANVAS_WIDTH - img.width * scale) / 2;
      const y = (CANVAS_HEIGHT - img.height * scale) / 2;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      if (selectedFilter && selectedFilter.id !== 'none') {
        applyFilter(ctx, selectedFilter.id, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (selectedBorder) {
        drawBorder(ctx, selectedBorder, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      drawWatermark(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
    img.src = currentImage;
  };

  useEffect(() => {
    if (currentImage) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        renderCanvas();
      };
      img.src = currentImage;
    }
  }, []);

  useEffect(() => {
    renderCanvas();
  }, [currentImage, selectedFilter, selectedBorder, courseName, workshopName]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `workcard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">作品卡编辑器</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="max-w-full"
              />
            </div>
          </div>

          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">作品图片</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
              >
                <Upload className="w-5 h-5" />
                {currentImage ? '重新上传' : '上传图片'}
              </button>

              {currentImage && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <ImageIcon className="w-4 h-4" />
                  图片已上传
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">课程名称</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="例如：陶艺入门体验课"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">工坊名称</label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="例如：陶然居陶艺工坊"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <FilterSelector previewImage={currentImage} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <BorderSelector previewImage={currentImage} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleExport}
                disabled={!currentImage}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                导出PNG
              </button>
              <button
                onClick={handleShare}
                disabled={!currentImage}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-amber-500 text-amber-500 rounded-xl hover:bg-amber-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <Share2 className="w-5 h-5" />
                {copied ? '已复制' : '分享'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkCardEditor;
