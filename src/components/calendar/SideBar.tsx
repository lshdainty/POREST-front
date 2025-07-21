import { useEffect } from 'react';
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
  const {
    userVisibles,
    calendarVisibles,
    userAllVisible,
    calendarAllVisible,
    allVisible
  } = useCalendarVisibleStore();
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

  const circleCss = (id: string, type: string, colorCode: string) => {
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
    setAllVisible();
    userVisibles.forEach(visible => {
      setEventVisible(visible.id as string, !allVisible, 'user');
    });
    calendarVisibles.forEach(visible => {
      setEventVisible(visible.id as string, !allVisible, 'calendar');
    });
  }

  const onClickUserAll = () => {
    setUserAllVisible();
    userVisibles.forEach(visible => {
      setEventVisible(visible.id as string, !userAllVisible, 'user');
    });
  }

  const onClickUser = (user: any) => {
    setUserVisible(user.user_id);
    const findVisible = userVisibles.find(visible => visible.id === user.user_id);
    if (findVisible) setEventVisible(user.user_id, !findVisible.isVisible, 'user');
  }

  const onClickCalendarAll = () => {
    setCalendarAllVisible();
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
      resetUserVisible(users.map((user) => user.user_id));
      resetCalendarVisible(calendarType.map((calendar) => calendar.id));
    }
  }, [users]);

  return (
    <div className='calendar_sidebar'>
      <div className='sidebar_all'>
        <Checkbox
          id='viewAll'
          checked={allVisible}
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
                key={u.user_id}
                onClick={() => onClickUser(u)}
              >
                <Circle sx={ circleCss(u.user_id, 'user', '#0080fc') } />
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