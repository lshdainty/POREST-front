import React, {useEffect} from 'react';
import {Spin} from 'antd';
import {useLoadStateStore} from '@/store/LoadingStore';

const Loading: React.FC = () => {
  const {state} = useLoadStateStore();
  console.log('layout Load : ', state);

  useEffect(() => {
  
  }, [state]);

  return (
    <>
      {(!state) ? '' : <Spin tip='Loading' size='large' fullscreen></Spin>}
    </>
  )
}

export default Loading