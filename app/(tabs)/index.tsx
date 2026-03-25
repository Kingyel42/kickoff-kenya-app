import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { getFirstName, getGreeting } from "@/lib/utils";

const FIRST_MATCH_TOOLTIP_DISMISSED_KEY = "first_match_tooltip_dismissed";

const quickActions = [
  { label: "Create Match", icon: "plus-circle", route: "/matches/create" as const },
  { label: "Book Turf", icon: "map-pin", route: "/(tabs)/turfs" as const },
  { label: "My Teams", icon: "users", route: "/(tabs)/teams" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, matches, refreshData, hasJoinedMatch } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  const openMatches = useMemo(() => matches.filter((match) => match.status === "Open").slice(0, 3), [matches]);

  useEffect(() => {
    const loadTooltip = async () => {
      const dismissed = await AsyncStorage.getItem(FIRST_MATCH_TOOLTIP_DISMISSED_KEY);
      setShowTooltip(!hasJoinedMatch && dismissed !== "true");
    };

    loadTooltip().catch(() => undefined);
  }, [hasJoinedMatch]);

  if (!profile) return null;

  const dismissTooltip = async () => {
    setShowTooltip(false);
    await AsyncStorage.setItem(FIRST_MATCH_TOOLTIP_DISMISSED_KEY, "true");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refreshData} tintColor="#186637" />}
      >
        <ScreenHeader
          title={`${getGreeting()}, ${getFirstName(profile.full_name)} ☀️`}
          subtitle={`${profile.city} · ${matches.filter((match) => match.status === "Open").length} open near you`}
        />

        {showTooltip ? (
          <Pressable onPress={dismissTooltip} className="mb-4 rounded-lgCard border border-primaryBorder bg-primaryLight px-4 py-3">
            <Text className="text-[14px] font-semibold text-primary">👆 Tap any match card to join your first game</Text>
          </Pressable>
        ) : null}

        <View className="mb-5">
          <Button title="Find a Game Now →" onPress={() => router.push("/(tabs)/matches")} className="shadow-card" />
        </View>

        <View className="mb-4">
          <Text className="text-[22px] font-black text-textPrimary">Open matches</Text>
        </View>

        <View className="gap-4">
          {openMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>

        <View className="mt-8 mb-4">
          <Text className="text-[22px] font-black text-textPrimary">Quick actions</Text>
        </View>

        <View className="mb-8 flex-row flex-wrap justify-between gap-y-3">
          {quickActions.map((action) => (
            <Card key={action.label} className="w-[48%] p-0">
              <Pressable onPress={() => router.push(action.route)} className="px-4 py-5">
                <Text className="text-[15px] font-bold text-textPrimary">
                  <Feather name={action.icon as never} size={16} color="#186637" /> {action.label}
                </Text>
              </Pressable>
            </Card>
          ))}
        </View>

        <Card className="gap-4">
          <Text className="text-[13px] font-semibold text-textSecondary">Your stats this month</Text>
          <Text className="text-[24px] font-black text-textPrimary">{profile.full_name}</Text>
          <View className="flex-row justify-between">
            {[
              { label: "Matches", value: profile.matches },
              { label: "Wins", value: profile.wins },
              { label: "Goals", value: profile.goals },
              { label: "Rating", value: profile.rating },
            ].map((stat) => (
              <View key={stat.label}>
                <Text className="text-[12px] text-textHint">{stat.label}</Text>
                <Text className="mt-1 text-[18px] font-black text-textPrimary">{stat.value}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-6 py-4">
        <Button title="Find a Game Now →" onPress={() => router.push("/(tabs)/matches")} />
      </View>
    </View>
  );
}
