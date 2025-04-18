import { HeaderProps, DateHeaderProps } from 'react-big-calendar'

export const MonthHeader: React.FC<HeaderProps> = ({ label, date }) => {
  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return <span className={className} role='columnheader' aria-sort='none'>{ label }</span>
}

export const MonthDateHeader: React.FC<DateHeaderProps> = ({ label, date }) => {
  let className:string = '';
  if (date.getDay() === 0) className = 'rbc-sunday';
  if (date.getDay() === 6) className = 'rbc-saturday';
  return <button type='button' className={`rbc-button-link ${className}`}>{ label }</button>
}