import {TUser, getUsers, QueryKey} from '@/api/user';
import {useQuery} from '@tanstack/react-query'

import '@/view/dashboard/dashboard.scss';

const Dashboard: React.FC = () => {
  const {data, isLoading} = useQuery(
    {
      queryKey: [QueryKey.GET_USERS], 
      queryFn: () => getUsers(),
      select: (data: any) => data.data as TUser[]
    }
  );

  if (isLoading) {return ('')}

  return (
    <div className='home'>
      home page
      <div>
        {data?.map((user: TUser, idx: number) =>
          <div key={idx}>
            <span>ID : {user.user_no},</span>
            <span>이름 : {user.user_name},</span>
            <span>권한 : {user.user_employ},</span>
            <span>생일 : {user.user_birth},</span>
            <span>시간 : {user.user_work_time}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;