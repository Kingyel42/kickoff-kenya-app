import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/styles";
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
          scale.value = withSpring(1.08, { damping: 8 }, () => {
            scale.value = withSpring(1);
          });
          onPress();
        }}
        style={[
          styles.ratingPill,
          active && tone === "up" && styles.ratingPillUpActive,
          active && tone === "down" && styles.ratingPillDownActive,
        ]}
      >
        <Text style={[styles.ratingPillText, active && styles.ratingPillTextActive]}>{label}</Text>
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
      <View style={[layout.screen, styles.submittedScreen]}>
        <Text style={styles.submittedMark}>✓</Text>
        <Text style={styles.submittedTitle}>Thanks for rating! Your score has been updated.</Text>
        <View style={styles.submittedButtonWrap}>
          <Button title="Back to Home" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <ScreenHeader title="Rate Your Teammates" subtitle={match.title} showBack />

      <Text style={styles.progressText}>
        Rated {ratedCount} of {teammates.length} players
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          Your ratings directly affect player reliability scores. Rate honestly, the community depends on it.
        </Text>
      </Card>

      <View style={styles.playerList}>
        {teammates.map((player) => (
          <Card key={player.id} style={styles.playerCard}>
            <View style={styles.playerRow}>
              <Avatar initials={player.initials} />
              <Text style={styles.playerName}>{player.full_name}</Text>
              <View style={styles.pillRow}>
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

      <View style={styles.tagsSection}>
        <Text style={styles.tagsTitle}>Tag what stood out</Text>
        <View style={styles.tagsWrap}>
          {positiveTags.map((tag) => {
            const active = tags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => setTags((prev) => (active ? prev.filter((item) => item !== tag) : [...prev, tag]))}
                style={[styles.tag, active ? styles.positiveTagActive : styles.tagDefault]}
              >
                <Text style={[styles.tagText, active && styles.positiveTagTextActive]}>{tag}</Text>
              </Pressable>
            );
          })}
          {negativeTags.map((tag) => {
            const active = tags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => setTags((prev) => (active ? prev.filter((item) => item !== tag) : [...prev, tag]))}
                style={[styles.tag, active ? styles.negativeTagActive : styles.tagDefault]}
              >
                <Text style={[styles.tagText, active && styles.negativeTagTextActive]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.submitWrap}>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  submittedScreen: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  submittedMark: {
    fontSize: 56,
    color: colors.primary,
  },
  submittedTitle: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
    textAlign: "center",
  },
  submittedButtonWrap: {
    marginTop: 32,
    width: "100%",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  progressTrack: {
    marginTop: 12,
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
  infoCard: {
    marginTop: 16,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.primary,
  },
  playerList: {
    marginTop: 16,
    gap: 16,
  },
  playerCard: {
    gap: 12,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  ratingPill: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  ratingPillUpActive: {
    backgroundColor: colors.primary,
  },
  ratingPillDownActive: {
    backgroundColor: colors.error,
  },
  ratingPillText: {
    fontWeight: "700",
    color: colors.textSecondary,
  },
  ratingPillTextActive: {
    color: colors.white,
  },
  tagsSection: {
    marginTop: 24,
  },
  tagsTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagDefault: {
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  positiveTagActive: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryLight,
  },
  negativeTagActive: {
    borderColor: colors.error,
    backgroundColor: colors.surface,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  positiveTagTextActive: {
    color: colors.primary,
  },
  negativeTagTextActive: {
    color: colors.error,
  },
  submitWrap: {
    marginTop: 24,
  },
});
