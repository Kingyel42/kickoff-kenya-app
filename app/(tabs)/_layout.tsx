import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors } from "@/constants/colors";

const iconMap = {
  index: "grid",
  matches: "calendar",
  teams: "users",
  turfs: "map-pin",
  profile: "user",
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactiveTab,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={iconMap[route.name as keyof typeof iconMap]} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="matches" options={{ title: "Matches" }} />
      <Tabs.Screen name="teams" options={{ title: "Teams" }} />
      <Tabs.Screen name="turfs" options={{ title: "Turfs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
