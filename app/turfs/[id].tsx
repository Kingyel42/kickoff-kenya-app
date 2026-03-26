import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";

export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { turfs } = useApp();
  const turf = turfs.find((item) => item.id === id);

  if (!turf) return null;

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <ScreenHeader title={turf.name} subtitle={turf.location} showBack />
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🏟️</Text>
      </View>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overviewText}>
          Star rating {turf.rating} · {formatCurrency(turf.price_per_hour)} per hour
        </Text>
        <View style={styles.amenitiesRow}>
          {turf.amenities.map((amenity) => (
            <Text key={amenity} style={styles.amenityPill}>
              {amenity}
            </Text>
          ))}
        </View>
      </Card>
      <View style={styles.buttonWrap}>
        <Button title="Book This Turf" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  hero: {
    marginBottom: 16,
    height: 176,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    fontSize: 56,
    color: colors.white,
  },
  card: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  overviewText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityPill: {
    borderRadius: 100,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  buttonWrap: {
    marginTop: 20,
  },
});
