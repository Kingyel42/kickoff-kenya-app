import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeProps = {
  label: string;
  tone?: "green" | "red" | "amber" | "neutral";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <View
      style={[
        styles.container,
        tone === "green" && styles.green,
        tone === "red" && styles.red,
        tone === "amber" && styles.amber,
        tone === "neutral" && styles.neutral,
      ]}
    >
      <Text
        style={[
          styles.label,
          tone === "green" && styles.greenText,
          tone === "red" && styles.redText,
          tone === "amber" && styles.amberText,
          tone === "neutral" && styles.neutralText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
  green: {
    backgroundColor: "#E8F5EE",
    borderColor: "#B8D8C4",
  },
  red: {
    backgroundColor: "#FDE9E7",
    borderColor: "#C0392B",
  },
  amber: {
    backgroundColor: "#FEF9E8",
    borderColor: "#B07D1A",
  },
  neutral: {
    backgroundColor: "#F2EFE8",
    borderColor: "#E0D8C8",
  },
  greenText: {
    color: "#186637",
  },
  redText: {
    color: "#C0392B",
  },
  amberText: {
    color: "#B07D1A",
  },
  neutralText: {
    color: "#6B6050",
  },
});
