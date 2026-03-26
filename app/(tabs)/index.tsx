import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { getFirstName, getGreeting, getReliabilityMeta } from "@/lib/utils";

const FIRST_JOIN_TOOLTIP_KEY = "home_first_join_tooltip_dismissed";

export default function HomeScreen() {
  const router = useRouter();
  const { matches, profile, refreshData, hasJoinedMatch } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const nearbyMatches = useMemo(() => matches.slice(0, 3), [matches]);
  const reliabilityMeta = getReliabilityMeta(profile?.reliability_score ?? 80);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(FIRST_JOIN_TOOLTIP_KEY).then((value) => {
      if (mounted && !hasJoinedMatch && value !== "true") setShowTooltip(true);
    });

    return () => {
      mounted = false;
    };
  }, [hasJoinedMatch]);

  const dismissTooltip = async () => {
    setShowTooltip(false);
    await AsyncStorage.setItem(FIRST_JOIN_TOOLTIP_KEY, "true");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const quickActions = [
    { label: "Create Match", icon: "plus", onPress: () => router.push("/matches/create") },
    { label: "Book Turf", icon: "map-pin", onPress: () => router.push("/(tabs)/turfs") },
    { label: "My Teams", icon: "users", onPress: () => router.push("/(tabs)/teams") },
    { label: "Leaderboard", icon: "award", onPress: () => router.push("/leaderboard") },
  ] as const;

  const stats = [
    { label: "Matches", value: profile?.matches ?? 0 },
    { label: "Wins", value: profile?.wins ?? 0 },
    { label: "Goals", value: profile?.goals ?? 0 },
    { label: "Rating", value: profile?.rating ?? 0 },
  ];

  return (
    <ScrollView
      style={layout.screen}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View>
        <Text style={styles.greeting}>
          {getGreeting()}, {getFirstName(profile?.full_name)}
        </Text>
        <Text style={styles.city}>{profile?.city ?? "Kenya"}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View>
            <Text style={styles.statsName}>{profile?.full_name ?? "KickOff Player"}</Text>
            <Text style={styles.statsTier}>
              {reliabilityMeta.badge} · Reliability {profile?.reliability_score ?? 80}
            </Text>
          </View>
        </View>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCell}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {showTooltip ? (
        <Pressable onPress={dismissTooltip} style={styles.tooltip}>
          <Text style={styles.tooltipText}>Tap any match card to join your first game.</Text>
        </Pressable>
      ) : null}

      <Button title="Find a Game Now →" onPress={() => router.push("/(tabs)/matches")} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Near You</Text>
        <View style={styles.list}>
          {nearbyMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((action) => (
            <Pressable key={action.label} onPress={action.onPress} style={styles.actionCard}>
              <View style={styles.actionIconWrap}>
                <Feather color={colors.primary} name={action.icon} size={18} />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  city: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statsName: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
  },
  statsTier: {
    marginTop: 4,
    fontSize: 14,
    color: colors.white,
    opacity: 0.88,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  statCell: {
    width: "25%",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.white,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.white,
    opacity: 0.82,
  },
  tooltip: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 14,
    padding: 16,
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  list: {
    gap: 12,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#1A1A18",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
