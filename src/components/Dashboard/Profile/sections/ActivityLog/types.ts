export interface ApiActivityLogGet {
  id: number;
  date: string;
  hours: number;
}

export interface ApiActivityLogPost {
  date: string;
  hours: number;
}

export type ApiActivityLogPatch = Partial<ApiActivityLogPost>;

export interface ActivityLogFormData {
  date: Date;
  hours: number;
}
