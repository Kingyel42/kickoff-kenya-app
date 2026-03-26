import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PricingBreakdown } from "@/components/matches/PricingBreakdown";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { calculatePricing, formatCurrency, formatDateLabel, getInitials } from "@/lib/utils";

export default function MatchDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches, profile, joinMatch } = useApp();
  const [joining, setJoining] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [joinError, setJoinError] = useState("");

  const match = matches.find((item) => item.id === id);
  const pricing = useMemo(() => (match ? calculatePricing(match.total_cost, match.max_players) : null), [match]);

  if (!match || !profile || !pricing) {
    return (
      <View style={[layout.screen, layout.center]}>
        <Text style={typography.body}>Match not found.</Text>
      </View>
    );
  }

  const isJoined = match.players.some((player) => player.profile_id === profile.id);
  const isOrganiser = match.organiser_id === profile.id;
  const spotsLeft = Math.max(match.max_players - match.joined_players, 0);
  const isFull = spotsLeft <= 0;
  const startsAt = new Date(`${match.date}T${match.start_time}:00`);
  const hoursUntilStart = Math.max(0, (startsAt.getTime() - Date.now()) / (1000 * 60 * 60));
  const startsSoon = hoursUntilStart > 0 && hoursUntilStart <= 2;
  const lowReliability = profile.reliability_score < 50 && match.total_cost > 0;

  const buttonVariant = isOrganiser || isFull ? "outline" : isJoined ? "muted" : "primary";
  const buttonTitle = isOrganiser
    ? "Manage Match"
    : isJoined
      ? "You're In ✓"
      : isFull
        ? "Join Waitlist"
        : `Join Match — ${match.total_cost === 0 ? "Free" : `Pay ${formatCurrency(pricing.total)} via M-Pesa`}`;

  const handlePrimaryAction = () => {
    if (isOrganiser) {
      router.push(`/matches/checkin/${match.id}`);
      return;
    }

    if (isJoined || lowReliability) return;
    setJoinError("");
    setShowConfirm(true);
  };

  const handleConfirmJoin = async () => {
    setJoining(true);
    setJoinError("");
    const result = await joinMatch(match.id);
    setJoining(false);

    if (result.error) {
      setJoinError(result.error);
      return;
    }

    setShowConfirm(false);
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <View style={styles.headerBlock}>
          <View style={styles.badgesRow}>
            <Badge label={match.status} tone={match.status === "Open" ? "green" : "red"} />
            <Badge label={match.format} tone="neutral" />
            <Badge label={match.skill_level} tone="neutral" />
          </View>
          <Text style={styles.title}>{match.title}</Text>
          <View style={styles.factsRow}>
            <Fact label="Time" value={`${formatDateLabel(match.date)} · ${match.start_time}`} />
            <Fact label="Location" value={match.location} />
            <Fact label="Price" value={match.total_cost === 0 ? "FREE" : formatCurrency(pricing.total)} highlight />
          </View>
          <Text style={styles.spotsText}>{spotsLeft} of {match.max_players} spots left</Text>
        </View>

        {startsSoon ? (
          <View style={styles.redBanner}>
            <Text style={styles.redBannerText}>⚡ Starts in {hoursUntilStart < 1 ? "under 1 hour" : `${Math.ceil(hoursUntilStart)} hours`}</Text>
          </View>
        ) : null}

        {spotsLeft > 0 && spotsLeft <= 2 ? (
          <View style={styles.amberBanner}>
            <Text style={styles.amberBannerText}>🔥 Almost full</Text>
          </View>
        ) : null}

        {lowReliability ? (
          <View style={styles.warningBanner}>
            <Text style={styles.warningBannerText}>⚠ Your reliability score is too low to join paid matches</Text>
          </View>
        ) : null}

        <PricingBreakdown
          totalCost={match.total_cost}
          maxPlayers={match.max_players}
          share={pricing.share}
          fee={pricing.fee}
          total={pricing.total}
          lockedLabel="Price is fixed — it never changes regardless of how many players join"
        />

        <Card style={styles.sectionCard}>
          <Text style={typography.h3}>Players joined</Text>
          <View style={styles.playersWrap}>
            {match.players.map((player) => (
              <View key={player.id} style={styles.playerChip}>
                <Avatar initials={player.initials || getInitials(player.full_name)} size="sm" />
                <Text style={styles.playerName}>{player.full_name}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={typography.h3}>Match description</Text>
          <Text style={styles.description}>{match.description ?? "No description yet."}</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={typography.h3}>Organiser info</Text>
          <Text style={styles.organiserName}>{match.organiser_name}</Text>
          <Text style={styles.description}>{match.organiser_bio ?? "Organiser profile details will appear here."}</Text>
        </Card>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <Button
          title={buttonTitle}
          variant={buttonVariant}
          disabled={isJoined || lowReliability}
          onPress={handlePrimaryAction}
        />
      </View>

      <Modal transparent visible={showConfirm} animationType="slide" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>{match.title}</Text>
            <Text style={styles.sheetMeta}>{formatDateLabel(match.date)} · {match.start_time}</Text>
            <Text style={styles.sheetAmount}>Amount to pay: {match.total_cost === 0 ? "FREE" : formatCurrency(pricing.total)}</Text>
            <Text style={styles.sheetHint}>Your spot is secured after payment completes</Text>
            {joinError ? <Text style={styles.sheetError}>{joinError}</Text> : null}
            <View style={styles.sheetActions}>
              <Button
                title={match.total_cost === 0 ? "Confirm Join" : "Confirm & Pay via M-Pesa"}
                onPress={handleConfirmJoin}
                loading={joining}
              />
              <Button title="Cancel" variant="muted" onPress={() => setShowConfirm(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Fact({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.factCard}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={[styles.factValue, highlight && styles.factValueHighlight]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 120,
    gap: 14,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  headerBlock: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.white,
  },
  factsRow: {
    gap: 10,
  },
  factCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
  },
  factLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textHint,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  factValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  factValueHighlight: {
    color: colors.primary,
  },
  spotsText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  redBanner: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FDE9E7",
    borderWidth: 1,
    borderColor: colors.error,
  },
  redBannerText: {
    color: colors.error,
    fontWeight: "700",
    fontSize: 14,
  },
  amberBanner: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FEF9E8",
    borderWidth: 1,
    borderColor: colors.warning,
  },
  amberBannerText: {
    color: colors.warning,
    fontWeight: "700",
    fontSize: 14,
  },
  warningBanner: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FDE9E7",
    borderWidth: 1,
    borderColor: colors.error,
  },
  warningBannerText: {
    color: colors.error,
    fontWeight: "700",
    fontSize: 14,
  },
  sectionCard: {
    gap: 12,
  },
  playersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  playerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  playerName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
  },
  organiserName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#1A1A1855",
  },
  bottomSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  sheetMeta: {
    ...typography.body,
  },
  sheetAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
  sheetHint: {
    ...typography.body,
  },
  sheetError: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "600",
  },
  sheetActions: {
    gap: 10,
    marginTop: 6,
  },
});
