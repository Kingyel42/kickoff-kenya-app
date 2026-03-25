import React from "react";
import { View, ViewProps } from "react-native";

export function Card({ className = "", ...props }: ViewProps & { className?: string }) {
  return <View {...props} className={`rounded-lgCard border border-border bg-card p-4 shadow-card ${className}`} />;
}
