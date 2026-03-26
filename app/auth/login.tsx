import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { layout, typography } from "@/constants/styles";
import { useApp } from "@/lib/app-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={[layout.screen, styles.screen]}>
      <View style={styles.hero}>
        <Text style={styles.logo}>⚽</Text>
        <Text style={styles.brand}>KickOff Kenya</Text>
        <Text style={styles.subtitle}>Welcome back</Text>
      </View>

      <Card style={styles.formCard}>
        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          value={email}
        />
        <Input
          error={error}
          label="Password"
          onChangeText={setPassword}
          secureTextEntry
          value={password}
        />
        <Button title="Sign In" loading={loading} onPress={handleSubmit} />
      </Card>

      <Pressable onPress={() => router.push("/auth/signup")} style={styles.footerLink}>
        <Text style={styles.footerText}>
          Don&apos;t have an account? <Text style={styles.footerStrong}>Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  hero: {
    alignItems: "center",
    gap: 8,
  },
  logo: {
    fontSize: 48,
    textAlign: "center",
  },
  brand: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
  },
  formCard: {
    gap: 14,
  },
  footerLink: {
    alignItems: "center",
  },
  footerText: {
    ...typography.caption,
  },
  footerStrong: {
    color: colors.primary,
    fontWeight: "700",
  },
});
