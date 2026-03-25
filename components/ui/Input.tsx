import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, ...props }: InputProps) {
  return (
    <View className="gap-2">
      <Text className="text-[13px] font-semibold text-textSecondary">{label}</Text>
      <TextInput
        placeholderTextColor="#A89880"
        className="rounded-button border border-border bg-card px-4 py-4 text-[15px] text-textPrimary"
        {...props}
      />
      {error ? <Text className="text-[12px] text-error">{error}</Text> : hint ? <Text className="text-[12px] text-textHint">{hint}</Text> : null}
    </View>
  );
}
