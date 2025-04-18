import { EventProps } from 'react-big-calendar';
import moment from 'moment';

import '@/components/calendar/events.scss'

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;

  extendedProps?: {
    userNo?: number;
    userName?: string;
    vacationId?: number;
    scheduleType?: string;
    scheduleDesc?: string;
    scheduleTypeName?: string;

    isVisible?: boolean;
    isOffDay?: boolean;
  }
}

export interface Schedule {
  schedule_id: number;
  user_no: number;
  user_name: string;
  vacation_id: number;
  schedule_type: string;
  schedule_type_name: string;
  schedule_desc: string;
  start_date: Date;
  end_date: Date;
}

export const convertCalendarEvent = (apiData: Schedule[], start: Date, end: Date) => {
  const sMonth = start.getMonth();
  const eMonth = end.getMonth();
  const cMonth = moment(document.getElementsByClassName('rbc-toolbar-label')[0].textContent, 'yyyy.MM').month();

  const data = apiData.map((d: Schedule) => ({
    id: d.schedule_id,
    title: d.schedule_desc || "제목 없음",
    start: new Date(d.start_date),
    end: new Date(d.end_date),
    extendedProps: {
      userNo: d.user_no,
      userName: d.user_name,
      vacationId: d.vacation_id,
      scheduleType: d.schedule_type,
      scheduleTypeName: d.schedule_type_name,
      scheduleDesc: d.schedule_desc,
      isVisible: true,
      isOffDay: (
        (cMonth !== new Date(d.end_date).getMonth() && sMonth === new Date(d.end_date).getMonth()) || 
        (cMonth !== new Date(d.start_date).getMonth() && eMonth === new Date(d.start_date).getMonth())
      ) ? true : false
    }
  }));
  return data;
}

export const convertSchedule = (event: CalendarEvent[]) => {
  const data = event.map((d: CalendarEvent) => ({
    schedule_id: d.id,
    user_no: d.extendedProps?.userNo,
    vacation_id: d.extendedProps?.vacationId,
    schedule_type: d.extendedProps?.scheduleType,
    schedule_desc: d.extendedProps?.scheduleDesc,
    start_date: moment(d.start).format(`yyyy-MM-dd'T'HH:mm:ss`),
    end_date: moment(d.end).format(`yyyy-MM-dd'T'HH:mm:ss`)
  }));
  return data;
}

export const convertEventStyle = (event) => {
  let colorCode: string = '';

  switch(event.extendedProps.scheduleType) {
    case 'DAYOFF':
      colorCode = '#9e5fff';
      break
    case 'MORNINGOFF':
      colorCode = '#00a9ff';
      break
    case 'AFTERNOONOFF':
      colorCode = '#ff5583';
      break
    case 'ONETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'TWOTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'THREETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'FIVETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'SIXTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'SEVENTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'HALFTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'EDUCATION':
      colorCode = '#ff6450';
      break
    case 'BIRTHDAY':
      colorCode = '#7bb65a';
      break
    case 'BUSINESSTRIP':
      colorCode = '#03bd9e';
      break
    case 'DEFENSE':
      colorCode = '#a06549';
      break
    case 'DEFENSEHALF':
      colorCode = '#a06549';
      break
    case 'HEALTHCHECK':
      colorCode = '#707bf5';
      break
    case 'HEALTHCHECKHALF':
      colorCode = '#707bf5';
      break
    case 'BIRTHPARTY':
      colorCode = '#7bb65a';
      break
    default:
  }

  return {
    style: {
      backgroundColor: colorCode,
      opacity: event.extendedProps.isOffDay ? 0.5 : 1
    }
  };
}

const Events: React.FC<EventProps> = ({event}) => {
  return (
    <span>{`${event.extendedProps.userName} ${event.extendedProps.scheduleTypeName}`}</span>
  )
}

export default Events;