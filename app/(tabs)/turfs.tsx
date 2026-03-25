import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";

const filters = ["All", "Available Now", "Floodlit", "Indoor"];

export default function TurfsScreen() {
  const router = useRouter();
  const { turfs } = useApp();
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "Available Now") return turfs.filter((turf) => turf.available_now);
    if (filter === "Floodlit") return turfs.filter((turf) => turf.floodlit);
    if (filter === "Indoor") return turfs.filter((turf) => turf.indoor);
    return turfs;
  }, [filter, turfs]);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Turfs" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
        <View className="flex-row gap-2">
          {filters.map((item) => (
            <Text
              key={item}
              onPress={() => setFilter(item)}
              className={`rounded-pill border px-4 py-2 font-bold ${
                item === filter ? "border-primaryBorder bg-primaryLight text-primary" : "border-border bg-card text-textSecondary"
              }`}
            >
              {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View className="gap-4">
        {filtered.length ? (
          filtered.map((turf) => (
            <Pressable key={turf.id} onPress={() => router.push(`/turfs/${turf.id}`)}>
              <Card className="gap-4">
                <View className="h-32 items-center justify-center rounded-smCard bg-primary">
                  <Text className="text-[40px] text-card">🏟️</Text>
                </View>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-textPrimary">{turf.name}</Text>
                    <Text className="mt-1 text-[13px] text-textSecondary">{turf.location}</Text>
                  </View>
                  <Text className="text-[13px] font-bold text-primary">★ {turf.rating}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[13px] text-textSecondary">{formatCurrency(turf.price_per_hour)}/hour</Text>
                  <View className="flex-row flex-wrap justify-end gap-2">
                    {turf.amenities.map((amenity) => (
                      <Text key={amenity} className="rounded-pill bg-surface px-3 py-1 text-[12px] font-semibold text-textSecondary">
                        {amenity}
                      </Text>
                    ))}
                  </View>
                </View>
              </Card>
            </Pressable>
          ))
        ) : (
          <Card className="items-center gap-3 py-8">
            <Text className="text-center text-[20px] font-black text-textPrimary">No turfs listed yet in your city</Text>
            <Text className="text-center text-[14px] leading-6 text-textSecondary">
              You can still create a match with a custom location
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
