import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ReliabilityBadge } from "@/components/profile/ReliabilityBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { getReliabilityMeta } from "@/lib/utils";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, activities, signOut } = useApp();

  if (!profile) {
    return (
      <View style={[layout.screen, layout.center]}>
        <Text style={typography.body}>Profile unavailable.</Text>
      </View>
    );
  }

  const reliabilityMeta = getReliabilityMeta(profile.reliability_score);
  const progress = Math.max(0, Math.min(100, profile.reliability_score));

  const motivation =
    profile.reliability_score >= 90
      ? "🏆 Top tier — you get priority on waitlists"
      : profile.reliability_score >= 70
        ? "✓ Good standing — keep it up"
        : profile.reliability_score >= 50
          ? "⚠ At risk — show up to your next match"
          : "✗ Restricted — you cannot join paid matches until your score recovers above 50";

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>Profile</Text>
        <Pressable onPress={() => router.push("/settings")} style={styles.settingsButton}>
          <Feather color={colors.primary} name="settings" size={18} />
        </Pressable>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.profileTop}>
          <Avatar initials={profile.full_name.slice(0, 2).toUpperCase()} size="lg" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.full_name}</Text>
            <Text style={styles.profileHandle}>@{profile.username} · {profile.city}</Text>
          </View>
        </View>
        <View style={styles.badgesRow}>
          <ReliabilityBadge score={profile.reliability_score} />
          <View style={styles.neutralPill}>
            <Text style={styles.neutralPillText}>{profile.position}</Text>
          </View>
          <View style={styles.neutralPill}>
            <Text style={styles.neutralPillText}>{profile.skill_level}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.scoreLabel}>Reliability Score</Text>
        <Text style={[styles.scoreValue, { color: reliabilityMeta.color }]}>{profile.reliability_score}/100</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: reliabilityMeta.color }]} />
        </View>
        <Text style={[styles.motivationText, { color: reliabilityMeta.color }]}>{motivation}</Text>
      </Card>

      <View style={styles.statsGrid}>
        {[
          { label: "Matches", value: profile.matches },
          { label: "Wins", value: profile.wins },
          { label: "Goals", value: profile.goals },
          { label: "Rating", value: profile.rating },
        ].map((item) => (
          <Card key={item.label} style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>Recent Activity</Text>
        {activities.map((activity) => {
          const badgeColor =
            activity.result === "WIN"
              ? colors.primary
              : activity.result === "DRAW"
                ? colors.warning
                : colors.error;

          return (
            <Card key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{activity.match_name}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <View style={[styles.resultBadge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.resultBadgeText}>{activity.result}</Text>
                </View>
              </View>
              <Text style={styles.activityStats}>
                {activity.goals} goals · {activity.assists} assists
              </Text>
            </Card>
          );
        })}
      </View>

      <Button title="Sign Out" variant="outline" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    gap: 16,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  profileHandle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  neutralPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  neutralPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scoreLabel: {
    ...typography.label,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: "900",
  },
  progressTrack: {
    marginTop: 14,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
  },
  motivationText: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  section: {
    gap: 12,
  },
  activityCard: {
    gap: 10,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  activityDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  activityStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultBadgeText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
});
