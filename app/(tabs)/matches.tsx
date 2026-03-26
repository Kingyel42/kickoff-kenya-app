import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";

const filters = ["All", "Pickup", "Competitive", "Free", "5v5", "7v7"] as const;

export default function MatchesScreen() {
  const router = useRouter();
  const { matches, refreshData, profile } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [refreshing, setRefreshing] = useState(false);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (filter === "All") return true;
      if (filter === "Free") return match.total_cost === 0;
      if (filter === "5v5") return match.format === "5-a-side";
      if (filter === "7v7") return match.format === "7-a-side";
      return match.type === filter;
    });
  }, [filter, matches]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={layout.screen}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={typography.h1}>Matches</Text>
        <Pressable onPress={() => router.push("/matches/create")} style={styles.plusButton}>
          <Feather color={colors.primary} name="plus" size={20} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filters.map((item) => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.list}>
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏟️</Text>
            <Text style={styles.emptyTitle}>No matches yet in your city</Text>
            <Text style={styles.emptyText}>Be the first to create one — it takes 30 seconds</Text>
            <Button title="Create a Match" onPress={() => router.push("/matches/create")} />
            <Pressable onPress={() => setFilter("All")}>
              <Text style={styles.emptyLink}>Browse all cities instead</Text>
            </Pressable>
          </View>
        )}
      </View>

      {profile ? <Text style={styles.footerNote}>Showing matches for {profile.city}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 30,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
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
    gap: 12,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    ...typography.h3,
    textAlign: "center",
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
  },
  emptyLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  footerNote: {
    ...typography.caption,
    textAlign: "center",
  },
});
