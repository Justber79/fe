export type OpportunityMarker = {
  lat: number;
  lon: number;
  label: string;
  children?: Array<{ title: string; link: string; language: string; availability: string }>;
  onClick: () => null;
  avatarUrl?: string;
};

export type VolunteerMarker = {
  lat: number;
  lon: number;
  label: string;
  title: string;
  link: string;
  language: string;
  availability: string;
  avatarUrl: string;
  onClick?: () => null;
};

export type EntityMarker = OpportunityMarker | VolunteerMarker;

export type BerlinRacMarker = {
  id: string;
  lat: number;
  lon: number;
  type: string;
  district: string;
  area: string;
  street: string;
};
