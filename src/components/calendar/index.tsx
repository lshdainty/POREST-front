import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { Formats } from '@/components/calendar/Formats';
import Toolbar from '@/components/calendar/Toolbar';
import Events, { convertEventStyle } from '@/components/calendar/Events';
import { MonthHeader, MonthDateHeader } from '@/components/calendar/Headers';
import { RegistEventDialog } from '@/components/calendar/RegistEventDialog';
import { CalendarEvent, useCalendarEventsStore } from '@/store/CalendarEventStore';
import { useHolidayStore } from '@/store/HolidayStore';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { useGetEventsByPeriod } from '@/api/calendar';
import { useGetHolidaysByStartEndDate } from '@/api/holiday';
import moment from 'moment';
import dayjs from 'dayjs';
// @ts-ignore
import 'moment/dist/locale/ko';

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '@/components/calendar/index.scss';

const Content: React.FC = () => {
  const DragAndDropCalendar = withDragAndDrop(Calendar);
  // local화
  moment.locale('ko');
  const localizer = momentLocalizer(moment);

  // schedule 관리
  const { events } = useCalendarEventsStore();
  const { resetEvents, setEventVisible } = useCalendarEventsStore(s => s.actions);
  const { userVisibles, calendarVisibles } = useCalendarVisibleStore();

  // 공휴일 관리
  const { baseYear } = useHolidayStore();
  const { setHolidays } = useHolidayStore(s => s.actions);

  // selectSlot 관리
  const { setSlots, setOpen } = useCalendarSlotStore(s => s.actions);

  // view 관리
  const [view, setView] = useState(Views.MONTH);
  const onView = useCallback((newView: any) => setView(newView), [setView]);

  // month 달력 범위 관리
  const [range, setRange] = useState<{start: Date, end: Date}>({
    start: moment(new Date()).startOf('month').startOf('week').toDate(),
    end: moment(new Date()).endOf('month').endOf('week').toDate()
  });

  // range 변경 부분
  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onRangeChange = useCallback((range: Date[] | {start: Date, end: Date}) => {
    if (Array.isArray(range)) {
      setRange({start: range[0], end: range[range.length - 1]});
    } else {
      setRange({start: range.start, end: range.end});
    }
  }, [resetEvents]);

  const {data: holidays, isLoading: holidaysLoading} = useGetHolidaysByStartEndDate({
    start_date: `${baseYear}0101`,
    end_date: `${baseYear}1231`
  });

  const {data: calendarData, isLoading: calendarLoading} = useGetEventsByPeriod({
    start_date: dayjs(range.start).format('YYYY-MM-DDTHH:mm:ss'),
    end_date: dayjs(range.end).format('YYYY-MM-DDTHH:mm:ss')
  });

  const handleSelectSlot = useCallback(({start, end}: { start: Date; end: Date; }) => {
    setSlots(start, moment(end).subtract(1, 'seconds').toDate());
    setOpen(true);
  }, [setSlots, setOpen]);

  useEffect(() => {
    if (holidays && !holidaysLoading) {
      setHolidays(holidays);
    }
  }, [holidays]);

  useEffect(() => {
    if (calendarData && !calendarLoading && range) {
      resetEvents(calendarData, range.start, range.end);
      calendarVisibles.forEach(calendar => {
        setEventVisible(calendar.id, calendar.isVisible, 'calendar');
      });
      userVisibles.forEach(user => {
        setEventVisible(user.id, user.isVisible, 'user');
      });
    }
  }, [calendarData, range]);

  return (
    <>
      <DragAndDropCalendar
        // 날짜 local화
        localizer={localizer}
        // 시간 날짜 포맷
        formats={Formats}
        resizable
        selectable
        // schedule data
        events={events.filter((ev: CalendarEvent) => ev.rawData.isUserVisible && ev.rawData.isCalendarVisible)}
        // calendar view option
        view={view}
        onView={onView}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        // cell에 모든 이벤트 보이도록함
        showAllEvents={true}
        components={{
          toolbar: Toolbar,
          event: Events,
          month: {
            header: MonthHeader,
            dateHeader: MonthDateHeader
          }
        }}
        style={{ height: '100%', width: '100%' }}
        // 각 이벤트 스타일 설정
        eventPropGetter={convertEventStyle}
        // next, today, prev에 따른 동작 설정
        date={date}
        onNavigate={onNavigate}
        onRangeChange={onRangeChange}

        // drag and drop
        // onEventDrop={test}
        // onEventResize={resizeEvent}

        onSelectSlot={handleSelectSlot}
      />
      <RegistEventDialog />
    </>
  );
};

export default Content;