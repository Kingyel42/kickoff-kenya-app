import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onRightPress?: () => void;
  showBack?: boolean;
};

export function ScreenHeader({ title, subtitle, rightLabel, onRightPress, showBack = false }: Props) {
  const router = useRouter();

  return (
    <View className="mb-5 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-3">
        {showBack ? (
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-card">
            <Feather name="arrow-left" size={18} color="#1A1A18" />
          </Pressable>
        ) : null}
        <View className="flex-1">
          <Text className="text-[28px] font-black text-textPrimary">{title}</Text>
          {subtitle ? <Text className="mt-1 text-[14px] text-textSecondary">{subtitle}</Text> : null}
        </View>
      </View>
      {rightLabel ? (
        <Pressable onPress={onRightPress} className="rounded-pill border border-primaryBorder bg-primaryLight px-3 py-2">
          <Text className="font-bold text-primary">{rightLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
