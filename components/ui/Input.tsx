import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from "react-native";

import { colors } from "@/constants/colors";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textHint}
        style={[styles.input, error ? styles.inputError : undefined, style as TextStyle]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    color: colors.textHint,
    marginTop: 6,
  },
});
