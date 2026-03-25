import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { PricingBreakdown } from "@/components/matches/PricingBreakdown";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { calculatePricing, formatCurrency, getInitials } from "@/lib/utils";

export default function MatchDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches, profile, joinMatch } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [joining, setJoining] = useState(false);

  const match = matches.find((item) => item.id === id);
  const pricing = useMemo(() => (match ? calculatePricing(match.total_cost, match.max_players) : null), [match]);

  if (!match || !profile || !pricing) return null;

  const joined = match.players.some((player) => player.profile_id === profile.id);
  const isOrganiser = match.organiser_id === profile.id;
  const reliabilityLow = profile.reliability_score < 50 && match.total_cost > 0;
  const spotsLeft = Math.max(match.max_players - match.joined_players, 0);
  const startsAt = new Date(`${match.date}T${match.start_time}:00`);
  const hoursUntilStart = Math.max(0, (startsAt.getTime() - Date.now()) / (1000 * 60 * 60));
  const startsSoon = hoursUntilStart > 0 && hoursUntilStart <= 2;
  const almostFull = spotsLeft > 0 && spotsLeft <= 2;
  const isFull = spotsLeft === 0 || match.status === "Full";

  const joinTitle = isOrganiser
    ? "Manage Match"
    : joined
      ? "You're In ✓"
      : isFull
        ? "Join Waitlist"
        : `Join Match — Pay ${match.total_cost === 0 ? "FREE" : `${formatCurrency(pricing.total)} via M-Pesa`}`;
  const joinVariant = isOrganiser || isFull ? "outline" : joined ? "muted" : "primary";
  const joinDisabled = joined || reliabilityLow;

  const handleJoin = async () => {
    if (isOrganiser) {
      router.push(`/matches/checkin/${match.id}`);
      return;
    }

    if (joined || reliabilityLow) return;
    setShowConfirm(true);
  };

  const confirmJoin = async () => {
    setJoining(true);
    const result = await joinMatch(match.id);
    setJoining(false);

    if (!result.error) {
      setShowConfirm(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 130 }}>
        <Pressable onPress={() => router.back()} className="mb-5 h-10 w-10 items-center justify-center rounded-full bg-card">
          <Text className="text-[18px] text-textPrimary">←</Text>
        </Pressable>

        <Text className="text-[30px] font-black text-textPrimary">{match.title}</Text>

        <View className="mt-5 flex-row justify-between gap-3">
          {[
            { label: "Time", value: match.start_time },
            { label: "Location", value: match.location },
            { label: "Price", value: match.total_cost === 0 ? "FREE" : formatCurrency(pricing.total) },
          ].map((fact) => (
            <Card key={fact.label} className="flex-1 gap-1 px-3 py-4">
              <Text className="text-[12px] font-semibold text-textHint">{fact.label}</Text>
              <Text className={`text-[14px] font-black ${fact.label === "Price" ? "text-primary" : "text-textPrimary"}`}>{fact.value}</Text>
            </Card>
          ))}
        </View>

        <Text className="mt-5 text-[18px] font-black text-textPrimary">
          {spotsLeft} of {match.max_players} spots left
        </Text>

        {startsSoon ? (
          <Card className="mt-4 border-error bg-surface">
            <Text className="text-[14px] font-bold text-error">⚡ Starts in {hoursUntilStart < 1 ? "under 1 hour" : `${Math.ceil(hoursUntilStart)} hours`}</Text>
          </Card>
        ) : null}

        {almostFull ? (
          <Card className="mt-4 border-warning bg-surface">
            <Text className="text-[14px] font-bold text-warning">🔥 Almost full</Text>
          </Card>
        ) : null}

        {reliabilityLow ? (
          <Card className="mt-4 border-error bg-surface">
            <Text className="text-[14px] font-bold text-error">⚠ Your reliability score is too low to join paid matches</Text>
          </Card>
        ) : null}

        <View className="mt-6 gap-4">
          <PricingBreakdown
            totalCost={match.total_cost}
            maxPlayers={match.max_players}
            share={pricing.share}
            fee={pricing.fee}
            total={pricing.total}
            lockedLabel="Price is fixed — it never changes regardless of how many players join"
          />

          <Card className="gap-4">
            <Text className="text-[18px] font-bold text-textPrimary">Players joined</Text>
            <View className="flex-row flex-wrap gap-2">
              {match.players.map((player) => (
                <View key={player.id} className="flex-row items-center gap-2 rounded-pill bg-surface px-3 py-2">
                  <Avatar initials={player.initials || getInitials(player.full_name)} size="sm" />
                  <Text className="text-[13px] font-semibold text-textPrimary">{player.full_name}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card className="gap-2">
            <Text className="text-[18px] font-bold text-textPrimary">Match description</Text>
            <Text className="text-[14px] leading-6 text-textSecondary">
              {match.description ?? "Join this match for a fast, reliable football booking experience on KickOff Kenya."}
            </Text>
          </Card>

          <Card className="gap-2">
            <Text className="text-[18px] font-bold text-textPrimary">Organiser info</Text>
            <Text className="text-[15px] font-bold text-textPrimary">{match.organiser_name}</Text>
            <Text className="text-[14px] leading-6 text-textSecondary">
              {match.organiser_bio ?? "Organiser profile details will appear here when live profile data is connected."}
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-6 py-4">
        <Button title={joinTitle} variant={joinVariant} disabled={joinDisabled} onPress={handleJoin} />
      </View>

      <Modal transparent visible={showConfirm} animationType="slide" onRequestClose={() => setShowConfirm(false)}>
        <View className="flex-1 justify-end bg-[#1A1A1860]">
          <View className="rounded-t-[24px] bg-card px-6 pb-8 pt-6">
            <Text className="text-[24px] font-black text-textPrimary">Confirm your spot</Text>
            <Text className="mt-4 text-[16px] font-bold text-textPrimary">{match.title}</Text>
            <Text className="mt-2 text-[14px] text-textSecondary">
              {match.date} · {match.start_time}
            </Text>
            <Text className="mt-2 text-[16px] font-black text-primary">
              Amount to pay: {match.total_cost === 0 ? "FREE" : formatCurrency(pricing.total)}
            </Text>
            <Text className="mt-3 text-[14px] leading-6 text-textSecondary">
              Your spot is secured after payment completes.
            </Text>
            <View className="mt-6 gap-3">
              <Button
                title={match.total_cost === 0 ? "Confirm Join" : "Confirm & Pay via M-Pesa"}
                onPress={confirmJoin}
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
