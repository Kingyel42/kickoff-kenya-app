import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Session, User } from "@supabase/supabase-js";
import { Redirect, usePathname } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { activities, currentProfile, leaderboard, matches, teams, turfs } from "./mock-data";
import { buildMatchEndDate, buildMatchStartDate, scheduleCheckInAlert, scheduleMatchReminder, scheduleRatingReminder } from "./notifications";
import { isSupabaseConfigured, supabase } from "./supabase";
import { LeaderboardEntry, Match, Profile, RatingSelection, Team, Turf } from "./types";
import { getInitials } from "./utils";

type SignUpInput = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  position: Profile["position"];
  skillLevel: Profile["skill_level"];
  city: string;
};

type AuthResult = {
  error?: string;
  message?: string;
  requiresEmailVerification?: boolean;
};

type AppContextValue = {
  isReady: boolean;
  onboardingComplete: boolean;
  session: Session | null;
  profile: Profile | null;
  hasJoinedMatch: boolean;
  shouldAutoRouteFirstTimeUser: boolean;
  matches: Match[];
  teams: Team[];
  turfs: Turf[];
  leaderboard: LeaderboardEntry[];
  activities: typeof activities;
  usingMockData: boolean;
  completeOnboarding: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  createMatch: (input: Partial<Match>) => Promise<Match>;
  joinMatch: (matchId: string) => Promise<{ error?: string }>;
  updateCheckIn: (matchId: string) => Promise<void>;
  submitRatings: (selections: RatingSelection, tags: string[]) => Promise<void>;
  dismissFirstTimePrompt: () => Promise<void>;
  markMatchCompleted: (matchId: string) => Promise<void>;
};

const ONBOARDING_KEY = "onboarding_complete";
const HAS_JOINED_MATCH_KEY = "has_joined_match";
const FIRST_TIME_USER_PROMPTED_KEY = "first_time_user_prompted";
const DEV_SESSION_KEY = "kickoff_dev_session";
const DEV_PROFILE_KEY = "kickoff_dev_profile";

const AppContext = createContext<AppContextValue | null>(null);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) return;

  const settings = await Notifications.getPermissionsAsync();
  const finalStatus =
    settings.status === "granted"
      ? settings.status
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus === "granted") {
    await Notifications.getExpoPushTokenAsync();
  }
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const createProfileFromUser = (user: User, overrides: Partial<Profile> = {}): Profile => {
  const metadata = user.user_metadata ?? {};
  const email = user.email ?? overrides.email ?? currentProfile.email;
  const username = overrides.username ?? metadata.username ?? email.split("@")[0] ?? currentProfile.username;
  const fullName = overrides.full_name ?? metadata.full_name ?? email.split("@")[0] ?? currentProfile.full_name;

  return {
    ...currentProfile,
    id: user.id,
    email,
    username,
    full_name: fullName,
    city: overrides.city ?? metadata.city ?? currentProfile.city,
    position: overrides.position ?? metadata.position ?? currentProfile.position,
    skill_level: overrides.skill_level ?? metadata.skill_level ?? currentProfile.skill_level,
    reliability_score: overrides.reliability_score ?? metadata.reliability_score ?? currentProfile.reliability_score,
    verified: overrides.verified ?? currentProfile.verified,
  };
};

const createDevSession = (profile: Profile): Session =>
  ({
    access_token: `dev-access-${profile.id}`,
    refresh_token: `dev-refresh-${profile.id}`,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: profile.id,
      app_metadata: {},
      user_metadata: {
        full_name: profile.full_name,
        username: profile.username,
        city: profile.city,
        position: profile.position,
        skill_level: profile.skill_level,
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: profile.email,
    },
  }) as Session;

const persistDevAuth = async (session: Session, profile: Profile) => {
  await AsyncStorage.multiSet([
    [DEV_SESSION_KEY, JSON.stringify(session)],
    [DEV_PROFILE_KEY, JSON.stringify(profile)],
  ]);
};

const clearDevAuth = async () => {
  await AsyncStorage.multiRemove([DEV_SESSION_KEY, DEV_PROFILE_KEY]);
};

const loadDevAuth = async (): Promise<{ session: Session | null; profile: Profile | null }> => {
  const entries = await AsyncStorage.multiGet([DEV_SESSION_KEY, DEV_PROFILE_KEY]);
  const sessionValue = entries.find(([key]) => key === DEV_SESSION_KEY)?.[1] ?? null;
  const profileValue = entries.find(([key]) => key === DEV_PROFILE_KEY)?.[1] ?? null;

  return {
    session: sessionValue ? (JSON.parse(sessionValue) as Session) : null,
    profile: profileValue ? (JSON.parse(profileValue) as Profile) : null,
  };
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasJoinedMatch, setHasJoinedMatch] = useState(false);
  const [shouldAutoRouteFirstTimeUser, setShouldAutoRouteFirstTimeUser] = useState(false);
  const [matchesState, setMatchesState] = useState(matches);
  const [teamsState] = useState(teams);
  const [turfsState] = useState(turfs);
  const [leaderboardState] = useState(leaderboard);

  const usingMockData = !isSupabaseConfigured;

  const syncFirstTimeFlags = async () => {
    const joined = await AsyncStorage.getItem(HAS_JOINED_MATCH_KEY);
    const prompted = await AsyncStorage.getItem(FIRST_TIME_USER_PROMPTED_KEY);
    setHasJoinedMatch(joined === "true");
    setShouldAutoRouteFirstTimeUser(joined !== "true" && prompted !== "true");
  };

  const hydrateProfileForSession = async (nextSession: Session | null, fallback?: Partial<Profile>) => {
    if (!nextSession) return null;

    if (!isSupabaseConfigured) {
      return createProfileFromUser(nextSession.user, fallback);
    }

    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", nextSession.user.id).maybeSingle();

      if (data) {
        return {
          ...currentProfile,
          ...data,
          id: data.id ?? nextSession.user.id,
          email: data.email ?? nextSession.user.email ?? currentProfile.email,
        } as Profile;
      }
    } catch {
      return createProfileFromUser(nextSession.user, fallback);
    }

    return createProfileFromUser(nextSession.user, fallback);
  };

  useEffect(() => {
    let isMounted = true;
    const authListener = isSupabaseConfigured
      ? supabase.auth.onAuthStateChange(async (_event, nextSession) => {
          if (!isMounted) return;

          setSession(nextSession);
          const nextProfile = await hydrateProfileForSession(nextSession);
          if (isMounted) {
            setProfile(nextProfile);
          }
        })
      : null;

    const bootstrap = async () => {
      const onboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!isMounted) return;

      setOnboardingComplete(onboarding === "true");
      await syncFirstTimeFlags();

      if (isSupabaseConfigured) {
        const {
          data: { session: storedSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;
        setSession(storedSession);
        setProfile(await hydrateProfileForSession(storedSession));
      } else {
        const stored = await loadDevAuth();
        if (!isMounted) return;
        setSession(stored.session);
        setProfile(stored.session ? stored.profile ?? createProfileFromUser(stored.session.user) : null);
      }

      if (isMounted) {
        setIsReady(true);
      }

      registerForPushNotificationsAsync().catch(() => undefined);
    };

    bootstrap().catch(() => {
      if (isMounted) {
        setSession(null);
        setProfile(null);
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
      authListener?.data.subscription.unsubscribe();
    };
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingComplete(true);
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return { error: "Enter both email and password." };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { error: "Enter a valid email address." };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      const nextSession = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!nextSession) {
        return { error: "Sign-in succeeded, but no active session was returned. Please try again." };
      }

      setSession(nextSession);
      setProfile(await hydrateProfileForSession(nextSession));
      await syncFirstTimeFlags();
      return {};
    }

    const devProfile: Profile = {
      ...currentProfile,
      id: `dev-${normalizedEmail}`,
      email: normalizedEmail,
      username: normalizedEmail.split("@")[0],
      full_name: normalizedEmail.split("@")[0],
    };
    const devSession = createDevSession(devProfile);

    await persistDevAuth(devSession, devProfile);
    setSession(devSession);
    setProfile(devProfile);
    await syncFirstTimeFlags();

    return {};
  };

  const signUp = async (input: SignUpInput): Promise<AuthResult> => {
    const normalizedEmail = normalizeEmail(input.email);
    const fullName = input.fullName.trim();
    const username = input.username.trim();

    if (!fullName || !username || !normalizedEmail || !input.password) {
      return { error: "Complete all required fields before creating your account." };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { error: "Enter a valid email address." };
    }

    if (input.password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }

    const fallbackProfile: Partial<Profile> = {
      full_name: fullName,
      username,
      email: normalizedEmail,
      city: input.city,
      position: input.position,
      skill_level: input.skillLevel,
      reliability_score: 80,
      verified: false,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: input.password,
        options: {
          data: {
            full_name: fullName,
            username,
            position: input.position,
            skill_level: input.skillLevel,
            city: input.city,
            reliability_score: 80,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (!data.user) {
        return { error: "Account creation failed. Please try again." };
      }

      if (!data.session) {
        return {
          requiresEmailVerification: true,
          message: "Account created. Check your email to confirm your account, then sign in.",
        };
      }

      setSession(data.session);
      setProfile(await hydrateProfileForSession(data.session, fallbackProfile));
      await syncFirstTimeFlags();
      return {};
    }

    const devProfile: Profile = {
      ...currentProfile,
      ...fallbackProfile,
      id: `dev-${normalizedEmail}`,
      email: normalizedEmail,
      full_name: fullName,
      username,
      city: input.city,
      position: input.position,
      skill_level: input.skillLevel,
      reliability_score: 80,
      verified: false,
    };
    const devSession = createDevSession(devProfile);

    await persistDevAuth(devSession, devProfile);
    setSession(devSession);
    setProfile(devProfile);
    await syncFirstTimeFlags();

    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      await clearDevAuth();
    }

    setSession(null);
    setProfile(null);
  };

  const refreshData = async () => {
    if (!isSupabaseConfigured || !session) return;
    setProfile(await hydrateProfileForSession(session, profile ?? undefined));
  };

  const createMatch = async (input: Partial<Match>) => {
    const nextMatch: Match = {
      id: `match-${Date.now()}`,
      title: input.title ?? "New Match",
      type: input.type ?? "Pickup",
      format: input.format ?? "5-a-side",
      skill_level: input.skill_level ?? "Any",
      location: input.location ?? "Custom Location",
      city: profile?.city ?? "Nairobi",
      date: input.date ?? new Date().toISOString().slice(0, 10),
      start_time: input.start_time ?? "18:00",
      end_time: input.end_time ?? "19:00",
      total_cost: input.total_cost ?? 0,
      max_players: input.max_players ?? 10,
      joined_players: 1,
      organiser_name: profile?.full_name ?? currentProfile.full_name,
      organiser_id: profile?.id ?? currentProfile.id,
      status: "Open",
      is_paid: (input.total_cost ?? 0) > 0,
      description: input.description ?? "Created on KickOff Kenya for a quick, reliable match booking flow.",
      organiser_bio: "Organiser details will appear here once connected to live profile data.",
      players: [
        {
          id: `player-${Date.now()}`,
          match_id: `match-${Date.now()}`,
          profile_id: profile?.id ?? currentProfile.id,
          full_name: profile?.full_name ?? currentProfile.full_name,
          initials: getInitials(profile?.full_name ?? currentProfile.full_name),
          status: "waiting",
          paid: (input.total_cost ?? 0) > 0,
          checked_in: false,
        },
      ],
    };

    if (isSupabaseConfigured) {
      await supabase.from("matches").insert({
        title: nextMatch.title,
        type: nextMatch.type,
        format: nextMatch.format,
        skill_level: nextMatch.skill_level,
        location: nextMatch.location,
        city: nextMatch.city,
        date: nextMatch.date,
        start_time: nextMatch.start_time,
        end_time: nextMatch.end_time,
        total_cost: nextMatch.total_cost,
        max_players: nextMatch.max_players,
      });
    }

    setMatchesState((prev) => [nextMatch, ...prev]);
    return nextMatch;
  };

  const dismissFirstTimePrompt = async () => {
    await AsyncStorage.setItem(FIRST_TIME_USER_PROMPTED_KEY, "true");
    setShouldAutoRouteFirstTimeUser(false);
  };

  const joinMatch = async (matchId: string) => {
    const activeProfile = profile ?? currentProfile;
    const targetMatch = matchesState.find((match) => match.id === matchId);

    if (!targetMatch) return { error: "Match not found." };
    if (targetMatch.players.some((player) => player.profile_id === activeProfile.id)) return {};
    if (activeProfile.reliability_score < 50 && targetMatch.total_cost > 0) {
      return { error: "Your reliability score is too low to join paid matches." };
    }

    const isFull = targetMatch.joined_players >= targetMatch.max_players;
    const nextPlayer = {
      id: `player-${Date.now()}`,
      match_id: matchId,
      profile_id: activeProfile.id,
      full_name: activeProfile.full_name,
      initials: getInitials(activeProfile.full_name),
      status: "waiting" as const,
      paid: targetMatch.total_cost === 0,
      checked_in: false,
    };

    setMatchesState((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              joined_players: isFull ? match.joined_players : match.joined_players + 1,
              status: isFull || match.joined_players + 1 >= match.max_players ? "Full" : "Open",
              players: [...match.players, nextPlayer],
            }
          : match,
      ),
    );

    if (!hasJoinedMatch) {
      await AsyncStorage.setItem(HAS_JOINED_MATCH_KEY, "true");
      setHasJoinedMatch(true);
    }

    await scheduleMatchReminder(matchId, buildMatchStartDate(targetMatch.date, targetMatch.start_time).toISOString(), targetMatch.title);
    await scheduleCheckInAlert(matchId, buildMatchStartDate(targetMatch.date, targetMatch.start_time).toISOString(), targetMatch.title);

    return {};
  };

  const updateCheckIn = async (matchId: string) => {
    setMatchesState((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              players: match.players.map((player) =>
                player.profile_id === (profile?.id ?? currentProfile.id)
                  ? { ...player, checked_in: true, status: "in" }
                  : player,
              ),
            }
          : match,
      ),
    );
  };

  const submitRatings = async (_selections: RatingSelection, _tags: string[]) => Promise.resolve();

  const markMatchCompleted = async (matchId: string) => {
    const match = matchesState.find((item) => item.id === matchId);
    if (!match) return;

    setMatchesState((prev) => prev.map((item) => (item.id === matchId ? { ...item, completed: true } : item)));
    await scheduleRatingReminder(match.id, buildMatchEndDate(match.date, match.end_time).toISOString(), match.title);
  };

  const value = useMemo(
    () => ({
      isReady,
      onboardingComplete,
      session,
      profile,
      hasJoinedMatch,
      shouldAutoRouteFirstTimeUser,
      matches: matchesState,
      teams: teamsState,
      turfs: turfsState,
      leaderboard: leaderboardState,
      activities,
      usingMockData,
      completeOnboarding,
      signIn,
      signUp,
      signOut,
      refreshData,
      createMatch,
      joinMatch,
      updateCheckIn,
      submitRatings,
      dismissFirstTimePrompt,
      markMatchCompleted,
    }),
    [
      isReady,
      onboardingComplete,
      session,
      profile,
      hasJoinedMatch,
      shouldAutoRouteFirstTimeUser,
      matchesState,
      teamsState,
      turfsState,
      leaderboardState,
      usingMockData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
};

export function AuthGate() {
  const { isReady, onboardingComplete, session } = useApp();
  const pathname = usePathname();

  if (!isReady) return null;

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboarding = pathname === "/onboarding";

  if (!onboardingComplete && !isOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (onboardingComplete && !session && !isAuthRoute) {
    return <Redirect href="/auth/login" />;
  }

  if (session && (isAuthRoute || isOnboarding || pathname === "/")) {
    return <Redirect href="/(tabs)" />;
  }

  if (!session && onboardingComplete && pathname === "/") {
    return <Redirect href="/auth/login" />;
  }

  return null;
}
