import { create } from 'zustand';
import { TCalendar } from '@/api/calendar';
import moment from 'moment';
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
        cMonth = moment().month();
      } else {
        cMonth = moment(document.getElementById('calendarLabel').textContent, 'yyyy.MM').month();
      }

      const _events: CalendarEvent[] = calendar.map(c => ({
        id: idx++,
        title: c.calendar_name,
        start: new Date(c.start_date),
        end: new Date(c.end_date),
        rawData: {
          userNo: c.user_no,
          userName: c.user_name,
          calendarName: c.calendar_name,
          calendarType: c.calendar_type,
          calendarDesc: c.calendar_desc,
          domainType: c.domain_type,
          historyIds: c.history_ids,
          scheduleId: c.schedule_id,
          isUserVisible: true,
          isCalendarVisible: true,
          isOffDay: (
            (cMonth !== new Date(c.end_date).getMonth() && sMonth === new Date(c.end_date).getMonth()) || 
            (cMonth !== new Date(c.start_date).getMonth() && eMonth === new Date(c.start_date).getMonth())
          ) ? true : false,
          isAllDay: (
            c.calendar_type === 'DAYOFF' ||
            c.calendar_type === 'EDUCATION' ||
            c.calendar_type === 'BIRTHDAY' ||
            c.calendar_type === 'BUSINESSTRIP' ||
            c.calendar_type === 'DEFENSE' ||
            c.calendar_type === 'HEALTHCHECK' ||
            c.calendar_type === 'BIRTHPARTY'
          ) ? true : false,
          colorCode: convertColorCode(c.calendar_type)
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