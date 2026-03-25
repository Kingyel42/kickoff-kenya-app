import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { teams } = useApp();
  const team = teams.find((item) => item.id === id);

  if (!team) return null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title={team.name} subtitle={team.city} showBack />
      <Card className="items-center gap-3">
        <Avatar initials={team.initials} size="lg" />
        <Text className="text-[24px] font-black text-textPrimary">{team.name}</Text>
        <Text className="text-[14px] text-textSecondary">{team.role} · {team.skill_level}</Text>
      </Card>
      <Card className="mt-4 gap-3">
        <Text className="text-[18px] font-bold text-textPrimary">Team Stats</Text>
        <View className="flex-row justify-between">
          <Text className="text-[14px] text-textSecondary">Matches {team.matches}</Text>
          <Text className="text-[14px] text-textSecondary">Wins {team.wins}</Text>
          <Text className="text-[14px] font-bold text-primary">Win Rate {team.win_rate}%</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
