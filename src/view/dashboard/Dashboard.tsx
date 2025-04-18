import {useEffect, useState} from 'react';
import {getUsers} from '@/api/user';

import '@/view/dashboard/dashboard.scss';

interface User {
  user_no: Int16Array,
  user_name: string,
  user_employ: string,
  user_birth: string,
  user_work_time: string,
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const resp = await getUsers();
    setUsers(resp.data);
  }

  const usersElement = users.map((user, idx) =>
    <div>
      <span key={idx}>ID : {user.user_no},</span>
      <span key={idx}>이름 : {user.user_name},</span>
      <span key={idx}>권한 : {user.user_employ},</span>
      <span key={idx}>생일 : {user.user_birth},</span>
      <span key={idx}>시간 : {user.user_work_time}</span>
    </div>
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='home'>
      home page
      <div>{usersElement}</div>
    </div>
  );
}

export default Dashboard;