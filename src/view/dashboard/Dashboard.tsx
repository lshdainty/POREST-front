import { useEffect, useState } from 'react';
import { getUsers, test} from '@/api/user'

import '@/view/dashboard/dashboard.scss'

interface User {
  user_no: Int16Array,
  user_name: string,
  user_employ: string,
  user_birth: string,
  user_work_time: string,
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const init = async () => {
    try {
      // const data = await getUsers();
      // console.log(data);
      // setUsers(data);
      const data2 = await test();
    } catch (err) {
      console.log(err);
    }
  }

  // const init2 = getUsers();
  // console.log(init2)

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
    init()
    // test()
    // console.log(getUsers())
  }, []);

  return (
    <div className='home'>
      home page
      <div>{ usersElement }</div>
    </div>
  );
}

export default Dashboard;