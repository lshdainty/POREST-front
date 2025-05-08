import React, { useState} from 'react';
import { Form, Table, Tag, Typography, Popconfirm } from 'antd';
import { useSuspenseQuery } from '@tanstack/react-query'
import { TUser, getUsers, UserQueryKey } from '@/api/user';

import '@/view/user/user.scss';

const employRender = (employ: string): React.ReactNode => {
  let colorCode = '';

  switch (employ.toUpperCase()) {
    case 'ADMIN':
      colorCode = '#f50';
      break
    case 'BP':
      colorCode = '#2db7f5';
      break
    default:
      break
  }

  return (
    <span>
      <Tag color={colorCode} key={employ}>
        {employ.toUpperCase()}
      </Tag>
    </span>
  )
}

const workTimeRender = (time: string): React.ReactNode => {
  let colorCode = '';

  switch (time.toUpperCase()) {
    case '8 ~ 5':
      colorCode = '#f50';
      break
    case '9 ~ 6':
      colorCode = '#2db7f5';
      break
    case '10 ~ 7':
      colorCode = '#3cb371';
      break
    default:
      break
  }

  return (
    <span style={{ color : colorCode }}>
      {time.toUpperCase()}
    </span>
  )
}



const User: React.FC = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: TUser) => record.key === editingKey;

  const edit = (record: Partial<TUser> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const actionRender = (_:any, record: TUser) => {
    const editable = isEditing(record);
    return editable ? (
      <span>
        <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
          Save
        </Typography.Link>
        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
          <a>Cancel</a>
        </Popconfirm>
      </span>
    ) : (
      <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
        Edit
      </Typography.Link>
    );
  }
  
  const columns: TableProps<TUser>['columns'] = [
    {
      title: '이름',
      dataIndex: 'user_name',
      key: 'user_name',
      editable: true,
    },
    {
      title: '소속',
      dataIndex: 'user_employ',
      key: 'user_employ',
      editable: true,
      render: employRender
    },
    {
      title: '유연근무제',
      dataIndex: 'user_work_time',
      key: 'user_work_time',
      editable: true,
      render: workTimeRender
    },
    {
      title: '생일',
      dataIndex: 'user_birth',
      key: 'user_birth',
      editable: true,
    },
    {
      title: '음력여부',
      dataIndex: 'lunar_yn',
      key: 'lunar_yn',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: actionRender
    }
  ]


  const { data: userData, isLoading: userLoading } = useSuspenseQuery(
    {
      queryKey: [UserQueryKey.GET_USERS], 
      queryFn: () => getUsers(),
      select: (data: any) => data.data as TUser[]
    }
  );

  console.log(userData);

  return (
    <div className='user'>
      <Table<TUser> columns={columns} dataSource={userData} />
    </div>
  );
}

export default User;