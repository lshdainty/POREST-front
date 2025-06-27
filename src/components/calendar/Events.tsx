import { useEffect } from 'react';
import { EventProps } from 'react-big-calendar';
import { convertColorCode } from '@/hooks/useCalendarType';
import dayjs from 'dayjs';
import { Popover } from 'antd';
import { useIsMobile } from '@/hooks/useMobile';
import { Circle } from '@mui/icons-material';
import { Clock4, UserRound, FileText } from 'lucide-react';

export const convertEventStyle = (event) => {
  return {
    style: {
      backgroundColor: convertColorCode(event.rawData.calendarType),
      opacity: event.rawData.isOffDay ? 0.5 : 1
    }
  };
}

const EventPopup: React.FC<EventProps> = (props) => {
  const event = props.event;
  const start = (event.rawData.isAllDay === true) ? dayjs(event.start).format('YYYY-MM-DD') : dayjs(event.start).format('YYYY-MM-DD HH:mm');
  const end = (event.rawData.isAllDay === true) ? dayjs(event.end).format('YYYY-MM-DD') : dayjs(event.end).format('HH:mm');

  return (
    <>
      <div className='p-4'>
        <div className='text-sm font-bold leading-relaxed break-all mb-2.5'>{`${event.rawData.userName} ${event.rawData.calendarName}`}</div>
        <div className='flex items-center text-xs leading-[1.7]'><Clock4 className='w-3 h-3 mr-1' />{`${start} - ${end}`}</div>
        <div className='flex items-center text-xs leading-[1.7]'><UserRound className='w-3 h-3 mr-1' />{event.rawData.userName}</div>
        <div className='flex items-center text-xs leading-[1.7]'><Circle sx={{fontSize: '12px', lineHeight: '1.7', marginRight: '4px', color:event.rawData.colorCode}} />{event.rawData.calendarName}</div>
        <div className='flex items-center text-xs leading-[1.7]'><FileText className='w-3 h-3 mr-1' />{event.rawData.calendarDesc}</div>
      </div>
      <div className='absolute rounded-t-[4px] w-full h-1 border-0 top-0' style={{backgroundColor:event.rawData.colorCode}}></div>
    </>
  );
}

const Events: React.FC<EventProps> = (props) => {
  const event = props.event;
  const isMobile = useIsMobile();

  useEffect(() => {
    const anchorEl = document.querySelectorAll('.rbc-addons-dnd-resize-ew-anchor');
    anchorEl.forEach((element) => {
      const el = element as HTMLElement;
      isMobile ? el.style.top = '5px' : el.style.top = '7px';
    });
  }, [isMobile]);

  useEffect(() => {
    const rbcRowSegmentEl = document.querySelectorAll('.rbc-row-segment');
    rbcRowSegmentEl.forEach((element) => {
      const el = element as HTMLElement;
      el.style.padding = '1px 4px 1px 3px';
    });

    const rbcEventEl = document.querySelectorAll('.rbc-event');
    rbcEventEl.forEach((element) => {
      const el = element as HTMLElement;
      el.style.padding = '1px 5px';
    });
  }, [])

  return (
    <Popover
      content={<EventPopup {...props} />}
      trigger="click"
      styles={{
        body: {
          borderRadius: '4px',
          padding: 'unset'
        }
      }}
    >
      <div className={isMobile ? "text-sm pl-1" : "text-base pl-1"}>
        {`${event.rawData.userName} ${event.rawData.calendarName}`}
      </div>
    </Popover>
  );
}

export default Events;