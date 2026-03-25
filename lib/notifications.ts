import * as Notifications from "expo-notifications";

const toDate = (date: string, time: string) => new Date(`${date}T${time}:00`);

const scheduleIfFuture = async (triggerDate: Date, title: string, body: string, data: Record<string, string>) => {
  if (triggerDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
};

export async function scheduleMatchReminder(matchId: string, matchDate: string, matchTitle: string) {
  const matchStart = new Date(matchDate);
  const triggerDate = new Date(matchStart.getTime() - 2 * 60 * 60 * 1000);

  return scheduleIfFuture(
    triggerDate,
    "Match Reminder",
    `⏰ ${matchTitle} starts in 2 hours. Don't forget to check in!`,
    { matchId },
  );
}

export async function scheduleCheckInAlert(matchId: string, matchDate: string, matchTitle: string) {
  const matchStart = new Date(matchDate);
  const triggerDate = new Date(matchStart.getTime() - 30 * 60 * 1000);

  return scheduleIfFuture(
    triggerDate,
    "Check In Now",
    `📍 ${matchTitle} starts in 30 minutes. Check in now!`,
    { matchId },
  );
}

export async function scheduleRatingReminder(matchId: string, matchEndTime: string, matchTitle: string) {
  const end = new Date(matchEndTime);
  const triggerDate = new Date(end.getTime() + 90 * 60 * 1000);

  return scheduleIfFuture(
    triggerDate,
    "Rate Your Teammates",
    `⭐ Rate your teammates from ${matchTitle}. Takes 60 seconds.`,
    { matchId },
  );
}

export const buildMatchStartDate = (date: string, time: string) => toDate(date, time);
export const buildMatchEndDate = (date: string, time: string) => toDate(date, time);
