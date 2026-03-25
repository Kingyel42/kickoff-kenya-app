import React from "react";
import { Text, View } from "react-native";

type BadgeProps = {
  label: string;
  tone?: "green" | "red" | "amber" | "neutral";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const tones = {
    green: {
      container: "bg-primaryLight border-primaryBorder",
      text: "text-primary",
    },
    red: {
      container: "bg-card border-error",
      text: "text-error",
    },
    amber: {
      container: "bg-card border-warning",
      text: "text-warning",
    },
    neutral: {
      container: "bg-surface border-border",
      text: "text-textSecondary",
    },
  } as const;

  return (
    <View className={`rounded-pill border px-3 py-1 ${tones[tone].container}`}>
      <Text className={`text-[12px] font-bold uppercase tracking-[0.6px] ${tones[tone].text}`}>{label}</Text>
    </View>
  );
}
