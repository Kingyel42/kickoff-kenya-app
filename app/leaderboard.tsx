import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { useApp } from "@/lib/app-context";

const filters = ["Top Scorers", "Most Wins", "Top Rated", "Assists"];

export default function LeaderboardScreen() {
  const { leaderboard, profile } = useApp();
  const [filter, setFilter] = useState("Top Scorers");

  const data = useMemo(
    () =>
      leaderboard.map((entry, index) => ({
        ...entry,
        value:
          filter === "Most Wins"
            ? 12 - index
            : filter === "Top Rated"
              ? Number((4.9 - index * 0.1).toFixed(1))
              : filter === "Assists"
                ? 8 - index
                : entry.value,
      })),
    [filter, leaderboard],
  );

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Leaderboard" subtitle={`${profile?.city ?? "Kenya"} · This Month`} showBack />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
        <View className="flex-row gap-2">
          {filters.map((item) => (
            <Text
              key={item}
              onPress={() => setFilter(item)}
              className={`rounded-pill border px-4 py-2 font-bold ${
                item === filter ? "border-primaryBorder bg-primaryLight text-primary" : "border-border bg-card text-textSecondary"
              }`}
            >
              {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View className="gap-3">
        {data.map((entry) => (
          <View
            key={entry.id}
            className={`flex-row items-center rounded-lgCard border px-4 py-3 ${
              entry.isCurrentUser ? "border-primaryBorder bg-primaryLight" : "border-border bg-card"
            }`}
          >
            <Text className="w-10 text-[18px] font-black text-textPrimary">
              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
            </Text>
            <Avatar initials={entry.initials} />
            <View className="ml-3 flex-1">
              <Text className="text-[15px] font-bold text-textPrimary">{entry.name}</Text>
              <Text className="text-[13px] text-textSecondary">
                {entry.position} · {entry.location}
              </Text>
            </View>
            <Text className="text-[18px] font-black text-primary">{entry.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
