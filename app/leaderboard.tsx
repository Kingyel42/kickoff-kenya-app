import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { LeaderboardFilter } from "@/lib/types";

const filters: LeaderboardFilter[] = ["Top Scorers", "Most Wins", "Top Rated", "Assists"];

export default function LeaderboardScreen() {
  const { leaderboard, profile } = useApp();
  const [filter, setFilter] = useState<LeaderboardFilter>("Top Scorers");

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
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <Text style={typography.h1}>Leaderboard</Text>
      <Text style={styles.subtitle}>{profile?.city ?? "Kenya"} · This Month</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filters.map((item) => {
            const active = item === filter;
            return (
              <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterPill, active && styles.filterPillActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.list}>
        {data.map((entry) => (
          <Card key={entry.id} style={[styles.row, entry.isCurrentUser && styles.currentUserRow]}>
            <Text style={styles.rank}>
              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
            </Text>
            <Avatar initials={entry.initials} />
            <View style={styles.playerBlock}>
              <Text style={styles.playerName}>{entry.name}</Text>
              <Text style={styles.playerMeta}>{entry.position} · {entry.location}</Text>
            </View>
            <Text style={styles.value}>{entry.value}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 14,
  },
  subtitle: {
    ...typography.body,
    marginTop: -10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 12,
  },
  filterPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.primary,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currentUserRow: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  rank: {
    width: 38,
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  playerBlock: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  playerMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
});
