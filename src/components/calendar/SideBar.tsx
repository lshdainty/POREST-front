import { useEffect, useState } from 'react';
import { useCalendarType } from '@/hooks/useCalendarType';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';
import { useCalendarEventsStore } from '@/store/CalendarEventStore';
import { useGetUsers } from '@/hooks/useUserApi';
import { useTheme } from "@/components/shadcn/theme-provider"
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

  const editCss = (id: number | string, type: string, colorCode: string) => {
    let findVisible

    if (type === 'user') {
      findVisible = userVisibles.find(user => user.id === id);
    } else {
      findVisible = calendarVisibles.find(calendar => calendar.id === id);
    }

    if (!findVisible) return

    return (findVisible?.isVisible) ? {
      color: colorCode
    } : {
      color: theme === 'light' ? '#f4f4f4' : '#404040',
      opacity: theme === 'light' ? 1.0 : 0.5
    }
  }

  useEffect(() => {
    if (users && !usersLoading) {
      resetUserVisible(users.map((user) => user.userNo));
      resetCalendarVisible(calendarType.map((calendar) => calendar.id));
    }
  }, []);

  return (
    <div className='calendar_sidebar'>
      <div className='sidebar_all'>
        <Checkbox
          id='viewAll'
          checked={allChecked}
          onCheckedChange={() => {
            setAllChecked(prev => !prev);
            setAllVisible(!allChecked);
            userVisibles.forEach(visible => {
              setEventVisible(visible.id as number, !allChecked, 'user');
            });
            calendarVisibles.forEach(visible => {
              setEventVisible(visible.id as string, !allChecked, 'calendar');
            });
          }}
        / >
        <Label htmlFor='viewAll' className='pl-2.5'>View all</Label>
      </div>
      <Separator className="my-3" />
      <div className='sidebar_btn_group'>
        <ul id='user_group' className='sidebar_list'>
          <li
            key={'userAllVisible'}
            onClick={() => {
              setUserAllVisible(!userAllVisible)
              userVisibles.forEach(visible => {
                setEventVisible(visible.id as number, !userAllVisible, 'user');
              });
            }}
          >
            <Circle sx={
                (userAllVisible) ? {
                  color: '#495771'
                } : {
                  color: theme === 'light' ? '#f4f4f4' : '#404040',
                  opacity: theme === 'light' ? 1.0 : 0.5
                }
              }
            />
            <div className='sidebar_list_name'>User all</div>
          </li>
          {
            users && users.map((u) => (
              <li
                key={u.userNo}
                onClick={() => {
                  setUserVisible(u.userNo);
                  const findVisible = userVisibles.find(visible => visible.id === u.userNo);
                  if (findVisible) {
                    setEventVisible(u.userNo, !findVisible.isVisible, 'user');
                  }
                }}
              >
                <Circle sx={ editCss(u.userNo, 'user', '#0080fc') } />
                <div className='sidebar_list_name'>{u.userName}</div>
              </li>
            ))
          }
        </ul>
        <Separator className="my-3" />
        <ul id='calendar_group' className='sidebar_list'>
          <li
            key={'calendarAllVisible'}
            onClick={() => {
              setCalendarAllVisible(!calendarAllVisible);
              calendarVisibles.forEach(visible => {
                setEventVisible(visible.id as string, !calendarAllVisible, 'calendar');
              });
            }}
          >
            <Circle sx={
                (calendarAllVisible) ? {
                  color: '#495771'
                } : {
                  color: theme === 'light' ? '#f4f4f4' : '#404040',
                  opacity: theme === 'light' ? 1.0 : 0.5
                }
              }
            />
            <div className='sidebar_list_name'>Calendar all</div>
          </li>
          {
            calendarType.map((calendar) => (
              <li
                key={calendar.id}
                onClick={() => {
                  setCalendarVisible(calendar.id);
                  const findVisible = calendarVisibles.find(visible => visible.id === calendar.id);
                  if (findVisible) {
                    setEventVisible(calendar.id as string, !findVisible.isVisible, 'calendar');
                  }
                }}
              >
                <Circle sx={ editCss(calendar.id, 'calendar', calendar.colorCode) } />
                <div className='sidebar_list_name'>{calendar.name}</div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default SideBar;