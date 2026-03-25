import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Match Starting Soon" subtitle={`${match.title} · ${match.start_time}`} showBack />

      {closesSoon && !checkedIn ? (
        <Card className="mb-4 border-error bg-surface">
          <Text className="text-[14px] font-bold text-error">
            ⏰ Check-in closes in {Math.max(minutesLeft, 0)} minutes — confirm now or risk a reliability penalty
          </Text>
        </Card>
      ) : null}

      <Card className="mb-4 border-primaryBorder bg-primaryLight">
        {!checkedIn ? (
          <>
            <Text className="text-[44px] font-black text-primary">{minutesLeft}m</Text>
            <Text className="mt-3 text-[22px] font-black text-textPrimary">Check In Now</Text>
            <Text className="mt-2 text-[14px] leading-6 text-textSecondary">
              Confirm you&apos;re at {match.location} to secure your spot
            </Text>
            <View className="mt-5">
              <Button title="✓ I'm Here — Check In" onPress={() => updateCheckIn(match.id)} className="min-h-[56px]" />
            </View>
            <Text className="mt-4 text-[13px] text-textSecondary">
              Not checking in costs you -15 reliability points and no refund.
            </Text>
          </>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} className="items-center py-4">
            <Animated.Text entering={ZoomIn.duration(350)} className="text-[56px] text-primary">
              ✓
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(350)} className="mt-3 text-[24px] font-black text-primary">
              You&apos;re checked in ✓
            </Animated.Text>
            <Text className="mt-2 text-[15px] text-textSecondary">See you on the pitch!</Text>
          </Animated.View>
        )}
      </Card>

      <Card className="gap-4">
        <Text className="text-[18px] font-bold text-textPrimary">Player status</Text>
        {match.players.map((player) => (
          <View key={player.id} className="flex-row items-center gap-3">
            <Avatar initials={player.initials} />
            <Text className="flex-1 text-[14px] font-semibold text-textPrimary">{player.full_name}</Text>
            <Text
              className={`text-[13px] font-bold ${
                player.status === "in" ? "text-primary" : player.status === "on_the_way" ? "text-warning" : "text-textHint"
              }`}
            >
              {player.status === "in" ? "✓ In" : player.status === "on_the_way" ? "⏱ On the way" : "Waiting..."}
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
