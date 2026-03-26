import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { MatchFormat, MatchType, SkillLevel } from "@/lib/types";
import { calculatePricing, formatCurrency, formatMap } from "@/lib/utils";

const formats: MatchFormat[] = ["5-a-side", "6-a-side", "7-a-side", "8-a-side", "11-a-side"];
const types: MatchType[] = ["Pickup", "Challenge", "Tournament"];
const skillLevels: SkillLevel[] = ["Intermediate", "Any", "Beginner", "Advanced", "Pro"];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

function PickerField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <View>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.pickerShell}>
        <Picker selectedValue={value} onValueChange={onChange}>
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

export default function CreateMatchScreen() {
  const router = useRouter();
  const { createMatch, turfs } = useApp();
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<MatchFormat>("5-a-side");
  const [location, setLocation] = useState(turfs[0]?.name ?? "Custom Location");
  const [date, setDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("08:00");
  const [cost, setCost] = useState("0");
  const [type, setType] = useState<MatchType>("Pickup");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Intermediate");
  const [description, setDescription] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxPlayers = formatMap[format];
  const pricing = useMemo(() => calculatePricing(Number(cost || 0), maxPlayers), [cost, maxPlayers]);

  const handleCreate = async () => {
    if (loading) return;

    setLoading(true);
    const created = await createMatch({
      title: title || "Saturday Morning Kickabout",
      format,
      location,
      date,
      start_time: startTime,
      end_time: endTime,
      total_cost: Number(cost || 0),
      type,
      skill_level: skillLevel,
      max_players: maxPlayers,
      description,
    });
    setLoading(false);
    router.replace(`/matches/${created.id}`);
  };

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <Text style={typography.h1}>Create Match</Text>

      <Card style={styles.formCard}>
        <Input
          label="Match Title"
          onChangeText={setTitle}
          value={title}
          placeholder="Saturday Morning Kickabout"
        />
        <PickerField label="Format" value={format} options={formats} onChange={(value) => setFormat(value as MatchFormat)} />
        <PickerField
          label="Location"
          value={location}
          options={[...turfs.map((turf) => turf.name), "Custom Location"]}
          onChange={setLocation}
        />

        <View style={styles.row}>
          <View style={styles.flexOne}>
            <Input label="Date" onChangeText={setDate} value={date} />
          </View>
          <View style={styles.flexOne}>
            <Input label="Start Time" onChangeText={setStartTime} value={startTime} />
          </View>
        </View>

        <Input
          label="Total Turf Cost"
          onChangeText={setCost}
          value={cost}
          keyboardType="numeric"
          hint="Enter 0 to make this match free"
        />

        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>Each player pays</Text>
          <Text style={styles.pricingValue}>{Number(cost || 0) === 0 ? "FREE" : formatCurrency(pricing.total)}</Text>
          <Pressable onPress={() => setShowBreakdown((prev) => !prev)}>
            <Text style={styles.breakdownToggle}>{showBreakdown ? "Hide breakdown" : "See breakdown"}</Text>
          </Pressable>
          {showBreakdown ? (
            <View style={styles.breakdownList}>
              <Text style={styles.breakdownRow}>Total turf cost: {formatCurrency(Number(cost || 0))}</Text>
              <Text style={styles.breakdownRow}>Max players: {maxPlayers}</Text>
              <Text style={styles.breakdownRow}>Cost per player: {formatCurrency(pricing.share)}</Text>
              <Text style={styles.breakdownRow}>Platform fee (10%): {formatCurrency(pricing.fee)}</Text>
            </View>
          ) : null}
        </View>

        <Card style={styles.advancedCard}>
          <Pressable onPress={() => setShowAdvanced((prev) => !prev)} style={styles.advancedHeader}>
            <Text style={typography.h3}>Advanced Options</Text>
            <Text style={styles.breakdownToggle}>{showAdvanced ? "Hide" : "Show"}</Text>
          </Pressable>
          {showAdvanced ? (
            <View style={styles.advancedFields}>
              <PickerField label="Match Type" value={type} options={types} onChange={(value) => setType(value as MatchType)} />
              <PickerField
                label="Skill Level"
                value={skillLevel}
                options={skillLevels}
                onChange={(value) => setSkillLevel(value as SkillLevel)}
              />
              <Input label="End Time" onChangeText={setEndTime} value={endTime} />
              <Input label="Description" onChangeText={setDescription} value={description} multiline />
            </View>
          ) : null}
        </Card>

        <Button title="Create Match" onPress={handleCreate} loading={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 18,
  },
  formCard: {
    gap: 14,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  pickerShell: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  pricingCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: 16,
    gap: 8,
  },
  pricingLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  pricingValue: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primary,
  },
  breakdownToggle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  breakdownList: {
    gap: 6,
    marginTop: 4,
  },
  breakdownRow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  advancedCard: {
    gap: 12,
    backgroundColor: colors.card,
  },
  advancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  advancedFields: {
    gap: 14,
  },
});
