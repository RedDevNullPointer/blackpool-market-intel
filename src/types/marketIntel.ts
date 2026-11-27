export interface EventItem {
  name: string;
  date: string;
  venue: string;
  link: string;
}

export interface HotelMarketData {
  target_window: string;
  check_in_date: string;
  avg_rate_gbp: number | null;
  available_properties: number;
  sold_out_properties: number;
  total_checked: number;
  demand_level: string;
  carlton_status: string;
  carlton_rate_gbp: number | null;
}

export interface BusyRiskData {
  level: "Low" | "Moderate" | "High";
  color: "green" | "orange" | "red";
  score: number;
  reasons: string[];
}

export interface HolidaysData {
  is_school_holiday: boolean;
  active_school_holiday: string | null;
  active_nations: string[];
  next_school_holiday: {
    name: string;
    start: string;
    nations: string[];
    days_until: number;
  } | null;
  is_bank_holiday_monday: boolean;
  bank_holiday_weekend_soon: boolean;
  next_bank_holiday_monday: {
    title: string;
    date: string;
    region: string;
    days_until: number;
  } | null;
}

export interface MatchdayData {
  is_home_matchday: boolean;
  today_fixture: {
    date: string;
    kickoff: string;
    opponent: string;
    competition: string;
  } | null;
  next_fixture: {
    date: string;
    kickoff: string;
    opponent: string;
    competition: string;
    days_until: number;
  } | null;
}

export interface LocalDiningOffer {
  title: string;
  offer_tag?: string;
  source: string;
  snippet: string;
  link: string;
}

export interface MarketIntelData {
  location: string;
  timestamp: string;
  busy_risk?: BusyRiskData;
  weather: {
    condition: string;
    temp_celsius: number;
    wind_speed_mph: number;
  };
  rail?: {
    station: string;
    status: string;
    delayed_trains: number;
    cancelled_trains: number;
    total_checked: number;
    next_affected_route: string | null;
  };
  traffic: {
    m55_inbound_status: string;
    delay_minutes: number;
  };
  hotel_market?: HotelMarketData;
  holidays?: HolidaysData;
  matchday?: MatchdayData;
  local_dining_offers?: LocalDiningOffer[];
  events?: EventItem[];
  commercial_recommendation: string;
}
