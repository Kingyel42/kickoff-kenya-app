import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/app-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    emoji: "⚽",
    titleStart: "Stop Chasing People on WhatsApp",
    titleHighlight: "KickOff",
    titleEnd: "",
    subtitle: "Find matches, build teams, book turfs — one free Kenyan app.",
    button: "Get Started — It's Free",
  },
  {
    id: "2",
    emoji: "🏟️",
    titleStart: "Games Every Day Across Kenya",
    titleHighlight: "",
    titleEnd: "",
    subtitle: "Nairobi, Mombasa, Kisumu. Find a match near you in seconds.",
    button: "Next",
  },
  {
    id: "3",
    emoji: "📱",
    titleStart: "Pay via M-Pesa, Play Today",
    titleHighlight: "",
    titleEnd: "",
    subtitle: "No payment, no slot. Everyone who shows up has already paid.",
    button: "Get Started — It's Free",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handlePrimary = async () => {
    if (activeIndex === 1) {
      listRef.current?.scrollToIndex({ index: 2, animated: true });
      return;
    }

    await completeOnboarding();
    await AsyncStorage.setItem("onboarding_complete", "true");
    router.replace("/auth/signup");
  };

  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-16">
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width: width - 48 }} className="justify-center">
            <Animated.View entering={FadeInDown.duration(500)} className="gap-6">
              <Text className="text-center text-[72px]">{item.emoji}</Text>
              <View className="gap-4">
                <Text className="text-center text-[34px] font-black leading-[40px] text-textPrimary">
                  {item.titleStart}{" "}
                  {item.titleHighlight ? <Text className="text-primary">{item.titleHighlight}</Text> : null}
                  {item.titleEnd}
                </Text>
                <Text className="text-center text-[16px] leading-7 text-textSecondary">{item.subtitle}</Text>
              </View>
            </Animated.View>
          </View>
        )}
      />

      <View className="gap-5">
        <View className="flex-row justify-center gap-2">
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              className={`h-2 rounded-pill ${index === activeIndex ? "w-8 bg-primary" : "w-2 bg-border"}`}
            />
          ))}
        </View>

        <Button title={slides[activeIndex].button} onPress={handlePrimary} />

        <Text className="text-center text-[14px] text-textSecondary" onPress={() => router.push("/auth/login")}>
          Already have an account? <Text className="font-bold text-primary">Sign in</Text>
        </Text>
      </View>
    </View>
  );
}
