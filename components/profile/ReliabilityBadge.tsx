import React from "react";
import { Text, View } from "react-native";

import { getReliabilityMeta } from "@/lib/utils";

export function ReliabilityBadge({ score }: { score: number }) {
  const meta = getReliabilityMeta(score);
  return (
    <View className="self-start rounded-pill border border-primaryBorder bg-primaryLight px-3 py-1.5">
      <Text className="text-[12px] font-bold" style={{ color: meta.color }}>
        {meta.badge} · Score {score}
      </Text>
    </View>
  );
}
