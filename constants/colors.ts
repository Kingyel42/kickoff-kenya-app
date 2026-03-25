export const colors = {
  background: "#FAF8F3",
  card: "#FFFFFF",
  surface: "#F2EFE8",
  border: "#E0D8C8",
  primary: "#186637",
  primaryLight: "#E8F5EE",
  primaryBorder: "#B8D8C4",
  textPrimary: "#1A1A18",
  textSecondary: "#6B6050",
  textHint: "#A89880",
  error: "#C0392B",
  warning: "#B07D1A",
  success: "#186637",
  good: "#2A8C4A",
  inactiveTab: "#C8BFAE",
} as const;

export type ColorKey = keyof typeof colors;
