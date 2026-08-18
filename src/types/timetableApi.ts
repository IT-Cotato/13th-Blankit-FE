export interface TimetableRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  title: string;
  place?: string;
  color: string;
}

export type TimetableUpdateRequest = Partial<TimetableRequest>;

export interface TimetableResponse {
  timetableId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  title: string;
  place: string | null;
  color: string;
}

export interface TimetablesWithDisplayResponse {
  timetables: TimetableResponse[];
  displayStartTime: string;
  displayEndTime: string;
}

export interface TimetableWithDisplayResponse {
  timetable: TimetableResponse;
  displayStartTime: string;
  displayEndTime: string;
}

export interface TimetableSettingsRequest {
  startTime: string;
  endTime: string;
}

export interface TimetableSettingsResponse {
  timetableStartTime: string;
  timetableEndTime: string;
}
