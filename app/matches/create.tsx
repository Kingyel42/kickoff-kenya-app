import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/app-context";
import { MatchFormat } from "@/lib/types";
import { calculatePricing, formatCurrency, formatMap } from "@/lib/utils";

const formats: MatchFormat[] = ["5-a-side", "6-a-side", "7-a-side", "8-a-side", "11-a-side"];
const types = ["Pickup", "Challenge", "Tournament"];
const skills = ["Intermediate", "Any", "Beginner", "Advanced", "Pro"];

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const PickerField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <View className="gap-2">
    <Text className="text-[13px] font-semibold text-textSecondary">{label}</Text>
    <View className="rounded-button border border-border bg-card">
      <Picker selectedValue={value} onValueChange={onChange}>
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function CreateMatchScreen() {
  const router = useRouter();
  const { createMatch, turfs } = useApp();
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<MatchFormat>("5-a-side");
  const [location, setLocation] = useState(turfs[0]?.name ?? "Custom Location");
  const [date, setDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("08:00");
  const [totalCost, setTotalCost] = useState("0");
  const [type, setType] = useState("Pickup");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [description, setDescription] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxPlayers = formatMap[format];
  const pricing = useMemo(() => calculatePricing(Number(totalCost || 0), maxPlayers), [totalCost, maxPlayers]);

  const handleCreate = async () => {
    setLoading(true);
    const nextMatch = await createMatch({
      title: title || "Saturday Morning Kickabout",
      format,
      location,
      date,
      start_time: startTime,
      end_time: endTime,
      total_cost: Number(totalCost || 0),
      type: type as "Pickup" | "Challenge" | "Tournament",
      skill_level: skillLevel as "Any" | "Beginner" | "Intermediate" | "Advanced" | "Pro",
      max_players: maxPlayers,
      description,
    });
    setLoading(false);
    router.replace(`/matches/${nextMatch.id}`);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <ScreenHeader title="Create Match" showBack />

      <View className="gap-4">
        <Input
          label="Match Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Saturday Morning Kickabout"
        />

        <PickerField label="Format" value={format} options={formats} onChange={(value) => setFormat(value as MatchFormat)} />

        <PickerField
          label="Location"
          value={location}
          options={[...turfs.map((turf) => turf.name), "Custom Location"]}
          onChange={setLocation}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          </View>
          <View className="flex-1">
            <Input label="Start Time" value={startTime} onChangeText={setStartTime} placeholder="07:00" />
          </View>
        </View>

        <Input label="Total Turf Cost" value={totalCost} onChangeText={setTotalCost} keyboardType="numeric" hint="Enter 0 to make this match free" />

        <Card className="gap-2">
          <Text className="text-[13px] font-semibold text-textSecondary">Live pricing preview</Text>
          <Text className="text-[22px] font-black text-primary">
            Each player pays: {Number(totalCost || 0) === 0 ? "FREE" : formatCurrency(pricing.total)}
          </Text>
          <Pressable onPress={() => setShowBreakdown((prev) => !prev)}>
            <Text className="text-[14px] font-bold text-primary">{showBreakdown ? "Hide breakdown" : "See breakdown"}</Text>
          </Pressable>
          {showBreakdown ? (
            <View className="mt-2 gap-1">
              <Text className="text-[14px] text-textSecondary">Total turf cost: {formatCurrency(Number(totalCost || 0))}</Text>
              <Text className="text-[14px] text-textSecondary">Max players: {maxPlayers}</Text>
              <Text className="text-[14px] text-textSecondary">Cost per player: {formatCurrency(pricing.share)}</Text>
              <Text className="text-[14px] text-textSecondary">Platform fee (10%): {formatCurrency(pricing.fee)}</Text>
            </View>
          ) : null}
        </Card>

        <Card className="gap-3">
          <Pressable onPress={() => setShowAdvanced((prev) => !prev)} className="flex-row items-center justify-between">
            <Text className="text-[16px] font-bold text-textPrimary">Advanced Options</Text>
            <Text className="text-[16px] font-bold text-primary">{showAdvanced ? "Hide" : "Show"}</Text>
          </Pressable>

          {showAdvanced ? (
            <View className="gap-4">
              <PickerField label="Match Type" value={type} options={types} onChange={setType} />
              <PickerField label="Skill Level" value={skillLevel} options={skills} onChange={setSkillLevel} />
              <Input label="End Time" value={endTime} onChangeText={setEndTime} placeholder="08:00" />
              <Input label="Description" value={description} onChangeText={setDescription} multiline />
            </View>
          ) : null}
        </Card>

        <Button title="Create Match" onPress={handleCreate} loading={loading} />
      </View>
    </ScrollView>
  );
}
