import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "muted" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  className = "",
}: ButtonProps) {
  const styles = {
    primary: "bg-primary border-primary",
    secondary: "bg-primaryLight border-primaryBorder",
    ghost: "bg-transparent border-transparent",
    muted: "bg-surface border-border",
    outline: "bg-transparent border-primary",
  } as const;

  const textStyles = {
    primary: "text-card",
    secondary: "text-primary",
    ghost: "text-primary",
    muted: "text-textSecondary",
    outline: "text-primary",
  } as const;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      className={`${fullWidth ? "w-full" : ""} min-h-14 rounded-button border px-4 py-4 ${styles[variant]} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? <ActivityIndicator color={variant === "primary" ? colors.card : colors.primary} /> : null}
        <Text className={`text-center text-[15px] font-extrabold ${textStyles[variant]}`}>{title}</Text>
      </View>
    </Pressable>
  );
}
