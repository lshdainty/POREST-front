import React from 'react';
import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={<Button type='primary' onClick={() => navigate('/')}>Back Home</Button>}
      />
    </div>
  );
};

export default NotFound;