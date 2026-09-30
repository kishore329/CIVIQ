export type NavigationItemId =
  | "overview"
  | "citizen-signals"
  | "development-map"
  | "priority-projects"
  | "what-if-simulator"
  | "evidence-center"
  | "ai-copilot"
  | "data-sources"
  | "ai-status"
  | "settings";

export interface NavItem {
  id: NavigationItemId;
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "primary" | "warning" | "neutral";
  section?: "main" | "system";
}
