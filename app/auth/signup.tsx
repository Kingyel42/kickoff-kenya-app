import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/app-context";
import { Position, Profile } from "@/lib/types";

const positions: Position[] = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const skills: Profile["skill_level"][] = ["Beginner", "Intermediate", "Advanced", "Pro"];
const cities = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Other"];

const PickerField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useApp();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState<Position>("Midfielder");
  const [skillLevel, setSkillLevel] = useState<Profile["skill_level"]>("Intermediate");
  const [city, setCity] = useState("Nairobi");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    const result = await signUp({ fullName, username, email, password, position, skillLevel, city });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.requiresEmailVerification) {
      setMessage(result.message ?? "Check your email to confirm your account.");
      return;
    }

    if (result.message) {
      setMessage(result.message);
    }

    router.replace("/(tabs)");
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 32 }}>
      <Text className="mb-8 text-[30px] font-black text-textPrimary">Create your account</Text>
      <View className="gap-4">
        <Input label="Full Name" value={fullName} onChangeText={setFullName} />
        <Input label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry error={error} />
        <PickerField label="Position" value={position} onChange={(value) => setPosition(value as Position)} options={positions} />
        <PickerField label="Skill Level" value={skillLevel} onChange={(value) => setSkillLevel(value as Profile["skill_level"])} options={skills} />
        <PickerField label="City" value={city} onChange={setCity} options={cities} />

        <Card className="border-primaryBorder bg-primaryLight">
          <Text className="text-[14px] leading-6 text-primary">
            Your Reliability Score starts at 80/100. Show up, pay on time, and be a good teammate to earn Elite status.
          </Text>
        </Card>

        {message ? <Text className="text-[13px] text-primary">{message}</Text> : null}

        <Button title="Create Account — It's Free" onPress={handleSignUp} loading={loading} />
        <Text className="text-center text-[14px] text-textSecondary" onPress={() => router.push("/auth/login")}>
          Already have an account? <Text className="font-bold text-primary">Sign in</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
