import { HeaderProps, DateHeaderProps } from 'react-big-calendar';
import { useHolidayStore } from '@/store/HolidayStore';
import dayjs from 'dayjs';

const saturday = 'text-[#6767ff]';
const sunday = 'text-[#ff6767]';

export const MonthHeader: React.FC<HeaderProps> = ({label, date}) => {
  let textColor:string = '';
  if (date.getDay() === 0) textColor = sunday;
  if (date.getDay() === 6) textColor = saturday;

  return <span className={textColor} role='columnheader' aria-sort='none'>{label}</span>
}

export const MonthDateHeader: React.FC<DateHeaderProps> = ({label, date, isOffRange}) => {
  const {findHolidayName} = useHolidayStore(s => s.actions);
  const holiday = findHolidayName(dayjs(date).format('YYYYMMDD'));

  let textColor:string = '';
  if (date.getDay() === 0) textColor = sunday;
  if (date.getDay() === 6) textColor = saturday;
  if (holiday.holidayType === 'PUBLIC' || holiday.holidayType === 'SUBSTITUTE') textColor = sunday;
  if (holiday.holidayType === 'ETC') textColor = saturday;

  let opacity:string = '';
  if (isOffRange) opacity = 'opacity-50';

  return (
    <>
      <button type='button' className={`text-sm foreground-text ${textColor} ${opacity}`}>{label}</button>
      {holiday.holidayType === 'PUBLIC' || holiday.holidayType === 'SUBSTITUTE' ? <span className={`holiday-public text-xs ${textColor} ${opacity}`}>{`${holiday.holidayName}`}</span> : null}
      {holiday.holidayType === 'ETC' ? <span className={`holiday-recommend text-xs ${textColor} ${opacity}`}>{`${holiday.holidayName}`}</span> : null}
    </>
  )
}