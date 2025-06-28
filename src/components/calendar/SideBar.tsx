import { useEffect, useState } from 'react';
import { useCalendarType } from '@/hooks/useCalendarType';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';
import { useCalendarEventsStore } from '@/store/CalendarEventStore';
import { useGetUsers } from '@/api/user';
import { useTheme } from '@/components/shadcn/themeProvider';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { Circle } from '@mui/icons-material';
import { Separator } from '@/components/shadcn/separator';

import '@/components/calendar/sideBar.scss';

const SideBar: React.FC = () => {
  const calendarType = useCalendarType();
  const [allChecked, setAllChecked] = useState(true);
  const {data: users, isLoading: usersLoading} = useGetUsers();

  const {
    resetUserVisible,
    resetCalendarVisible,
    setUserVisible,
    setCalendarVisible,
    setAllVisible,
    setUserAllVisible,
    setCalendarAllVisible
  } = useCalendarVisibleStore(s => s.actions);
  const { userVisibles, calendarVisibles, userAllVisible, calendarAllVisible } = useCalendarVisibleStore();
  const { setEventVisible } = useCalendarEventsStore(s => s.actions);
  const { theme } = useTheme();

  const allVisibleCss = (allVisible: boolean) => {
    return (allVisible) ? {
      color: '#495771'
    } : {
      color: theme === 'light' ? '#f4f4f4' : '#404040',
      opacity: theme === 'light' ? 1.0 : 0.5
    }
  }

  const circleCss = (id: number | string, type: string, colorCode: string) => {
    let findVisible = (type === 'user') ?
      userVisibles.find(user => user.id === id) : calendarVisibles.find(calendar => calendar.id === id);

    if (!findVisible) return

    return (findVisible?.isVisible) ? {
      color: colorCode
    } : {
      color: theme === 'light' ? '#f4f4f4' : '#404040',
      opacity: theme === 'light' ? 1.0 : 0.5
    }
  }

  const onCheckedChangeViewAll = () => {
    setAllChecked(prev => !prev);
    setAllVisible(!allChecked);
    userVisibles.forEach(visible => {
      setEventVisible(visible.id as number, !allChecked, 'user');
    });
    calendarVisibles.forEach(visible => {
      setEventVisible(visible.id as string, !allChecked, 'calendar');
    });
  }

  const onClickUserAll = () => {
    setUserAllVisible(!userAllVisible)
    userVisibles.forEach(visible => {
      setEventVisible(visible.id as number, !userAllVisible, 'user');
    });
  }

  const onClickUser = (user: any) => {
    setUserVisible(user.user_no);
    const findVisible = userVisibles.find(visible => visible.id === user.user_no);
    if (findVisible) setEventVisible(user.user_no, !findVisible.isVisible, 'user');
  }

  const onClickCalendarAll = () => {
    setCalendarAllVisible(!calendarAllVisible);
    calendarVisibles.forEach(visible => {
      setEventVisible(visible.id as string, !calendarAllVisible, 'calendar');
    });
  }

  const onClickCalendar = (calendar: any) => {
    setCalendarVisible(calendar.id);
    const findVisible = calendarVisibles.find(visible => visible.id === calendar.id);
    if (findVisible) setEventVisible(calendar.id as string, !findVisible.isVisible, 'calendar');
  }

  useEffect(() => {
    if (users && !usersLoading) {
      resetUserVisible(users.map((user) => user.user_no));
      resetCalendarVisible(calendarType.map((calendar) => calendar.id));
    }
  }, [users]);

  return (
    <div className='calendar_sidebar'>
      <div className='sidebar_all'>
        <Checkbox
          id='viewAll'
          checked={allChecked}
          onCheckedChange={() => onCheckedChangeViewAll()}
        />
        <Label htmlFor='viewAll' className='pl-2.5'>View all</Label>
      </div>
      <Separator className='my-3' />
      <div className='sidebar_btn_group'>
        <ul id='user_group' className='sidebar_list'>
          <li
            key={'userAllVisible'}
            onClick={() => onClickUserAll()}
          >
            <Circle sx={allVisibleCss(userAllVisible)}/>
            <div className='sidebar_list_name'>User all</div>
          </li>
          {
            users && users.map((u) => (
              <li
                key={u.user_no}
                onClick={() => onClickUser(u)}
              >
                <Circle sx={ circleCss(u.user_no, 'user', '#0080fc') } />
                <div className='sidebar_list_name'>{u.user_name}</div>
              </li>
            ))
          }
        </ul>
        <Separator className='my-3' />
        <ul id='calendar_group' className='sidebar_list'>
          <li
            key={'calendarAllVisible'}
            onClick={() => onClickCalendarAll()}
          >
            <Circle sx={allVisibleCss(calendarAllVisible)}/>
            <div className='sidebar_list_name'>Calendar all</div>
          </li>
          {
            calendarType.map((c) => (
              <li
                key={c.id}
                onClick={() => onClickCalendar(c)}
              >
                <Circle sx={ circleCss(c.id, 'calendar', c.colorCode) } />
                <div className='sidebar_list_name'>{c.name}</div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default SideBar;