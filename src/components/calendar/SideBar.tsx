import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCalendarType } from '@/hooks/useCalendarType';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';
import { useCalendarEventsStore } from '@/store/CalendarEventStore';
import { UserQueryKey, getUsers } from '@/api/user';
import { Checkbox, Divider } from 'antd';
import { Circle } from '@mui/icons-material';

import '@/components/calendar/sideBar.scss';

const SideBar: React.FC = () => {
  const {data: usersData, isLoading: usersLoading} = useSuspenseQuery(
    {
      queryKey: [UserQueryKey.GET_USERS],
      queryFn: () => getUsers(),
      select: (data: any) => data.data
    }
  );

  const calendarType = useCalendarType();
  const [allChecked, setAllChecked] = useState(true);

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
      color: '#040f1f',
      opacity: 0.2
    }
  }

  useEffect(() => {
    if (usersData && !usersLoading) {
      resetUserVisible(usersData.map((user) => user.user_no));
      resetCalendarVisible(calendarType.map((calendar) => calendar.id));
    }
  }, []);

  return (
    <div className='calendar_sidebar'>
      <div className='sidebar_all'>
        <Checkbox
          checked={allChecked}
          onChange={() => {
            setAllChecked(prev => !prev);
            setAllVisible(!allChecked);
            userVisibles.forEach(visible => {
              setEventVisible(visible.id as number, !allChecked, 'user');
            });
            calendarVisibles.forEach(visible => {
              setEventVisible(visible.id as string, !allChecked, 'calendar');
            });
          }}
        >View all
        </Checkbox>
      </div>
      <Divider />
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
                color: '#040f1f',
                opacity: 0.2
              }
            } />
            <div className='sidebar_list_name'>User all</div>
          </li>
          {
            usersData.map((user) => (
              <li
                key={user.user_no}
                onClick={() => {
                  setUserVisible(user.user_no);
                  const findVisible = userVisibles.find(visible => visible.id === user.user_no);
                  if (findVisible) {
                    setEventVisible(user.user_no as number, !findVisible.isVisible, 'user');
                  }
                }}
              >
                <Circle sx={ editCss(user.user_no, 'user', '#0080fc') } />
                <div className='sidebar_list_name'>{user.user_name}</div>
              </li>
            ))
          }
        </ul>
        <Divider />
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
                color: '#040f1f',
                opacity: 0.2
              } 
            } />
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