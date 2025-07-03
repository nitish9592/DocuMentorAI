import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString();
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Finance: "bg-green-100 text-green-800",
    Marketing: "bg-purple-100 text-purple-800",
    Technical: "bg-blue-100 text-blue-800",
    Legal: "bg-yellow-100 text-yellow-800",
    HR: "bg-orange-100 text-orange-800",
    Operations: "bg-gray-100 text-gray-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

export function getStatusColor(hasAI: boolean): string {
  return hasAI 
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
}

export function getStatusText(hasAI: boolean): string {
  return hasAI ? "AI Summary Available" : "Processing Summary";
}
