import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import "../global.css";

import { AppProvider, AuthGate, useApp } from "@/lib/app-context";
import { colors } from "@/constants/colors";

function FirstTimeJoinFlow() {
  const router = useRouter();
  const segments = useSegments();
  const { isReady, session, hasJoinedMatch, shouldAutoRouteFirstTimeUser } = useApp();

  useEffect(() => {
    if (!isReady || !session || hasJoinedMatch || !shouldAutoRouteFirstTimeUser) return;
    if (segments[0] === "(tabs)" && segments[1] === "matches") return;

    router.replace("/(tabs)/matches");
  }, [hasJoinedMatch, isReady, router, segments, session, shouldAutoRouteFirstTimeUser]);

  return null;
}

function RootNavigator() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <AuthGate />
      <FirstTimeJoinFlow />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="matches/[id]" />
        <Stack.Screen name="matches/create" />
        <Stack.Screen name="matches/checkin/[id]" />
        <Stack.Screen name="matches/rate/[id]" />
        <Stack.Screen name="teams/[id]" />
        <Stack.Screen name="turfs/[id]" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
