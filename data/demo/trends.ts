import { InfrastructureDemandItem, TrendDataPoint } from "@/types/civic";

export const DEMO_INFRASTRUCTURE_DEMAND: InfrastructureDemandItem[] = [
  { category: "Roads", percentage: 28, signalCount: 1479, color: "var(--accent)" },
  { category: "Drainage", percentage: 22, signalCount: 1162, color: "var(--primary)" },
  { category: "Water", percentage: 16, signalCount: 845, color: "#0ea5e9" },
  { category: "Healthcare", percentage: 12, signalCount: 634, color: "#10b981" },
  { category: "Streetlights", percentage: 9, signalCount: 476, color: "#f59e0b" },
  { category: "Education", percentage: 8, signalCount: 423, color: "#8b5cf6" },
  { category: "Waste Management", percentage: 5, signalCount: 265, color: "#64748b" },
];

export const DEMO_30_DAY_TRENDS: TrendDataPoint[] = [
  { day: "Day 1", date: "Aug 30", signals: 142, critical: 18 },
  { day: "Day 3", date: "Sep 01", signals: 156, critical: 22 },
  { day: "Day 5", date: "Sep 03", signals: 148, critical: 19 },
  { day: "Day 7", date: "Sep 05", signals: 164, critical: 25 },
  { day: "Day 9", date: "Sep 07", signals: 172, critical: 27 },
  { day: "Day 11", date: "Sep 09", signals: 158, critical: 21 },
  { day: "Day 13", date: "Sep 11", signals: 185, critical: 32 },
  { day: "Day 15", date: "Sep 13", signals: 179, critical: 28 },
  { day: "Day 17", date: "Sep 15", signals: 194, critical: 35 },
  { day: "Day 19", date: "Sep 17", signals: 210, critical: 44 }, // Monsoon surge
  { day: "Day 21", date: "Sep 19", signals: 228, critical: 49 },
  { day: "Day 23", date: "Sep 21", signals: 205, critical: 41 },
  { day: "Day 25", date: "Sep 23", signals: 192, critical: 38 },
  { day: "Day 27", date: "Sep 25", signals: 188, critical: 36 },
  { day: "Day 29", date: "Sep 27", signals: 195, critical: 39 },
  { day: "Day 30", date: "Sep 28", signals: 204, critical: 42 },
];
