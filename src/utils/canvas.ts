export type FilterStyle = "none" | "vintage" | "film" | "japanese" | "mono" | "warm";
export type BorderStyle = "none" | "white" | "brown" | "pink" | "gold";

export function applyFilter(ctx: CanvasRenderingContext2D, width: number, height: number, filter: FilterStyle): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  switch (filter) {
    case "vintage":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.9 + 40);
        data[i + 1] = Math.min(255, g * 0.7 + 30);
        data[i + 2] = Math.min(255, b * 0.5 + 20);
      }
      break;

    case "film":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.1 - 10);
        data[i + 1] = Math.min(255, g * 0.95);
        data[i + 2] = Math.min(255, b * 1.05 + 10);
      }
      break;

    case "japanese":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.95 + 20);
        data[i + 1] = Math.min(255, g * 1.0 + 25);
        data[i + 2] = Math.min(255, b * 1.1 + 30);
      }
      break;

    case "mono":
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      break;

    case "warm":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.15);
        data[i + 1] = Math.min(255, g * 1.05);
        data[i + 2] = Math.min(255, b * 0.85);
      }
      break;

    default:
      return;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function drawBorder(ctx: CanvasRenderingContext2D, width: number, height: number, border: BorderStyle): void {
  const borderWidth = 20;

  switch (border) {
    case "white":
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
      break;

    case "brown":
      ctx.fillStyle = "#8B6F47";
      ctx.fillRect(0, 0, width, borderWidth);
      ctx.fillRect(0, height - borderWidth, width, borderWidth);
      ctx.fillRect(0, 0, borderWidth, height);
      ctx.fillRect(width - borderWidth, 0, borderWidth, height);
      ctx.fillStyle = "rgba(255, 248, 240, 0.1)";
      ctx.fillRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
      break;

    case "pink":
      ctx.strokeStyle = "#E8B4B8";
      ctx.lineWidth = borderWidth;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
      ctx.setLineDash([]);
      break;

    case "gold":
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#D4A574");
      gradient.addColorStop(0.5, "#F4E4BC");
      gradient.addColorStop(1, "#D4A574");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
      ctx.strokeStyle = "rgba(212, 165, 116, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(borderWidth + 5, borderWidth + 5, width - borderWidth * 2 - 10, height - borderWidth * 2 - 10);
      break;

    default:
      return;
  }
}

export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  courseName: string,
  workshopName: string
): void {
  const gradient = ctx.createLinearGradient(0, height - 120, 0, height);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height - 120, width, 120);

  ctx.font = "bold 22px 'Noto Serif SC', serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(courseName, width / 2, height - 60);

  ctx.font = "14px 'Noto Sans SC', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(workshopName, width / 2, height - 35);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateWorkCard(
  imageSrc: string,
  filter: FilterStyle,
  border: BorderStyle,
  courseName: string,
  workshopName: string,
  canvasWidth = 400,
  canvasHeight = 500
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.fillStyle = "#F5EFE6";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const img = await loadImage(imageSrc);
  const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
  const x = (canvasWidth - img.width * scale) / 2;
  const y = (canvasHeight - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  applyFilter(ctx, canvasWidth, canvasHeight, filter);
  drawBorder(ctx, canvasWidth, canvasHeight, border);
  drawWatermark(ctx, canvasWidth, canvasHeight, courseName, workshopName);

  return canvas.toDataURL("image/png");
}
