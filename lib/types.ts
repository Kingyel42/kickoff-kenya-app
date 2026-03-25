export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Pro" | "Any";
export type MatchStatus = "Open" | "Full";
export type MatchType = "Pickup" | "Competitive" | "Challenge" | "Tournament";
export type MatchFormat = "5-a-side" | "6-a-side" | "7-a-side" | "8-a-side" | "11-a-side";
export type CheckInStatus = "in" | "on_the_way" | "waiting";
export type TurfFilter = "All" | "Available Now" | "Floodlit" | "Indoor";
export type LeaderboardFilter = "Top Scorers" | "Most Wins" | "Top Rated" | "Assists";
export type TeamFilter = "My Teams" | "Discover" | "Recruiting";
export type ReliabilityTier = "Elite" | "Good" | "Caution" | "Restricted";

export type Profile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  city: string;
  position: Position;
  skill_level: Exclude<SkillLevel, "Any">;
  reliability_score: number;
  matches: number;
  wins: number;
  goals: number;
  assists: number;
  rating: number;
  verified: boolean;
};

export type MatchPlayer = {
  id: string;
  match_id: string;
  profile_id: string;
  full_name: string;
  initials: string;
  status: CheckInStatus;
  paid: boolean;
  checked_in: boolean;
};

export type Match = {
  id: string;
  title: string;
  type: MatchType;
  format: MatchFormat;
  skill_level: SkillLevel;
  location: string;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  max_players: number;
  joined_players: number;
  organiser_name: string;
  organiser_id: string;
  status: MatchStatus;
  is_paid: boolean;
  description?: string;
  organiser_bio?: string;
  completed?: boolean;
  players: MatchPlayer[];
};

export type Team = {
  id: string;
  name: string;
  city: string;
  role: string;
  initials: string;
  skill_level: Exclude<SkillLevel, "Any">;
  matches: number;
  wins: number;
  win_rate: number;
  recruiting: boolean;
};

export type Turf = {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  price_per_hour: number;
  amenities: string[];
  available_now: boolean;
  floodlit: boolean;
  indoor: boolean;
};

export type Activity = {
  id: string;
  match_name: string;
  date: string;
  goals: number;
  assists: number;
  result: "WIN" | "DRAW" | "LOSS";
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  initials: string;
  position: Position;
  location: string;
  value: number;
  isCurrentUser?: boolean;
};

export type RatingSelection = Record<string, "up" | "down" | null>;
