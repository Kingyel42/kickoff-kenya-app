import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { minutesUntil } from "@/lib/utils";

export default function CheckInScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches, profile, updateCheckIn } = useApp();

  const match = matches.find((item) => item.id === id);
  const currentPlayer = useMemo(
    () => match?.players.find((player) => player.profile_id === profile?.id),
    [match, profile?.id],
  );

  if (!match || !profile) return null;

  const minutesLeft = minutesUntil(match.date, match.start_time);
  const checkedIn = currentPlayer?.checked_in;
  const closesSoon = minutesLeft <= 10;

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <ScreenHeader title="Match Starting Soon" subtitle={`${match.title} · ${match.start_time}`} showBack />

      {closesSoon && !checkedIn ? (
        <Card style={[styles.card, styles.alertCard]}>
          <Text style={styles.alertText}>
            Check-in closes in {Math.max(minutesLeft, 0)} minutes - confirm now or risk a reliability penalty
          </Text>
        </Card>
      ) : null}

      <Card style={[styles.card, styles.checkInCard]}>
        {!checkedIn ? (
          <>
            <Text style={styles.timer}>{minutesLeft}m</Text>
            <Text style={styles.checkInTitle}>Check In Now</Text>
            <Text style={styles.checkInBody}>Confirm you&apos;re at {match.location} to secure your spot</Text>
            <View style={styles.buttonWrap}>
              <Button title="✓ I'm Here - Check In" onPress={() => updateCheckIn(match.id)} style={styles.checkInButton} />
            </View>
            <Text style={styles.penaltyText}>Not checking in costs you -15 reliability points and no refund.</Text>
          </>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={styles.checkedInWrap}>
            <Animated.Text entering={ZoomIn.duration(350)} style={styles.checkedInMark}>
              ✓
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(350)} style={styles.checkedInTitle}>
              You&apos;re checked in ✓
            </Animated.Text>
            <Text style={styles.checkedInBody}>See you on the pitch!</Text>
          </Animated.View>
        )}
      </Card>

      <Card style={styles.statusCard}>
        <Text style={styles.statusTitle}>Player status</Text>
        {match.players.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <Avatar initials={player.initials} />
            <Text style={styles.playerName}>{player.full_name}</Text>
            <Text
              style={[
                styles.playerStatus,
                player.status === "in" && styles.playerStatusIn,
                player.status === "on_the_way" && styles.playerStatusOnTheWay,
                player.status !== "in" && player.status !== "on_the_way" && styles.playerStatusWaiting,
              ]}
            >
              {player.status === "in" ? "✓ In" : player.status === "on_the_way" ? "⏱ On the way" : "Waiting..."}
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.error,
  },
  checkInCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  timer: {
    fontSize: 44,
    fontWeight: "900",
    color: colors.primary,
  },
  checkInTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  checkInBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  buttonWrap: {
    marginTop: 20,
  },
  checkInButton: {
    minHeight: 56,
  },
  penaltyText: {
    marginTop: 16,
    fontSize: 13,
    color: colors.textSecondary,
  },
  checkedInWrap: {
    alignItems: "center",
    paddingVertical: 16,
  },
  checkedInMark: {
    fontSize: 56,
    color: colors.primary,
  },
  checkedInTitle: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "900",
    color: colors.primary,
  },
  checkedInBody: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
  },
  statusCard: {
    gap: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  playerStatus: {
    fontSize: 13,
    fontWeight: "700",
  },
  playerStatusIn: {
    color: colors.primary,
  },
  playerStatusOnTheWay: {
    color: colors.warning,
  },
  playerStatusWaiting: {
    color: colors.textHint,
  },
});
