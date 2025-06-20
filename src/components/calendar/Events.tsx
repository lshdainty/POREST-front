import { EventProps } from 'react-big-calendar';
import { convertColorCode } from '@/hooks/useCalendarType';
import moment from 'moment';
import { Popover } from 'antd';
import { AccessTime, Person, Circle, Description } from '@mui/icons-material';

import '@/components/calendar/events.scss'

export const convertEventStyle = (event) => {
  return {
    style: {
      backgroundColor: convertColorCode(event.rawData.calendarType),
      opacity: event.rawData.isOffDay ? 0.5 : 1
    }
  };
}

const EventPopup: React.FC<EventProps> = (props) => {
  const event = props.event;
  const start = (event.rawData.isAllDay === true) ? moment(event.start).format('yyyy-MM-DD') : moment(event.start).format('yyyy-MM-DD HH:mm');
  const end = (event.rawData.isAllDay === true) ? moment(event.end).format('yyyy-MM-DD') : moment(event.end).format('HH:mm');

  return (
    <>
    <div className='rbc-event-content-detail'>
      <div className='rbc-event-content-detail-title'>{`${event.rawData.userName} ${event.rawData.calendarName}`}</div>
      <div className='rbc-event-content-detail-text'><AccessTime />{`${start} - ${end}`}</div>
      <div className='rbc-event-content-detail-text'><Person />{event.rawData.userName}</div>
      <div className='rbc-event-content-detail-text'><Circle sx={{color:event.rawData.colorCode}} />{event.rawData.calendarName}</div>
      <div className='rbc-event-content-detail-text'><Description />{event.rawData.calendarDesc}</div>
    </div>
    <div className='rbc-event-content-detail-line' style={{backgroundColor:event.rawData.colorCode}}></div>
    </>
  );
}

const Events: React.FC<EventProps> = (props) => {
  const event = props.event;

  return (
    <Popover content={<EventPopup {...props} />} trigger="click">
      <div>{`${event.rawData.userName} ${event.rawData.calendarName}`}</div>
    </Popover>
  );
}

export default Events;