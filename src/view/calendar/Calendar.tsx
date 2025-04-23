import { Suspense } from 'react';
import Loading from '@/components/loading/Loading';
import CalendarSideBar from '@/components/calendar/SideBar';
import CalendarContent from '@/components/calendar';

import '@/view/calendar/calendar.scss';

const Calendar: React.FC = () => {
  return (
    <div className='calendar'>
      <Suspense fallback={<Loading />}>
        <CalendarSideBar />
        <CalendarContent />
      </Suspense>
    </div>
  );
}

export default Calendar;