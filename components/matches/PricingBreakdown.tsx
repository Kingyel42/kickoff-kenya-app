import React from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

type Props = {
  totalCost: number;
  maxPlayers: number;
  share: number;
  fee: number;
  total: number;
  lockedLabel?: string;
};

const Row = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <View className="flex-row items-center justify-between py-1.5">
    <Text className={`text-[14px] ${highlight ? "font-bold text-primary" : "text-textSecondary"}`}>{label}</Text>
    <Text className={`text-[14px] ${highlight ? "font-extrabold text-primary" : "font-semibold text-textPrimary"}`}>{value}</Text>
  </View>
);

export function PricingBreakdown({ totalCost, maxPlayers, share, fee, total, lockedLabel }: Props) {
  return (
    <Card className="gap-1">
      <Text className="text-[15px] font-bold text-textPrimary">Pricing Breakdown</Text>
      <Row label="Total turf cost" value={formatCurrency(totalCost)} />
      <Row label="Max players" value={`${maxPlayers}`} />
      <Row label="Your share" value={formatCurrency(share)} />
      <Row label="Platform fee (10%)" value={formatCurrency(fee)} />
      <View className="my-1 border-t border-border" />
      <Row label="You pay" value={formatCurrency(total)} highlight />
      {lockedLabel ? <Text className="mt-2 text-[12px] text-textSecondary">{lockedLabel}</Text> : null}
    </Card>
  );
}
