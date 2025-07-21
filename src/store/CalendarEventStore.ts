import { create } from 'zustand';
import dayjs from 'dayjs';
import { convertColorCode } from '@/hooks/useCalendarType';

export interface CustomEvent {
  userId: string;
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
  resource: CustomEvent;
}

export const useCalendarEventsStore = create<{
  events: CalendarEvent[];
  actions: {
    resetEvents: (calendarEvent: {
      user_id: string;
      user_name: string;
      calendar_name: string;
      calendar_type: string;
      calendar_desc: string;
      start_date: Date;
      end_date: Date;
      domain_type: string;
      history_ids: number[];
      schedule_id: number;
    }[], calendarRange: {start: Date, end: Date}) => void;
    setEventVisible: (id: number | string, isVisible: boolean, type: string) => void;
  }
}>((set, get) => ({
  events: [],
  actions: {
    resetEvents: (calendarEvent: {
      user_id: string;
      user_name: string;
      calendar_name: string;
      calendar_type: string;
      calendar_desc: string;
      start_date: Date;
      end_date: Date;
      domain_type: string;
      history_ids: number[];
      schedule_id: number;
    }[], calendarRange: {start: Date, end: Date}) => {
      const sMonth = calendarRange.start.getMonth();
      const eMonth = calendarRange.end.getMonth();
      let cMonth = -1;
      let idx = 0;

      const label = document.getElementById('calendarLabel');
      if (label === undefined ||label === null) {
        cMonth = dayjs().month();
      } else {
        cMonth = dayjs(label.textContent, 'YYYY.MM').month();
      }

      const _events: CalendarEvent[] = calendarEvent.map(c => ({
        id: idx++,
        title: c.calendar_name,
        start: new Date(c.start_date),
        end: new Date(c.end_date),
        resource: {
          userId: c.user_id,
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
            event.resource.userId === id 
              ? { ...event, resource: { ...event.resource, isUserVisible: visible } } 
              : event
          )
        } : {
          events: state.events.map(event => 
            event.resource.calendarType === id 
              ? { ...event, resource: { ...event.resource, isCalendarVisible: visible } } 
              : event
          )
        }));
    }
  }
}));