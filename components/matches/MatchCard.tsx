import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Match } from "@/lib/types";
import { calculatePricing, formatCurrency } from "@/lib/utils";

export function MatchCard({ match }: { match: Match }) {
  const router = useRouter();
  const progress = Math.min(100, (match.joined_players / match.max_players) * 100);
  const pricing = calculatePricing(match.total_cost, match.max_players);
  const spotsLeft = Math.max(match.max_players - match.joined_players, 0);
  const startsAt = new Date(`${match.date}T${match.start_time}:00`);
  const hoursUntilStart = (startsAt.getTime() - Date.now()) / (1000 * 60 * 60);
  const startsSoon = hoursUntilStart > 0 && hoursUntilStart <= 2;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/matches/${match.id}`)}
      className="rounded-lgCard border border-border bg-card p-4 shadow-card"
    >
      <View className="gap-3">
        <View className="flex-row items-start justify-between">
          <Text className="text-[12px] font-black uppercase tracking-[1px] text-primary">{match.type}</Text>
          <Badge label={match.status} tone={match.status === "Open" ? "green" : "red"} />
        </View>

        <Text className="text-[16px] font-black text-textPrimary">{match.title}</Text>

        <Text className="text-[13px] text-textSecondary">
          📍 {match.location} · 🗓 {match.date} · ⏰ {match.start_time}
        </Text>

        {spotsLeft <= 2 && spotsLeft > 0 ? (
          <Text className="text-[13px] font-bold text-warning">🔥 {spotsLeft} spots left</Text>
        ) : null}
        {startsSoon ? <Text className="text-[13px] font-bold text-warning">⚡ Starting soon</Text> : null}

        <View className="h-2 overflow-hidden rounded-pill bg-primaryLight">
          <View className="h-2 rounded-pill bg-primary" style={{ width: `${progress}%` }} />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] font-semibold text-textSecondary">
            {spotsLeft} of {match.max_players} spots left
          </Text>
          {match.total_cost === 0 ? (
            <Badge label="FREE" tone="green" />
          ) : (
            <Text className="text-[18px] font-black text-primary">{formatCurrency(pricing.total)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
