export interface TCalendar {
  userNo: number;
  userName: string;
  calendarName: string;
  calendarType: string;
  calendarDesc: string;
  startDate: Date;
  endDate: Date;
  domainType: string;
  historyIds: number[];
  scheduleId: number;
}