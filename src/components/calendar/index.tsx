import {useState, useEffect, useCallback} from 'react';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import withDragAndDrop, {withDragAndDropProps} from 'react-big-calendar/lib/addons/dragAndDrop';
import {Formats} from '@/components/calendar/Formats';
import Toolbar from '@/components/calendar/Toolbar';
import Events, {CalendarEvent, convertCalendarEvent, convertEventStyle} from '@/components/calendar/Events';
import {MonthHeader, MonthDateHeader} from '@/components/calendar/Headers';
import {useHolidayStore, convertHoliday} from '@/store/HolidayStore';
import {getPeriodSchedules} from '@/api/schedule';
import {getHolidayByStartEndDate} from '@/api/holiday';
import {Button, Popover} from 'antd';
import moment from 'moment';
// @ts-ignore
import 'moment/dist/locale/ko';

import '@/components/calendar/index.scss';
import { json } from 'react-router-dom';

const Content: React.FC = () => {
  const DragAndDropCalendar = withDragAndDrop(Calendar);
  // local화
  moment.locale('ko');
  const localizer = momentLocalizer(moment);
  // schedule 관리
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // 공휴일 관리
  const {baseYear} = useHolidayStore();
  const {setHolidays} = useHolidayStore(s => s.actions);

  // view 관리
  const [view, setView] = useState(Views.MONTH);
  const onView = useCallback((newView) => setView(newView), [setView]);

  // range 변경 부분
  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onRangeChange = useCallback((range: Date[] | {start: Date, end: Date}) => {
    let _start, _end;

    if (Array.isArray(range)) {
      _start = range[0];
      _end = range[range.length - 1];
    } else {
      _start = range.start;
      _end = range.end;
    }

    fetchPeriodSchedules(_start, _end);
  }, []);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      console.log('moveEvent event : ', event)
      console.log('moveEvent start : ', start)
      console.log('moveEvent end : ', end)
      console.log('moveEvent isAllDay : ', droppedOnAllDaySlot)


      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      if (allDay && !droppedOnAllDaySlot) {
          event.allDay = false;
      }

      // setMyEvents((prev) => {
      //   const existing = prev.find((ev) => ev.id === event.id) ?? {}
      //   const filtered = prev.filter((ev) => ev.id !== event.id)
      //   return [...filtered, { ...existing, start, end, allDay: event.allDay }]
      // })
    },
    [setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      console.log('resizeEvent event : ', event)
      console.log('resizeEvent start : ', start)
      console.log('resizeEvent end : ', end)

      // setMyEvents((prev) => {
      //   const existing = prev.find((ev) => ev.id === event.id) ?? {}
      //   const filtered = prev.filter((ev) => ev.id !== event.id)
      //   return [...filtered, { ...existing, start, end }]
      // })
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      return (
        <>
          {/* <Popover content={JSON.stringify(event)} title="Title" trigger="click">
            <Button>Click me</Button>
          </Popover> */}
        </>
      )
    },
    []
  );

  const fetchPeriodSchedules = async (start: Date, end: Date) => {
    const resp = await getPeriodSchedules(
      moment(start).format('yyyy-MM-DDTHH:mm:ss'),
      moment(end).format('yyyy-MM-DDTHH:mm:ss')
    );
    setEvents(convertCalendarEvent(resp.data, start, end));
  }

  const fetchHolidays = async (start: string, end: string) => {
    const resp = await getHolidayByStartEndDate(start, end);
    setHolidays(convertHoliday(resp.data));
  }

  useEffect(() => {
    const now = new Date();
    fetchPeriodSchedules(
      moment(now).startOf('month').startOf('week').toDate(),
      moment(now).endOf('month').endOf('week').toDate()
    );
  }, []);

  useEffect(() => {
    fetchHolidays(`${baseYear}0101`, `${baseYear}1231`);
  }, [baseYear]);

  return (
    <DragAndDropCalendar
      // 날짜 local화
      localizer={localizer}
      // 시간 날짜 포맷
      formats={Formats}
      resizable
      selectable
      // schedule data
      events={events}
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
      onEventDrop={moveEvent}
      onEventResize={resizeEvent}

      onSelectEvent={handleSelectEvent}
    />
  );
};

export default Content;