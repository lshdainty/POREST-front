import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import '@/view/login/login.scss';
import LoginBG from '@/assets/img/loginbg.jpg';
import Logo from '@/assets/img/logo.svg';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    // 로그인 로직 추가
    localStorage.setItem('key', '');
    navigate('/overview');
  }

  return (
    <div className='login-container'>
      <div className='login'>
        <div className='login-bg'>
          <img src={LoginBG} />
        </div>
        <div className='login-content'>
          <img src={Logo} alt='login' />
          <Form
              name='login'
              initialValues={{remember: true}}
              style={{maxWidth: 360}}
              onFinish={onFinish}
          >
            <Form.Item
              name='username'
              rules={[{required: true, message: 'Please input your Username!'}]}
            >
              <Input prefix={<UserOutlined />} placeholder='Username' />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{required: true, message: 'Please input your Password!'}]}
            >
              <Input prefix={<LockOutlined />} type='password' placeholder='Password' />
            </Form.Item>
            <Form.Item>
              <Flex justify='space-between' align='center'>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href=''>Forgot password</a>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button block type='primary' htmlType='submit'>
                Log in
              </Button>
              or <a href=''>Register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;