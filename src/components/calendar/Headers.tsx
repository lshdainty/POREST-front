import { HeaderProps, DateHeaderProps } from 'react-big-calendar';
import { useHolidayStore } from '@/store/holidayStore';
import moment from 'moment';

const saturday = "text-[#6767ff]";
const sunday = "text-[#ff6767]";

export const MonthHeader: React.FC<HeaderProps> = ({label, date}) => {
  let textColor:string = '';
  if (date.getDay() === 0) textColor = sunday;
  if (date.getDay() === 6) textColor = saturday;

  return <span className={textColor} role='columnheader' aria-sort='none'>{label}</span>
}

export const MonthDateHeader: React.FC<DateHeaderProps> = ({label, date, isOffRange}) => {
  const {findHolidayName} = useHolidayStore(s => s.actions);
  const holiday = findHolidayName(moment(date).format('yyyyMMDD'));

  let textColor:string = '';
  if (date.getDay() === 0) textColor = sunday;
  if (date.getDay() === 6) textColor = saturday;
  if (holiday.holidayType === 'PUBLIC') textColor = sunday;
  if (holiday.holidayType === 'RECOMMEND') textColor = saturday;

  let opacity:string = '';
  if (isOffRange) opacity = 'opacity-50';

  return (
    <>
      <button type='button' className={`text-sm foreground-text ${textColor} ${opacity}`}>{label}</button>
      {holiday.holidayType === 'PUBLIC' ? <span className={`holiday-public text-xs ${textColor} ${opacity}`}>{`${holiday.holidayName}`}</span> : null}
      {holiday.holidayType === 'RECOMMEND' ? <span className={`holiday-recommend text-xs ${textColor} ${opacity}`}>{`${holiday.holidayName}`}</span> : null}
    </>
  )
}