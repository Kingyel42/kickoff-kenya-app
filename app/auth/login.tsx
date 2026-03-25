import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/app-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setMessage("");
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.message) {
      setMessage(result.message);
    }

    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="mb-10 items-center gap-2">
        <Text className="text-[40px]">⚽</Text>
        <Text className="text-[28px] font-black text-primary">KickOff Kenya</Text>
      </View>

      <View className="gap-4">
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <View className="gap-2">
          <Pressable className="self-end">
            <Text className="text-[13px] font-semibold text-primary">Forgot password?</Text>
          </Pressable>
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry error={error} />
        </View>
        {message ? <Text className="text-[13px] text-primary">{message}</Text> : null}
        <Button title="Sign In" onPress={handleSubmit} loading={loading} />
      </View>

      <Text className="mt-8 text-center text-[14px] text-textSecondary" onPress={() => router.push("/auth/signup")}>
        Don&apos;t have an account? <Text className="font-bold text-primary">Sign up</Text>
      </Text>
    </View>
  );
}
