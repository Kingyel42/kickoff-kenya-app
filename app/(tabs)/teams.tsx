import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { TeamFilter } from "@/lib/types";

const filters: TeamFilter[] = ["My Teams", "Discover", "Recruiting"];

export default function TeamsScreen() {
  const { teams, profile } = useApp();
  const [filter, setFilter] = useState<TeamFilter>("My Teams");

  const visibleTeams = useMemo(() => {
    if (filter === "Recruiting") return teams.filter((team) => team.recruiting);
    if (filter === "Discover") return teams.filter((team) => team.city === profile?.city);
    return teams.filter((team) => team.role !== "Recruiting");
  }, [filter, profile?.city, teams]);

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>Teams</Text>
        <Pressable style={styles.plusButton}>
          <Feather color={colors.primary} name="plus" size={20} />
        </Pressable>
      </View>

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

      {visibleTeams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>You&apos;re not in any teams yet</Text>
          <Button title="Create a Team" onPress={() => undefined} />
          <Pressable>
            <Text style={styles.emptyLink}>Or discover teams near you</Text>
          </Pressable>
        </View>
      ) : (
        visibleTeams.map((team) => (
          <Card key={team.id} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Avatar initials={team.initials} />
              <View style={{ flex: 1 }}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamLocation}>{team.city}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{team.role}</Text>
              </View>
            </View>
            <View style={styles.teamStats}>
              <TeamStat label="Matches" value={team.matches} />
              <TeamStat label="Wins" value={team.wins} />
              <TeamStat label="Win Rate" value={`${team.win_rate}%`} />
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

function TeamStat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 30,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
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
  emptyState: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 20,
    gap: 12,
    alignItems: "center",
  },
  emptyTitle: {
    ...typography.h3,
    textAlign: "center",
  },
  emptyLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  teamCard: {
    gap: 16,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  teamLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  teamStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCell: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
