import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: "900", color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: "900", color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: "800", color: colors.textPrimary },
  body: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  caption: { fontSize: 13, color: colors.textSecondary },
  label: { fontSize: 11, fontWeight: "700", color: colors.textHint,
           textTransform: "uppercase", letterSpacing: 0.8 },
  price: { fontSize: 20, fontWeight: "900", color: colors.primary },
});

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#1A1A18",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
