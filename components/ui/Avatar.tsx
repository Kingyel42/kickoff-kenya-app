import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 18 },
} as const;

export function Avatar({ initials, size = "md" }: AvatarProps) {
  return (
    <View style={[styles.base, size === "sm" && styles.sm, size === "md" && styles.md, size === "lg" && styles.lg]}>
      <Text style={[styles.text, { fontSize: sizeMap[size].fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    color: colors.primary,
  },
  sm: {
    width: 36,
    height: 36,
  },
  md: {
    width: 48,
    height: 48,
  },
  lg: {
    width: 64,
    height: 64,
  },
});
