import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { TeamFilter } from "@/lib/types";

const tabs: TeamFilter[] = ["My Teams", "Discover", "Recruiting"];
const skillFilters = ["All", "Beginner", "Intermediate", "Advanced", "Pro"];

export default function TeamsScreen() {
  const router = useRouter();
  const { teams, profile } = useApp();
  const [tab, setTab] = useState<TeamFilter>("My Teams");
  const [skill, setSkill] = useState("All");

  const filtered = useMemo(() => {
    let next = teams;
    if (tab === "My Teams") next = teams.filter((team) => team.role !== "Recruiting");
    if (tab === "Discover") next = teams.filter((team) => team.city === profile?.city);
    if (tab === "Recruiting") next = teams.filter((team) => team.recruiting);
    if (skill !== "All") next = next.filter((team) => team.skill_level === skill);
    return next;
  }, [tab, skill, teams, profile?.city]);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Teams" rightLabel="+" onRightPress={() => {}} />

      <View className="mb-4 flex-row gap-2">
        {tabs.map((item) => (
          <Text
            key={item}
            onPress={() => setTab(item)}
            className={`rounded-pill border px-4 py-2 font-bold ${
              item === tab ? "border-primaryBorder bg-primaryLight text-primary" : "border-border bg-card text-textSecondary"
            }`}
          >
            {item}
          </Text>
        ))}
      </View>

      {tab === "Discover" ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {skillFilters.map((item) => (
              <Text
                key={item}
                onPress={() => setSkill(item)}
                className={`rounded-pill border px-4 py-2 text-[13px] font-bold ${
                  item === skill ? "border-primaryBorder bg-primaryLight text-primary" : "border-border bg-card text-textSecondary"
                }`}
              >
                {item}
              </Text>
            ))}
          </View>
        </ScrollView>
      ) : null}

      <View className="gap-4">
        {filtered.length ? (
          filtered.map((team) => (
            <Card key={team.id} className="gap-4">
              <Pressable onPress={() => router.push(`/teams/${team.id}`)}>
                <View className="flex-row items-center gap-3">
                  <Avatar initials={team.initials} />
                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-textPrimary">{team.name}</Text>
                    <Text className="text-[13px] text-textSecondary">{team.city}</Text>
                  </View>
                  <Text className="rounded-pill bg-primaryLight px-3 py-1 text-[12px] font-bold text-primary">{team.role}</Text>
                </View>
              </Pressable>

              <View className="flex-row justify-between">
                <Text className="text-[13px] text-textSecondary">Matches {team.matches}</Text>
                <Text className="text-[13px] text-textSecondary">Wins {team.wins}</Text>
                <Text className="text-[13px] font-bold text-primary">Win Rate {team.win_rate}%</Text>
              </View>
            </Card>
          ))
        ) : (
          <Card className="items-center gap-4 py-8">
            <Text className="text-center text-[20px] font-black text-textPrimary">You&apos;re not in any teams yet</Text>
            <Pressable className="rounded-button bg-primary px-5 py-4">
              <Text className="font-bold text-card">Create a Team</Text>
            </Pressable>
            <Text className="text-[14px] font-bold text-primary">Or discover teams near you</Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
