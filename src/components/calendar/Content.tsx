import { Calendar, momentLocalizer, HeaderProps, DateHeaderProps } from 'react-big-calendar'
import { useEffect } from 'react';
import { getPeriodSchedules } from '@/api/schedule';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
// @ts-ignore
import 'moment/dist/locale/ko';

import '@/components/calendar/content.scss'

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

  const fetchPeriodSchedules = async () => {
    const resp = await getPeriodSchedules(moment().format("2025-01-01T00:00:00"), moment().format("2025-12-31T23:59:59"));
    console.log(resp.data);
  }

  useEffect(() => {
    fetchPeriodSchedules();
  }, []);

  return (
    <DragAndDropCalendar
      localizer={localizer}
      resizable
      selectable
      components={{
        month: {
          header: CustomMonthHeader,
          dateHeader: CustomMonthDateHeader
        }
      }}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default Content;