import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { TurfFilter } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const filters: TurfFilter[] = ["All", "Available Now", "Floodlit", "Indoor"];

export default function TurfsScreen() {
  const { turfs, profile } = useApp();
  const [filter, setFilter] = useState<TurfFilter>("All");

  const visibleTurfs = useMemo(() => {
    return turfs.filter((turf) => {
      if (filter === "All") return true;
      if (filter === "Available Now") return turf.available_now;
      if (filter === "Floodlit") return turf.floodlit;
      return turf.indoor;
    });
  }, [filter, turfs]);

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <Text style={typography.h1}>Turfs</Text>

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

      {visibleTurfs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No turfs listed yet in your city</Text>
          <Text style={styles.emptyText}>You can still create a match with a custom location</Text>
        </View>
      ) : (
        visibleTurfs.map((turf) => (
          <Card key={turf.id} style={styles.turfCard}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>⚽</Text>
            </View>
            <Text style={styles.turfName}>{turf.name}</Text>
            <Text style={styles.turfLocation}>{turf.location}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>⭐ {turf.rating}</Text>
              <Text style={styles.infoPrice}>{formatCurrency(turf.price_per_hour)}/hr</Text>
            </View>
            <View style={styles.amenitiesRow}>
              {turf.amenities.map((amenity) => (
                <Badge key={amenity} label={amenity} tone="neutral" />
              ))}
            </View>
          </Card>
        ))
      )}

      {profile ? <Text style={styles.footerNote}>Showing turf suggestions near {profile.city}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 30,
    gap: 18,
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
  emptyState: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 20,
    gap: 10,
  },
  emptyTitle: {
    ...typography.h3,
  },
  emptyText: {
    ...typography.body,
  },
  turfCard: {
    gap: 12,
  },
  imagePlaceholder: {
    height: 140,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  imageIcon: {
    fontSize: 36,
    color: colors.white,
  },
  turfName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  turfLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  infoPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  footerNote: {
    ...typography.caption,
    textAlign: "center",
  },
});
