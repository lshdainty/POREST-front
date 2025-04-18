import {HeaderProps, DateHeaderProps} from 'react-big-calendar';
import {useHolidayStore} from '@/store/HolidayStore';
import moment from 'moment';

export const MonthHeader: React.FC<HeaderProps> = ({label, date}) => {
  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return <span className={className} role='columnheader' aria-sort='none'>{label}</span>
}

export const MonthDateHeader: React.FC<DateHeaderProps> = ({label, date}) => {
  const {findHolidayName} = useHolidayStore(s => s.actions);
  const holiday = findHolidayName(moment(date).format('yyyyMMDD'));

  let className:string = '';
  if (date.getDay() === 0) className += 'rbc-sunday ';
  if (date.getDay() === 6) className += 'rbc-saturday ';
  if (holiday.holidayType === 'PUBLIC' ) className += 'rbc-public ';
  if (holiday.holidayType === 'RECOMMEND' ) className += 'rbc-recommend ';
  return (
    <>
      <button type='button' className={`rbc-button-link ${className}`}>{label}</button>
      {holiday.holidayType === 'PUBLIC' ? <span className={`rbc-public`}>{`${holiday.holidayName}`}</span> : null}
      {holiday.holidayType === 'RECOMMEND' ? <span className={`rbc-recommend`}>{`${holiday.holidayName}`}</span> : null}
    </>
  )
}