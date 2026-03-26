import React from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

import { colors } from "@/constants/colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "muted" | "ghost";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const textColor = variant === "primary" ? colors.white : variant === "muted" ? colors.textSecondary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        variant === "muted" && styles.muted,
        variant === "ghost" && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && !(disabled || loading) && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.label, { color: textColor }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
  },
  muted: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});
