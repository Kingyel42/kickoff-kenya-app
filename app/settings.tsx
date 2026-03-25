import React from "react";
import { ScrollView, Text } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/app-context";

export default function SettingsScreen() {
  const { usingMockData } = useApp();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Settings" showBack />
      <Card className="gap-3">
        <Text className="text-[15px] font-bold text-textPrimary">Notifications</Text>
        <Text className="text-[14px] text-textSecondary">Expo Notifications is configured and permission prompts are enabled on startup.</Text>
      </Card>
      <Card className="mt-4 gap-3">
        <Text className="text-[15px] font-bold text-textPrimary">Data Source</Text>
        <Text className="text-[14px] text-textSecondary">
          {usingMockData
            ? "Supabase environment variables are missing, so the app is showing the built-in typed demo dataset."
            : "Supabase environment variables are configured and live requests are enabled."}
        </Text>
      </Card>
    </ScrollView>
  );
}
