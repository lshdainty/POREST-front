import { DateRangeFormatFunction } from 'react-big-calendar'
import moment from 'moment';

const customDayRangeHeaderFormat:DateRangeFormatFunction = (range) => {
  const start = range.start;
  const end = range.end;
  return `${moment(start).format('YY.MM.DD')} ~ ${moment(end).format('YY.MM.DD')}`;
}

export const Formats = {
  monthHeaderFormat: 'YYYY.MM',
  dayHeaderFormat: 'MM.DD ddd',
  dayRangeHeaderFormat: customDayRangeHeaderFormat
}