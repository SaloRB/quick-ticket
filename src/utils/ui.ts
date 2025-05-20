import type { Priority } from "@/generated/prisma";

export function getPriorityClass(priority: Priority) {
  switch (priority) {
    case "High":
      return "text-red-600 font-bold";
    case "Medium":
      return "text-yellow-600 font-bold";
    case "Low":
      return "text-green-600 font-bold";
  }
}
