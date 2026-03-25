import { Redirect } from "expo-router";

import { useApp } from "@/lib/app-context";

export default function IndexScreen() {
  const { onboardingComplete, session } = useApp();

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href={session ? "/(tabs)" : "/auth/login"} />;
}
