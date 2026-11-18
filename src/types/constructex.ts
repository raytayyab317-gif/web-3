export type PageRoute =
  | 'home'
  | 'projects'
  | 'weather'
  | 'about'
  | 'contact'
  | 'signin'
  | 'signup';

export const PROJECT_CATEGORIES = [
  'Luxury Residential',
  'Commercial Framing',
  'Level-5 Finishing',
  'Acoustic Systems',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = [
  'Pending Quote',
  'In Progress',
  'Completed',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const GTA_CITIES = [
  'Toronto',
  'Mississauga',
  'Vaughan',
  'Markham',
  'Oakville',
  'Brampton',
] as const;

export type GtaCity = (typeof GTA_CITIES)[number];

export interface ProjectRecord {
  id: string;
  title: string;
  clientName: string;
  city: GtaCity;
  category: ProjectCategory;
  squareFootage: number;
  estimateAmount: number;
  status: ProjectStatus;
  targetDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormInput {
  title: string;
  clientName: string;
  city: GtaCity;
  category: ProjectCategory;
  squareFootage: string;
  estimateAmount: string;
  status: ProjectStatus;
  targetDate: string;
  notes: string;
}

export type SortField = 'updatedAt' | 'estimateAmount' | 'squareFootage' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface ProjectFilters {
  query: string;
  category: 'All' | ProjectCategory;
  status: 'All' | ProjectStatus;
  city: 'All' | GtaCity;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ProjectFormInput, string>>;
  duplicateWarning: string | null;
}

export interface PortfolioStats {
  totalProjects: number;
  activeCount: number;
  completedCount: number;
  pendingCount: number;
  totalEstimateCad: number;
  totalSquareFeet: number;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  signedInAt: string;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  windMax: number;
}

export interface SiteWeatherData {
  city: GtaCity;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  current: {
    temperatureC: number;
    apparentTempC: number;
    humidityPct: number;
    windSpeedKmh: number;
    precipitationMm: number;
    weatherCode: number;
  };
  daily: DailyForecastItem[];
}
