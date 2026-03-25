import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { RatingSelection } from "@/lib/types";

const positiveTags = ["Great attitude", "Always on time", "Good communicator", "Skilled player", "Fair play", "Reliable"];
const negativeTags = ["Late arrival", "No-show", "Poor attitude", "Rough play", "Ball hog", "Poor communication"];

function RatingPill({
  active,
  label,
  onPress,
  tone,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  tone: "up" | "down";
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => {
          scale.value = withSpring(1.1, { damping: 8 }, () => {
            scale.value = withSpring(1);
          });
          onPress();
        }}
        className={`rounded-pill px-4 py-2 ${active ? (tone === "up" ? "bg-primary" : "bg-error") : "bg-surface"}`}
      >
        <Text className={`font-bold ${active ? "text-card" : "text-textSecondary"}`}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function RatePlayersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches, profile, submitRatings } = useApp();
  const [ratings, setRatings] = useState<RatingSelection>({});
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const match = matches.find((item) => item.id === id);
  const teammates = useMemo(
    () => match?.players.filter((player) => player.profile_id !== profile?.id) ?? [],
    [match, profile?.id],
  );

  if (!match) return null;

  const ratedCount = Object.values(ratings).filter(Boolean).length;
  const progress = teammates.length ? (ratedCount / teammates.length) * 100 : 0;

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-[56px] text-primary">✓</Text>
        <Text className="mt-4 text-center text-[26px] font-black text-textPrimary">Thanks for rating! Your score has been updated.</Text>
        <View className="mt-8 w-full">
          <Button title="Back to Home" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Rate Your Teammates" subtitle={match.title} showBack />

      <Text className="text-[14px] font-semibold text-textSecondary">
        Rated {ratedCount} of {teammates.length} players
      </Text>
      <View className="mt-3 h-2 overflow-hidden rounded-pill bg-primaryLight">
        <View className="h-2 rounded-pill bg-primary" style={{ width: `${progress}%` }} />
      </View>

      <Card className="mt-4 border-primaryBorder bg-primaryLight">
        <Text className="text-[14px] leading-6 text-primary">
          Your ratings directly affect player reliability scores. Rate honestly — the community depends on it.
        </Text>
      </Card>

      <View className="mt-4 gap-4">
        {teammates.map((player) => (
          <Card key={player.id} className="gap-3">
            <View className="flex-row items-center gap-3">
              <Avatar initials={player.initials} />
              <Text className="flex-1 text-[15px] font-bold text-textPrimary">{player.full_name}</Text>
              <View className="flex-row gap-2">
                <RatingPill
                  label="👍"
                  tone="up"
                  active={ratings[player.profile_id] === "up"}
                  onPress={() => setRatings((prev) => ({ ...prev, [player.profile_id]: "up" }))}
                />
                <RatingPill
                  label="👎"
                  tone="down"
                  active={ratings[player.profile_id] === "down"}
                  onPress={() => setRatings((prev) => ({ ...prev, [player.profile_id]: "down" }))}
                />
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-[18px] font-bold text-textPrimary">Tag what stood out</Text>
        <View className="flex-row flex-wrap gap-2">
          {positiveTags.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => setTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
              className={`rounded-pill border px-4 py-2 ${
                tags.includes(tag) ? "border-primaryBorder bg-primaryLight" : "border-border bg-card"
              }`}
            >
              <Text className={`text-[13px] font-semibold ${tags.includes(tag) ? "text-primary" : "text-textSecondary"}`}>{tag}</Text>
            </Pressable>
          ))}
          {negativeTags.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => setTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
              className={`rounded-pill border px-4 py-2 ${tags.includes(tag) ? "border-error bg-surface" : "border-border bg-card"}`}
            >
              <Text className={`text-[13px] font-semibold ${tags.includes(tag) ? "text-error" : "text-textSecondary"}`}>{tag}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-6">
        <Button
          title={`Submit ${ratedCount} Rating${ratedCount === 1 ? "" : "s"}`}
          disabled={ratedCount < 1}
          onPress={async () => {
            await submitRatings(ratings, tags);
            setSubmitted(true);
          }}
        />
      </View>
    </ScrollView>
  );
}
