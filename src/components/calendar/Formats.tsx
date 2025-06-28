import { DateRangeFormatFunction } from 'react-big-calendar';
import dayjs from 'dayjs';

const customDayRangeHeaderFormat:DateRangeFormatFunction = (range) => {
  const start = range.start;
  const end = range.end;
  return `${dayjs(start).format('YY.MM.DD')} ~ ${dayjs(end).format('YY.MM.DD')}`;
}

export const Formats = {
  monthHeaderFormat: 'YYYY.MM',
  dayHeaderFormat: 'MM.DD ddd',
  dayRangeHeaderFormat: customDayRangeHeaderFormat
}