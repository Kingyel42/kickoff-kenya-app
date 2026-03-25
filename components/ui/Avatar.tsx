import React from "react";
import { Text, View } from "react-native";

type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "h-9 w-9 text-[12px]",
    md: "h-12 w-12 text-[14px]",
    lg: "h-16 w-16 text-[18px]",
  } as const;

  return (
    <View className={`items-center justify-center rounded-full border border-primaryBorder bg-primaryLight ${sizes[size]}`}>
      <Text className="font-extrabold text-primary">{initials}</Text>
    </View>
  );
}
