import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";

export default function SettingsScreen() {
  const { usingMockData } = useApp();

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <ScreenHeader title="Settings" showBack />

      <Card style={styles.rowCard}>
        <Text style={styles.rowTitle}>Notifications</Text>
        <Text style={typography.body}>Reminder notifications are enabled when the device grants permission.</Text>
      </Card>

      <Card style={styles.rowCard}>
        <Text style={styles.rowTitle}>Data Source</Text>
        <Text style={typography.body}>
          {usingMockData
            ? "Supabase environment variables are missing, so the app is currently showing demo data."
            : "Supabase environment variables are configured and live requests are enabled."}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 14,
  },
  rowCard: {
    gap: 10,
  },
  rowTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
});
