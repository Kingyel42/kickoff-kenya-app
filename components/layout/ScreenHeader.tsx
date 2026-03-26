import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  rightActionLabel,
  onRightActionPress,
}: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather color={colors.textPrimary} name="arrow-left" size={18} />
          </Pressable>
        ) : null}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightActionLabel ? (
        <Pressable onPress={onRightActionPress} style={styles.rightAction}>
          <Text style={styles.rightActionText}>{rightActionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rightAction: {
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rightActionText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
});
