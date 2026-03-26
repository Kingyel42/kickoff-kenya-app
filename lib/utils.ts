import { colors } from "@/constants/colors";

import { MatchFormat, ReliabilityTier } from "./types";

export const formatCurrency = (value: number) => `KSh ${Math.round(value).toLocaleString()}`;

export const formatMap: Record<MatchFormat, number> = {
  "5-a-side": 10,
  "6-a-side": 12,
  "7-a-side": 14,
  "8-a-side": 16,
  "11-a-side": 22,
};

export const getFirstName = (fullName?: string) => fullName?.split(" ")[0] ?? "Player";

export const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

export const getReliabilityMeta = (score: number): { tier: ReliabilityTier; badge: string; color: string } => {
  if (score >= 90) return { tier: "Elite", badge: "Elite", color: colors.primary };
  if (score >= 70) return { tier: "Good", badge: "Good", color: colors.good };
  if (score >= 50) return { tier: "Caution", badge: "Caution", color: colors.warning };
  return { tier: "Restricted", badge: "Restricted", color: colors.error };
};

export const calculatePricing = (totalCost: number, maxPlayers: number) => {
  const share = maxPlayers ? totalCost / maxPlayers : 0;
  const fee = share * 0.1;
  const total = share + fee;

  return {
    share,
    fee,
    total,
  };
};

export const isWithinCheckInWindow = (date: string, startTime: string) => {
  const matchStart = new Date(`${date}T${startTime}:00`);
  const now = new Date();
  const diffMinutes = Math.floor((matchStart.getTime() - now.getTime()) / 60000);
  return diffMinutes <= 30 && diffMinutes >= -10;
};

export const minutesUntil = (date: string, startTime: string) => {
  const matchStart = new Date(`${date}T${startTime}:00`);
  return Math.max(0, Math.floor((matchStart.getTime() - Date.now()) / 60000));
};

export const formatDateLabel = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
