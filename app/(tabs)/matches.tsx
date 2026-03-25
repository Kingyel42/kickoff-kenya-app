import React, { useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/app-context";

const filters = ["All", "Pickup", "Competitive", "Free", "5v5", "7v7"];

export default function MatchesScreen() {
  const router = useRouter();
  const { matches, refreshData, shouldAutoRouteFirstTimeUser, dismissFirstTimePrompt } = useApp();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!shouldAutoRouteFirstTimeUser) return;
    dismissFirstTimePrompt().catch(() => undefined);
  }, [dismissFirstTimePrompt, shouldAutoRouteFirstTimeUser]);

  const filtered = useMemo(() => {
    if (filter === "All") return matches;
    if (filter === "Free") return matches.filter((match) => match.total_cost === 0);
    if (filter === "5v5") return matches.filter((match) => match.format === "5-a-side");
    if (filter === "7v7") return matches.filter((match) => match.format === "7-a-side");
    return matches.filter((match) => match.type === filter);
  }, [filter, matches]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refreshData} tintColor="#186637" />}
    >
      <ScreenHeader title="Matches" rightLabel="+" onRightPress={() => router.push("/matches/create")} />

      {shouldAutoRouteFirstTimeUser ? (
        <Pressable onPress={dismissFirstTimePrompt} className="mb-4 rounded-lgCard border border-primaryBorder bg-primaryLight px-4 py-3">
          <Text className="text-[14px] font-semibold text-primary">👆 Tap any match to join your first game</Text>
        </Pressable>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
        <View className="flex-row gap-2">
          {filters.map((item) => (
            <Text
              key={item}
              onPress={() => setFilter(item)}
              className={`rounded-pill border px-4 py-2 text-[13px] font-bold ${
                item === filter ? "border-primaryBorder bg-primaryLight text-primary" : "border-border bg-card text-textSecondary"
              }`}
            >
              {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      {filtered.length ? (
        <View className="gap-4">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>
      ) : (
        <View className="items-center rounded-lgCard border border-dashed border-border bg-card px-6 py-10">
          <Text className="text-[42px]">🏟️</Text>
          <Text className="mt-3 text-center text-[20px] font-black text-textPrimary">No matches yet in your city</Text>
          <Text className="mt-2 text-center text-[14px] leading-6 text-textSecondary">
            Be the first to create one — it takes 30 seconds
          </Text>
          <View className="mt-6 w-full">
            <Button title="Create a Match" onPress={() => router.push("/matches/create")} />
          </View>
          <Pressable className="mt-4">
            <Text className="text-[14px] font-bold text-primary">Browse all cities instead</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
