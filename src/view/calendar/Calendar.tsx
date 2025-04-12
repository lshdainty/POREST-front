import CalendarSideBar from '@/components/calendar/SideBar'
import CalendarContent from '@/components/calendar/Content'

import '@/view/calendar/calendar.scss'

const Calendar = () => {
    return (
        <div className='calendar'>
            <CalendarSideBar />
            <CalendarContent />
        </div>
    )
}

export default Calendar;