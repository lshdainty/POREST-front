import { create } from 'zustand';
import { TCalendar } from '@/types/calendar';
import dayjs from 'dayjs';
import { convertColorCode } from '@/hooks/useCalendarType';

export interface CustomEvent {
  userNo: number;
  userName: string;
  calendarName: string;
  calendarType: string;
  calendarDesc: string;
  domainType: string;
  historyIds: number[];
  scheduleId: number;

  isUserVisible: boolean;
  isCalendarVisible: boolean;
  isOffDay: boolean;
  isAllDay: boolean;
  colorCode: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  rawData: CustomEvent;
}

export const useCalendarEventsStore = create<{
  events: CalendarEvent[];
  actions: {
    resetEvents: (calendar: TCalendar[], start: Date, end: Date) => void;
    setEventVisible: (id: number | string, isVisible: boolean, type: string) => void;
  }
}>((set, get) => ({
  events: [],
  actions: {
    resetEvents: (calendar: TCalendar[], start: Date, end: Date) => {
      const sMonth = start.getMonth();
      const eMonth = end.getMonth();
      let cMonth = -1;
      let idx = 0;

      if (document.getElementById('calendarLabel') === undefined || document.getElementById('calendarLabel') === null) {
        cMonth = dayjs().month();
      } else {
        cMonth = dayjs(document.getElementById('calendarLabel').textContent, 'YYYY.MM').month();;
      }

      const _events: CalendarEvent[] = calendar.map(c => ({
        id: idx++,
        title: c.calendarName,
        start: new Date(c.startDate),
        end: new Date(c.endDate),
        rawData: {
          userNo: c.userNo,
          userName: c.userName,
          calendarName: c.calendarName,
          calendarType: c.calendarType,
          calendarDesc: c.calendarDesc,
          domainType: c.domainType,
          historyIds: c.historyIds,
          scheduleId: c.scheduleId,
          isUserVisible: true,
          isCalendarVisible: true,
          isOffDay: (
            (cMonth !== new Date(c.endDate).getMonth() && sMonth === new Date(c.endDate).getMonth()) || 
            (cMonth !== new Date(c.startDate).getMonth() && eMonth === new Date(c.startDate).getMonth())
          ) ? true : false,
          isAllDay: (
            c.calendarType === 'DAYOFF' ||
            c.calendarType === 'EDUCATION' ||
            c.calendarType === 'BIRTHDAY' ||
            c.calendarType === 'BUSINESSTRIP' ||
            c.calendarType === 'DEFENSE' ||
            c.calendarType === 'HEALTHCHECK' ||
            c.calendarType === 'BIRTHPARTY'
          ) ? true : false,
          colorCode: convertColorCode(c.calendarType)
        }
      }));
      set({ events: _events });
    },
    setEventVisible: (id: number | string, visible: boolean, type: string) => {
      set((state) => (
        (type === 'user') ? {
          events: state.events.map(event => 
            event.rawData.userNo === id 
              ? { ...event, rawData: { ...event.rawData, isUserVisible: visible } } 
              : event
          )
        } : {
          events: state.events.map(event => 
            event.rawData.calendarType === id 
              ? { ...event, rawData: { ...event.rawData, isCalendarVisible: visible } } 
              : event
          )
        }));
    }
  }
}));