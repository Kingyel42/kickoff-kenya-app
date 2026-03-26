import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { colors } from "@/constants/colors";
import { Match } from "@/lib/types";
import { calculatePricing, formatCurrency } from "@/lib/utils";

export function MatchCard({ match }: { match: Match }) {
  const router = useRouter();
  const progress = Math.min(100, (match.joined_players / match.max_players) * 100);
  const pricing = calculatePricing(match.total_cost, match.max_players);

  return (
    <Pressable onPress={() => router.push(`/matches/${match.id}`)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <Text style={styles.type}>{match.type}</Text>
        <Badge label={match.status} tone={match.status === "Open" ? "green" : "red"} />
      </View>

      <Text style={styles.title}>{match.title}</Text>
      <Text numberOfLines={1} style={styles.meta}>
        {match.location} · {match.date} · {match.start_time}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.players}>
          {match.joined_players}/{match.max_players} players
        </Text>
        <Text style={styles.price}>{match.total_cost === 0 ? "FREE" : formatCurrency(pricing.total)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    gap: 10,
  },
  pressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.primary,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  players: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
});
