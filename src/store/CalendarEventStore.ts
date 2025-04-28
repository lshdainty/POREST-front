import { create } from 'zustand';
import { TSchedule } from '@/api/schedule';
import moment from 'moment';
import { convertColorCode } from '@/hooks/useCalendarType';

export interface CustomEvent {
  userNo: number;
  userName: string;
  vacationId: number;
  scheduleType: string;
  scheduleDesc: string;
  scheduleTypeName: string;

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
    resetEvents: (schedules: TSchedule[], start: Date, end: Date) => void;
    setEventVisible: (id: number | string, isVisible: boolean, type: string) => void;
  }
}>((set, get) => ({
  events: [],
  actions: {
    resetEvents: (schedules: TSchedule[], start: Date, end: Date) => {
      const sMonth = start.getMonth();
      const eMonth = end.getMonth();
      let cMonth = -1;

      if (document.getElementsByClassName('rbc-toolbar-label').length === 0) {
        cMonth = moment().month();
      } else {
        cMonth = moment(document.getElementsByClassName('rbc-toolbar-label')[0].textContent, 'yyyy.MM').month();
      }

      const _events: CalendarEvent[] = schedules.map(schedule => ({
        id: schedule.schedule_id,
        title: schedule.schedule_desc,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date),
        rawData: {
          userNo: schedule.user_no,
          userName: schedule.user_name,
          vacationId: schedule.vacation_id,
          scheduleType: schedule.schedule_type,
          scheduleTypeName: schedule.schedule_type_name,
          scheduleDesc: schedule.schedule_desc,
          isUserVisible: true,
          isCalendarVisible: true,
          isOffDay: (
            (cMonth !== new Date(schedule.end_date).getMonth() && sMonth === new Date(schedule.end_date).getMonth()) || 
            (cMonth !== new Date(schedule.start_date).getMonth() && eMonth === new Date(schedule.start_date).getMonth())
          ) ? true : false,
          isAllDay: (
            schedule.schedule_type === 'DAYOFF' ||
            schedule.schedule_type === 'EDUCATION' ||
            schedule.schedule_type === 'BIRTHDAY' ||
            schedule.schedule_type === 'BUSINESSTRIP' ||
            schedule.schedule_type === 'DEFENSE' ||
            schedule.schedule_type === 'HEALTHCHECK' ||
            schedule.schedule_type === 'BIRTHPARTY'
          ) ? true : false,
          colorCode: convertColorCode(schedule.schedule_type)
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
            event.rawData.scheduleType === id 
              ? { ...event, rawData: { ...event.rawData, isCalendarVisible: visible } } 
              : event
          )
        }));
    }
  }
}));