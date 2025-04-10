import { useEffect, useState } from 'react';
import {getUsers} from '@/api/user'

import '@/view/home/home.scss'

const Home = () => {
  const test = async () => {
    const test2 = await getUsers();
    console.log(test2);
  }

  useEffect(() => {
    test();
}, []);
  

  return (
    <div className='home'>
      home page
    </div>
  );
}

export default Home;