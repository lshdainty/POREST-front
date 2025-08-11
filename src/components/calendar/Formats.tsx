import { DateRange } from 'react-big-calendar';
import dayjs from 'dayjs';

export const Formats = {
  monthHeaderFormat: 'YYYY.MM',
  dayHeaderFormat: 'MM.DD ddd',
  timeGutterFormat: (date: Date) => `${dayjs(date).format('HH:mm')}`,
  dayRangeHeaderFormat: (range: DateRange) => `${dayjs(range.start).format('YY.MM.DD')} ~ ${dayjs(range.end).format('YY.MM.DD')}`
}

export const MobileFormats = {
  monthHeaderFormat: 'YYYY.MM',
  dayHeaderFormat: 'MM.DD ddd',
  timeGutterFormat: (date: Date) => `${dayjs(date).format('HH')}`, 
  dayRangeHeaderFormat: (range: DateRange) => `${dayjs(range.start).format('MM')}월`
}