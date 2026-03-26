import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { getReliabilityMeta } from "@/lib/utils";

export function ReliabilityBadge({ score }: { score: number }) {
  const meta = getReliabilityMeta(score);
  const palette =
    meta.tier === "Restricted"
      ? { backgroundColor: "#FDE9E7", borderColor: colors.error, color: colors.error }
      : meta.tier === "Caution"
        ? { backgroundColor: "#FEF9E8", borderColor: colors.warning, color: colors.warning }
        : { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder, color: meta.color };

  return (
    <View style={[styles.badge, { backgroundColor: palette.backgroundColor, borderColor: palette.borderColor }]}>
      <Text style={[styles.text, { color: palette.color }]}>{meta.badge}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
