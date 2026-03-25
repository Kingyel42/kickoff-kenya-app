import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";

export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { turfs } = useApp();
  const turf = turfs.find((item) => item.id === id);

  if (!turf) return null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title={turf.name} subtitle={turf.location} showBack />
      <View className="mb-4 h-44 items-center justify-center rounded-lgCard bg-primary">
        <Text className="text-[56px] text-card">🏟️</Text>
      </View>
      <Card className="gap-3">
        <Text className="text-[18px] font-bold text-textPrimary">Overview</Text>
        <Text className="text-[14px] text-textSecondary">Star rating {turf.rating} · {formatCurrency(turf.price_per_hour)} per hour</Text>
        <View className="flex-row flex-wrap gap-2">
          {turf.amenities.map((amenity) => (
            <Text key={amenity} className="rounded-pill bg-surface px-3 py-1 text-[12px] font-semibold text-textSecondary">
              {amenity}
            </Text>
          ))}
        </View>
      </Card>
      <View className="mt-5">
        <Button title="Book This Turf" />
      </View>
    </ScrollView>
  );
}
