export interface SpecialDay {
  id: string;
  name: string;
  category: "Drinks & Bar" | "Local & Cultural" | "Hospitality Peak";
  month: number;
  day: number;
  fbTip: string;
}

export interface UpcomingSpecialDay extends SpecialDay {
  dateLabel: string;
  daysUntil: number;
}

const FIXED_SPECIAL_DAYS: SpecialDay[] = [
  {
    id: "burns-night",
    name: "Burns Night",
    category: "Local & Cultural",
    month: 1,
    day: 25,
    fbTip: "Feature single malt Scotch flights and themed supper specials.",
  },
  {
    id: "valentines-day",
    name: "Valentine's Day",
    category: "Hospitality Peak",
    month: 2,
    day: 14,
    fbTip: "Prep prosecco/champagne stock and set two-top dining covers.",
  },
  {
    id: "st-patricks-day",
    name: "St Patrick's Day",
    category: "Drinks & Bar",
    month: 3,
    day: 17,
    fbTip: "Increase stout, Irish whiskey, and Baby Guinness prep.",
  },
  {
    id: "whiskey-day",
    name: "International Whisk(e)y Day",
    category: "Drinks & Bar",
    month: 3,
    day: 27,
    fbTip: "Highlight Old Fashioneds, Whiskey Sours, and top-shelf drams.",
  },
  {
    id: "st-georges-day",
    name: "St George's Day",
    category: "Local & Cultural",
    month: 4,
    day: 23,
    fbTip: "Promote English gins, cask ales, and classic British mains.",
  },
  {
    id: "national-wine-day",
    name: "National Wine Day",
    category: "Drinks & Bar",
    month: 5,
    day: 25,
    fbTip: "Push bottle-to-table upsells and wine-by-the-glass flights.",
  },
  {
    id: "national-beer-day",
    name: "National Beer Day (UK)",
    category: "Drinks & Bar",
    month: 6,
    day: 15,
    fbTip: "Feature local Lancashire brewery pours and draught promos.",
  },
  {
    id: "national-rum-day",
    name: "National Rum Day",
    category: "Drinks & Bar",
    month: 8,
    day: 16,
    fbTip: "Spotlight Mojitos, Daiquiris, and spiced rum mixers.",
  },
  {
    id: "international-mens-day",
    name: "International Men's Day",
    category: "Local & Cultural",
    month: 11,
    day: 19,
    fbTip: "Great hook for steak & pint night or charity bar tie-in.",
  },
  {
    id: "lancashire-day",
    name: "Lancashire Day",
    category: "Local & Cultural",
    month: 11,
    day: 27,
    fbTip: "Spotlight Lancashire Hotpot, regional cheeses, and local ales.",
  },
  {
    id: "nye",
    name: "New Year's Eve",
    category: "Hospitality Peak",
    month: 12,
    day: 31,
    fbTip: "Max bar staffing, sparkling wine chill capacity, and glassware.",
  },
];

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number,
): Date {
  const firstDay = new Date(year, month - 1, 1);
  const offset = (weekday - firstDay.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + offset + (n - 1) * 7);
}

function getBlackEyeFriday(year: number): Date {
  const dec24 = new Date(year, 11, 24);
  const diff = (dec24.getDay() - 5 + 7) % 7;
  return new Date(year, 11, 24 - diff);
}

function getMoveableDays(year: number): SpecialDay[] {
  const worldGinDay = getNthWeekdayOfMonth(year, 6, 6, 2);
  const fathersDay = getNthWeekdayOfMonth(year, 6, 0, 3);
  const blackEyeFriday = getBlackEyeFriday(year);

  return [
    {
      id: "world-gin-day",
      name: "World Gin Day",
      category: "Drinks & Bar",
      month: worldGinDay.getMonth() + 1,
      day: worldGinDay.getDate(),
      fbTip: "Run a G&T garnish bar or two-for-one signature gin serves.",
    },
    {
      id: "fathers-day",
      name: "Father's Day (UK)",
      category: "Hospitality Peak",
      month: fathersDay.getMonth() + 1,
      day: fathersDay.getDate(),
      fbTip: "Expect heavy Sunday lunch covers and draught/whiskey demand.",
    },
    {
      id: "black-eye-friday",
      name: "Black Eye Friday",
      category: "Hospitality Peak",
      month: blackEyeFriday.getMonth() + 1,
      day: blackEyeFriday.getDate(),
      fbTip: "Peak Christmas party night—reinforce bar & floor staffing.",
    },
  ];
}

function getUkToday(): Date {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return new Date(year, month - 1, day);
}

export function getNextSpecialDay(): UpcomingSpecialDay {
  const today = getUkToday();
  const currentYear = today.getFullYear();
  const allEvents = [...FIXED_SPECIAL_DAYS, ...getMoveableDays(currentYear)];

  const upcoming = allEvents
    .map((event) => {
      let target = new Date(currentYear, event.month - 1, event.day);
      if (target < today) {
        const nextYearMoveable = getMoveableDays(currentYear + 1).find(
          (e) => e.id === event.id,
        );
        target = new Date(
          currentYear + 1,
          (nextYearMoveable?.month ?? event.month) - 1,
          nextYearMoveable?.day ?? event.day,
        );
      }

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysUntil = Math.round(
        (target.getTime() - today.getTime()) / msPerDay,
      );
      const dateLabel = target.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      return {
        ...event,
        dateLabel,
        daysUntil,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return upcoming[0];
}
