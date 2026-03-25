import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { getInitials, getReliabilityMeta } from "@/lib/utils";

const reliabilityMessage = (score: number) => {
  if (score >= 90) return "🏆 Top tier — you get priority on waitlists";
  if (score >= 70) return "✓ Good standing — keep it up";
  if (score >= 50) return "⚠ At risk — show up to your next match";
  return "✗ Restricted — you cannot join paid matches until your score recovers above 50";
};

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, activities, signOut } = useApp();

  if (!profile) return null;

  const reliability = getReliabilityMeta(profile.reliability_score);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-[28px] font-black text-textPrimary">Profile</Text>
        <Pressable onPress={() => router.push("/settings")} className="rounded-full bg-card p-3">
          <Feather name="settings" size={18} color="#1A1A18" />
        </Pressable>
      </View>

      <Card className="mb-4 items-center gap-3">
        <View>
          <Avatar initials={getInitials(profile.full_name)} size="lg" />
          {profile.verified ? <Text className="absolute -bottom-1 -right-1 rounded-full bg-primary px-2 py-1 text-card">✓</Text> : null}
        </View>
        <Text className="text-[24px] font-black text-textPrimary">{profile.full_name}</Text>
        <Text className="text-[14px] text-textSecondary">@{profile.username} · {profile.city}</Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          <Text className="rounded-pill bg-surface px-3 py-1.5 text-[12px] font-bold text-textSecondary">{profile.position}</Text>
          <Text className="rounded-pill bg-surface px-3 py-1.5 text-[12px] font-bold text-textSecondary">{profile.skill_level}</Text>
        </View>
      </Card>

      <Card className="mb-4 gap-4 border-primaryBorder">
        <Text className="text-[18px] font-bold text-textPrimary">Reliability Score</Text>
        <Text className="text-[42px] font-black" style={{ color: reliability.color }}>
          {profile.reliability_score}/100
        </Text>
        <View className="h-3 overflow-hidden rounded-pill bg-surface">
          <View className="h-3 rounded-pill" style={{ width: `${profile.reliability_score}%`, backgroundColor: reliability.color }} />
        </View>
        <Text className="text-[14px] leading-6" style={{ color: reliability.color }}>
          {reliabilityMessage(profile.reliability_score)}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {["⭐ Elite", "✓ Good", "⚠ Caution", "✗ Restricted"].map((tier) => (
            <Text key={tier} className="rounded-pill bg-surface px-3 py-1 text-[12px] font-semibold text-textSecondary">
              {tier}
            </Text>
          ))}
        </View>
      </Card>

      <Card className="mb-4">
        <View className="flex-row justify-between">
          {[
            { label: "Matches", value: profile.matches },
            { label: "Wins", value: profile.wins },
            { label: "Goals", value: profile.goals },
            { label: "Rating", value: profile.rating },
          ].map((stat) => (
            <View key={stat.label} className="items-center">
              <Text className="text-[12px] text-textHint">{stat.label}</Text>
              <Text className="mt-1 text-[18px] font-black text-textPrimary">{stat.value}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View className="mb-4">
        <Text className="mb-3 text-[20px] font-black text-textPrimary">Recent Activity</Text>
        <View className="gap-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] font-bold text-textPrimary">{activity.match_name}</Text>
                <Text
                  className={`rounded-pill px-3 py-1 text-[12px] font-bold ${
                    activity.result === "WIN"
                      ? "bg-primaryLight text-primary"
                      : activity.result === "DRAW"
                        ? "bg-surface text-warning"
                        : "bg-surface text-error"
                  }`}
                >
                  {activity.result}
                </Text>
              </View>
              <Text className="text-[13px] text-textSecondary">{activity.date}</Text>
              <Text className="text-[13px] text-textSecondary">
                Goals {activity.goals} · Assists {activity.assists}
              </Text>
            </Card>
          ))}
        </View>
      </View>

      <Button title="Sign Out" variant="secondary" onPress={signOut} />
    </ScrollView>
  );
}
