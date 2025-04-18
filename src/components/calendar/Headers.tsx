import {HeaderProps, DateHeaderProps} from 'react-big-calendar'
import {useHolidayStore} from '@/store/HolidayStore'
import moment from 'moment'

export const MonthHeader: React.FC<HeaderProps> = ({label, date}) => {
  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return <span className={className} role='columnheader' aria-sort='none'>{label}</span>
}

export const MonthDateHeader: React.FC<DateHeaderProps> = ({label, date}) => {
  const {checkHoliday, findHolidayName} = useHolidayStore(s => s.actions);
  console.log(checkHoliday(moment(date).format('yyyyMMDD')))

  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return (
    <>
      <button type='button' className={`rbc-button-link ${className}`}>{label}</button>
      <span>{checkHoliday(moment(date).format('yyyyMMDD')) ? findHolidayName(moment(date).format('yyyyMMDD')) : ''}</span>
    </>
  )
}