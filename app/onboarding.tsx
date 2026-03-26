import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    emoji: "⚽",
    title: "Stop Chasing People on WhatsApp",
    subtitle: "Find matches, build teams, book turfs — one free Kenyan app.",
    buttonLabel: "Get Started — It's Free",
  },
  {
    key: "2",
    emoji: "🏟️",
    title: "Games Every Day Across Kenya",
    subtitle: "Nairobi, Mombasa, Kisumu. Find a match near you in seconds.",
    buttonLabel: "Next",
  },
  {
    key: "3",
    emoji: "📱",
    title: "Pay via M-Pesa, Play Today",
    subtitle: "No payment, no slot. Everyone who shows up has already paid.",
    buttonLabel: "Get Started — It's Free",
  },
] as const;

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const finishOnboarding = async () => {
    await completeOnboarding();
    await AsyncStorage.setItem("onboarding_complete", "true");
    router.replace("/auth/signup");
  };

  const handlePrimaryAction = async () => {
    if (activeIndex === 1) {
      flatListRef.current?.scrollToIndex({ index: 2, animated: true });
      return;
    }

    await finishOnboarding();
  };

  const renderSlide = ({ item }: ListRenderItemInfo<(typeof slides)[number]>) => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={layout.screen}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((slide, index) => (
            <View key={slide.key} style={[styles.dot, index === activeIndex && styles.activeDot]} />
          ))}
        </View>
        <Button title={slides[activeIndex]?.buttonLabel ?? "Get Started"} onPress={handlePrimaryAction} />
        <Pressable onPress={() => router.push("/auth/login")} style={styles.signInLink}>
          <Text style={styles.signInText}>Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    paddingHorizontal: 28,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  slideContent: {
    alignItems: "center",
    gap: 16,
  },
  emoji: {
    fontSize: 72,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 14,
    backgroundColor: colors.background,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryBorder,
  },
  activeDot: {
    width: 26,
    backgroundColor: colors.primary,
  },
  signInLink: {
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});
