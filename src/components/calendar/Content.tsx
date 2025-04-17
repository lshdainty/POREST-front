import { Calendar, momentLocalizer, HeaderProps, DateHeaderProps, DateRangeFormatFunction, Views } from 'react-big-calendar'
import { useState, useEffect, useCallback } from 'react';
import { getPeriodSchedules } from '@/api/schedule';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import CustomToolbarComponent from '@/components/calendar/CustomToolbar'
import CalendarEventsComponent, { CalendarEvent, convertCalendarEvent, convertEventStyle } from '@/components/calendar/CustomEvents'
import moment from 'moment';
// @ts-ignore
import 'moment/dist/locale/ko';

import '@/components/calendar/content.scss'

const customDayRangeHeaderFormat:DateRangeFormatFunction = (range) => {
  let start = range.start, end = range.end;
  return `${moment(start).format('YY.MM.DD')} ~ ${moment(end).format('YY.MM.DD')}`;
}

const formats = {
  monthHeaderFormat: 'YYYY.MM',
  dayHeaderFormat: 'MM.DD ddd',
  dayRangeHeaderFormat: customDayRangeHeaderFormat
}

const CustomMonthHeader: React.FC<HeaderProps> = ({ label, date }) => {
    let className:string = '';
    if (date.getDay() === 0) className = 'rbc-sunday';
    if (date.getDay() === 6) className = 'rbc-saturday';
    return <span className={className} role='columnheader' aria-sort='none'>{ label }</span>
    ;
}

const CustomMonthDateHeader: React.FC<DateHeaderProps> = ({ label, date }) => {
  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return <button type='button' className={`rbc-button-link ${className}`}>{ label }</button>
}

const Content: React.FC = () => {
  moment.locale('ko');
  const DragAndDropCalendar = withDragAndDrop(Calendar);
  const localizer = momentLocalizer(moment);
  const [ events, setEvents ] = useState<CalendarEvent[]>([]);
  const [visibleRange, setVisibleRange] = useState<{start: Date, end: Date} | null>(null);

  const fetchPeriodSchedules = async (start: Date, end: Date) => {
    const resp = await getPeriodSchedules(moment(start).format("yyyy-MM-DDTHH:mm:ss"), moment(end).format("yyyy-MM-DDTHH:mm:ss"));
    setEvents(convertCalendarEvent(resp.data));
  }

  useEffect(() => {
    const now = new Date();
    fetchPeriodSchedules(
      moment(now).startOf('month').startOf('week').toDate(),
      moment(now).endOf('month').endOf('week').toDate()
    );
  }, []);

  // const handleRangeChange = (range: Date[] | { start: Date, end: Date }) => {
  //   let start, end;
    
  //   if (Array.isArray(range)) {
  //     start = range[0];
  //     end = range[range.length - 1];
  //   } else {
  //     start = range.start;
  //     end = range.end;
  //   }
    
  //   // setVisibleRange({ start, end });
  //   // fetchEventsAndSetOffDay(start, end);
  // };

  return (
    <DragAndDropCalendar
      localizer={localizer}
      formats={formats}
      resizable
      selectable
      events={events}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      showAllEvents={true}
      components={{
        toolbar: CustomToolbarComponent,
        // event: CalendarEventsComponent,
        month: {
          header: CustomMonthHeader,
          dateHeader: CustomMonthDateHeader
        }
      }}
      style={{ height: '100%', width: '100%' }}
      eventPropGetter={convertEventStyle}
      // onRangeChange={handleRangeChange}
    />
  );
};

export default Content;