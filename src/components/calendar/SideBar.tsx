import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Checkbox, Divider } from 'antd';
import { Circle } from '@mui/icons-material';
import { UserQueryKey, getUsers } from '@/api/user';
import { useCalendarType } from '@/hooks/useCalendarType';

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

  useEffect(() => {
    if (usersData && !usersLoading) {
    }
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
            usersData.map((item) => (
              <li key={item.user_no}>
                <Circle sx={{color:'#0080fc'}} />
                <div className='sidebar_list_name'>{item.user_name}</div>
              </li>
            ))
          }
        </ul>
        <Divider />
        <ul id='calendar_group' className='sidebar_list'>
          {
            calendarType.map((item) => (
              <li key={item.id} onClick={() => {console.log('click')}}>
                <Circle sx={{color:item.colorCode}} />
                <div className='sidebar_list_name'>{item.name}</div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default SideBar;