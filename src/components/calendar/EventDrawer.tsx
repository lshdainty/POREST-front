import React, { useEffect } from 'react';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { Button, Drawer, Space, Form, Input, Row, Col, Select, DatePicker, Progress, Card } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { checkPossible, VacationQueryKey } from '@/api/vacation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import dayjs from 'dayjs';

export const EventDrawer: React.FC = () => {
  const { start, end, open } = useCalendarSlotStore();
  const { setOpen } = useCalendarSlotStore(s => s.actions);
  const [form] = Form.useForm();

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const {data: possible, isLoading: possibleLoading} = useQuery({
    queryKey: [VacationQueryKey.CHECK_POSSIBLE, start, end],
    queryFn: () => checkPossible(
      moment(start).format('yyyy-MM-DDTHH:mm:ss'),
      moment(end).format('yyyy-MM-DDTHH:mm:ss')
    ),
    select: (data: any) => data.data
  });

  const onFinish = () => {
    const values = form.getFieldsValue();
    console.log('Success:', values);
  };

  useEffect(() => {
    if (possible && !possibleLoading) {
      console.log(possible);
      console.log(start);
      console.log(end);
    }
  }, [possible]);

  useEffect(() => {
    if(open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Drawer
      title='휴가 등록'
      width={720}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' htmlType='submit' onClick={onFinish}>Submit</Button>
        </Space>
      }
    >
      <Form
        layout='vertical'
        form={form}
        initialValues={{ 
          startDateTime: dayjs(moment(start).format(), 'YYYY-MM-DD HH:mm'),
          endDateTime: dayjs(moment(end).format(), 'YYYY-MM-DD HH:mm'),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name='startDateTime'
              label='Start Date & Time'
              rules={[{ required: true, message: 'Please choose the Start Date' }]}
            >
              <DatePicker
                showTime
                placeholder='Start Date'
                format={'YYYY-MM-DD HH:mm'}
                style={{ width: '100%' }}
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='endDateTime'
              label='End Date & Time'
              rules={[{ required: true, message: 'Please choose the End Date' }]}
            >
              <DatePicker
                showTime
                placeholder='End Date'
                format={'YYYY-MM-DD HH:mm'}
                style={{ width: '100%' }}
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Progress percent={100} status='success' />
        </Row>
        <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            <Button type="dashed" onClick={() => add()} block>
              + Add Item
            </Button>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Item ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Form.Item label="Name" name={[field.name, 'name']}>
                  <Input />
                </Form.Item>
              </Card>
            ))}
          </div>
        )}
        </Form.List>
      </Form>
    </Drawer>
  );
}

export default EventDrawer;