import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";
import { Position, Profile } from "@/lib/types";

const positions: Position[] = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const skills: Profile["skill_level"][] = ["Beginner", "Intermediate", "Advanced", "Pro"];
const cities = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Other"];

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

  const handleSignup = async () => {
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

    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <Card style={styles.formCard}>
        <Input label="Full Name" onChangeText={setFullName} value={fullName} />
        <Input autoCapitalize="none" label="Username" onChangeText={setUsername} value={username} />
        <Input autoCapitalize="none" keyboardType="email-address" label="Email" onChangeText={setEmail} value={email} />
        <Input error={error} label="Password" onChangeText={setPassword} secureTextEntry value={password} />
        <PickerField label="Position" value={position} options={positions} onChange={(value) => setPosition(value as Position)} />
        <PickerField
          label="Skill Level"
          value={skillLevel}
          options={skills}
          onChange={(value) => setSkillLevel(value as Profile["skill_level"])}
        />
        <PickerField label="City" value={city} options={cities} onChange={setCity} />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Your Reliability Score starts at 80/100</Text>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Button title="Create Account" loading={loading} onPress={handleSignup} />
      </Card>

      <Pressable onPress={() => router.push("/auth/login")} style={styles.signInLink}>
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInStrong}>Sign in</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 36,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  infoText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  message: {
    color: colors.primary,
    fontSize: 13,
  },
  signInLink: {
    alignItems: "center",
  },
  signInText: {
    ...typography.caption,
  },
  signInStrong: {
    color: colors.primary,
    fontWeight: "700",
  },
});
