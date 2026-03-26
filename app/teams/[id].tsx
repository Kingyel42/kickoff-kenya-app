import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/styles";
import { useApp } from "@/lib/app-context";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { teams } = useApp();
  const team = teams.find((item) => item.id === id);

  if (!team) return null;

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <ScreenHeader title={team.name} subtitle={team.city} showBack />
      <Card style={styles.heroCard}>
        <Avatar initials={team.initials} size="lg" />
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamMeta}>
          {team.role} · {team.skill_level}
        </Text>
      </Card>
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Team Stats</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Matches {team.matches}</Text>
          <Text style={styles.statText}>Wins {team.wins}</Text>
          <Text style={styles.winRate}>Win Rate {team.win_rate}%</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  heroCard: {
    alignItems: "center",
    gap: 12,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  teamMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    marginTop: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  winRate: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
