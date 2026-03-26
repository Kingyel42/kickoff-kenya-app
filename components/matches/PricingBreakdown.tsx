import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/styles";
import { formatCurrency } from "@/lib/utils";

type PricingBreakdownProps = {
  totalCost: number;
  maxPlayers: number;
  share: number;
  fee: number;
  total: number;
  lockedLabel?: string;
};

export function PricingBreakdown({
  totalCost,
  maxPlayers,
  share,
  fee,
  total,
  lockedLabel,
}: PricingBreakdownProps) {
  return (
    <Card>
      <Text style={styles.title}>Pricing breakdown</Text>
      <View style={styles.rows}>
        <PriceRow label="Total turf cost" value={formatCurrency(totalCost)} />
        <PriceRow label="Max players" value={String(maxPlayers)} />
        <PriceRow label="Your share" value={formatCurrency(share)} />
        <PriceRow label="Platform fee (10%)" value={formatCurrency(fee)} />
      </View>
      <View style={styles.divider} />
      <PriceRow label="You pay" value={totalCost === 0 ? "FREE" : formatCurrency(total)} highlight />
      {lockedLabel ? <Text style={styles.lockedText}>{lockedLabel}</Text> : null}
    </Card>
  );
}

function PriceRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={highlight ? styles.highlightLabel : typography.body}>{label}</Text>
      <Text style={highlight ? styles.highlightValue : styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h3,
    marginBottom: 14,
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  highlightLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
  lockedText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
