import React from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { layout } from "@/constants/styles";

export function Card({ style, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return <View {...props} style={[layout.card, style]} />;
}
