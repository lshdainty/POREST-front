import {EventProps} from 'react-big-calendar';
import moment from 'moment';
import {Popover} from 'antd';
import {AccessTime, Person, Circle, Description} from '@mui/icons-material';

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
    isAllDay?: boolean;
    colorCode?: string;
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
    title: d.schedule_desc,
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
      ) ? true : false,
      isAllDay: (
        d.schedule_type === 'DAYOFF' ||
        d.schedule_type === 'EDUCATION' ||
        d.schedule_type === 'BIRTHDAY' ||
        d.schedule_type === 'BUSINESSTRIP' ||
        d.schedule_type === 'DEFENSE' ||
        d.schedule_type === 'HEALTHCHECK' ||
        d.schedule_type === 'BIRTHPARTY'
      ) ? true : false,
      colorCode: convertColorCode(d.schedule_type)
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

const convertColorCode = (scheduleType: string) => {
  let colorCode = '';

  switch(scheduleType) {
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

  return colorCode;
}

const EventPopup: React.FC<EventProps> = (props) => {
  const event = props.event;
  const start = (event.extendedProps.isAllDay === true) ? moment(event.start).format('yyyy-MM-DD') : moment(event.start).format('yyyy-MM-DD HH:mm')
  const end = (event.extendedProps.isAllDay === true) ? moment(event.end).format('yyyy-MM-DD') : moment(event.end).format('HH:mm')

  console.log(event);

  return (
    <>
    <div className='rbc-event-content-detail'>
      <div className='rbc-event-content-detail-title'>{`${event.extendedProps.userName} ${event.extendedProps.scheduleTypeName}`}</div>
      <div className='rbc-event-content-detail-text'><AccessTime />{`${start} - ${end}`}</div>
      <div className='rbc-event-content-detail-text'><Person />{event.extendedProps.userName}</div>
      <div className='rbc-event-content-detail-text'><Circle sx={{color:event.extendedProps.colorCode}} />{event.extendedProps.scheduleTypeName}</div>
      <div className='rbc-event-content-detail-text'><Description />{event.extendedProps.scheduleDesc}</div>
    </div>
    <div className='rbc-event-content-detail-line' style={{backgroundColor:event.extendedProps.colorCode}}></div>
    </>
  );
}

const Events: React.FC<EventProps> = (props) => {
  const event = props.event;

  return (
    <Popover content={<EventPopup {...props} />} trigger="click">
      <div>{`${event.extendedProps.userName} ${event.extendedProps.scheduleTypeName}`}</div>
    </Popover>
  );
}

export default Events;