import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Checkbox, Divider } from 'antd';
import { Circle } from '@mui/icons-material';
import { UserQueryKey, getUsers } from '@/api/user';
import { useCalendarType } from '@/hooks/useCalendarType';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';

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

  const { resetUserVisible, resetCalendarVisible, setUserVisible, setCalendarVisible } = useCalendarVisibleStore(s => s.actions);
  const { userVisibles, calendarVisibles } = useCalendarVisibleStore();

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

  useEffect(() => {
    if (usersData && !usersLoading) {}
  }, [usersData, usersLoading]);

  return (
    <div className='sidebar'>
      <div className='sidebar_all'>
        <Checkbox checked={true}>View all</Checkbox>
      </div>
      <Divider />
      <div className='sidebar_btn_group'>
        <ul id='user_group' className='sidebar_list'>
          {
            usersData.map((user) => (
              <li key={user.user_no} onClick={() => setUserVisible(user.user_no)}>
                <Circle sx={ editCss(user.user_no, 'user', '#0080fc') } />
                <div className='sidebar_list_name'>{user.user_name}</div>
              </li>
            ))
          }
        </ul>
        <Divider />
        <ul id='calendar_group' className='sidebar_list'>
          {
            calendarType.map((calendar) => (
              <li key={calendar.id} onClick={() => setCalendarVisible(calendar.id)}>
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