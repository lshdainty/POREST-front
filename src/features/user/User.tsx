import React, { useState } from 'react';
import { Form, Table, Tag, Typography, Input, Select } from 'antd';
import type { TableProps } from 'antd';
import { useSuspenseQuery } from '@tanstack/react-query'
import { TUser, getUsers, UserQueryKey } from '@/api/user';
import { cn } from "@/lib/utils"

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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: TUser;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode = null;

  switch(dataIndex) {
    case 'user_name':
    case 'user_birth':
      inputNode = <Input />;
      break;
    case 'user_employ':
      inputNode = <Select 
        options={[
          { value: 'ADMIN', label: 'ADMIN' },
          { value: 'BP', label: 'BP' },
        ]}
      />;
      break;
    case 'user_work_time':
      inputNode = <Select 
        options={[
          { value: '8 ~ 5', label: '8 ~ 5' },
          { value: '9 ~ 6', label: '9 ~ 6' },
          { value: '10 ~ 7', label: '10 ~ 7' },
        ]}
      />;
      break;
    case 'lunar_yn':
      inputNode = <Select 
        options={[
          { value: 'Y', label: 'Y' },
          { value: 'N', label: 'N' },
        ]}
      />;
      break;
    default:
      break
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default function User() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: TUser) => record.user_no.toString() === editingKey;

  const saveFC = async ( user_no : React.Key) => {
    try {
      const row = (await form.validateFields()) as TUser;
      console.log('HELLO WORLD', row);
    } catch (errInfo) {
      console.log('saveFC console.log : ', errInfo)
    }
  }

  const editFC = (record: Partial<TUser> & { user_no: React.Key }) => {
    form.setFieldsValue({
      user_name: '',
      user_employ: '',
      user_work_time: '',
      user_birth: '',
      lunar_yn: '',
      ...record 
    });
    setEditingKey(record.user_no.toString());
  };

  const actionRender = (_: any, record: TUser) => {
    return isEditing(record) ? (
      <span>
        <Typography.Link
          onClick={() => saveFC(record.user_no.toString())}
          style={{ marginInlineEnd: 8 }}
        >
          Save
        </Typography.Link>
        <Typography.Link
          onClick={() => setEditingKey('')}
          style={{ marginInlineEnd: 8 }}
        >
          Cancel
        </Typography.Link>
      </span>
    ) : (
      <Typography.Link
        disabled={editingKey !== ''}
        onClick={() => editFC(record)}
      >
        Edit
      </Typography.Link>
    );
  }
  
  const columns: TableProps<TUser>['columns'] = [
    {
      title: '이름',
      dataIndex: 'user_name',
      editable: true,
      width: `${90/5}%`,
    },
    {
      title: '소속',
      dataIndex: 'user_employ',
      editable: true,
      render: employRender,
      width: `${90/5}%`,
    },
    {
      title: '유연근무제',
      dataIndex: 'user_work_time',
      editable: true,
      render: workTimeRender,
      width: `${90/5}%`,
    },
    {
      title: '생일',
      dataIndex: 'user_birth',
      editable: true,
      width: `${90/5}%`,
    },
    {
      title: '음력여부',
      dataIndex: 'lunar_yn',
      editable: true,
      width: `${90/5}%`,
    },
    {
      title: '수정',
      dataIndex: 'action',
      render: actionRender,
      width: `${10}%`,
    }
  ]

  const mergeColumns: TableProps<TUser>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TUser) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const { data: userData, isLoading: userLoading } = useSuspenseQuery(
    {
      queryKey: [UserQueryKey.GET_USERS], 
      queryFn: () => getUsers(),
      select: (data: any) => data.data as TUser[]
    }
  );

  console.log(userData);

  return (
    <div
      className={cn(
        "flex w-full h-full p-[10px]" 
      )}
    >
      <Form
        form={form}
        component={false}
      >
        <Table<TUser>
          columns={mergeColumns}
          dataSource={userData}
          style={{
            width: "100%"
          }}
          components={{
            body: {
              cell: EditableCell
            }
          }}
        />
      </Form>
    </div>
  );
}