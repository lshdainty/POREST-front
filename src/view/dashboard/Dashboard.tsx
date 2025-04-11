import { useEffect, useState } from 'react';
import {getUsers} from '@/api/user'

import '@/view/dashboard/dashboard.scss'

interface User {
  user_no: Int16Array,
  user_name: string,
  user_employ: string,
  user_birth: string,
  user_work_time: string,
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);

  const init = async () => {
    try {
      const data = await getUsers();
      console.log(data.data);
      setUsers(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const usersElement = users.map((user, idx) =>
    <div>
      <span>ID : {user.user_no}  </span>
      <span>이름 : {user.user_name}  </span>
      <span>권한 : {user.user_employ}  </span>
      <span>생일 : {user.user_birth}  </span>
      <span>시간 : {user.user_work_time}  </span>
    </div>
  );

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='home'>
      home page
      <div>{ usersElement }</div>
    </div>
  );
}

export default Dashboard;