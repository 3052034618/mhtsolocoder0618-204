import { format, formatDistanceToNow, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatPrice(price: number): string {
  return `¥${price.toFixed(0)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "yyyy年MM月dd日", { locale: zhCN });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "MM月dd日", { locale: zhCN });
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDate(dateStr)} ${timeStr}`;
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: zhCN });
}

export function formatWeekday(dateStr: string): string {
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const date = parseISO(dateStr);
  return weekdays[date.getDay()];
}

export function formatAgeRange(min: number, max: number): string {
  if (max === 999) {
    return `${min}岁以上`;
  }
  return `${min}-${max}岁`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pottery: "陶艺",
    leather: "皮具",
    floral: "花艺",
    candle: "蜡烛",
    woodwork: "木作",
    other: "其他",
  };
  return labels[category] || category;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: "入门",
    intermediate: "进阶",
    advanced: "高级",
  };
  return labels[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: "bg-forest-100 text-forest-600",
    intermediate: "bg-candle/20 text-pottery",
    advanced: "bg-clay-100 text-clay-600",
  };
  return colors[difficulty] || "bg-sand-100 text-pottery";
}

export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    checkedin: "已签到",
    completed: "已完成",
    cancelled: "已取消",
  };
  return labels[status] || status;
}

export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-candle/20 text-pottery",
    paid: "bg-forest-100 text-forest-600",
    checkedin: "bg-clay-100 text-clay-600",
    completed: "bg-sand-200 text-pottery",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return colors[status] || "bg-sand-100 text-pottery";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
