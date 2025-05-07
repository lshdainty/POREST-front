import React, { useEffect } from 'react';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { Button, Drawer, Space, Form, Input, Row, Col, Select, DatePicker, TimePicker } from 'antd';
import { checkPossible, VacationQueryKey } from '@/api/vacation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import dayjs from 'dayjs';

export const EventDrawer: React.FC = () => {
  const { start, end, open } = useCalendarSlotStore();
  const { setOpen } = useCalendarSlotStore(s => s.actions);
  const [form] = Form.useForm();

  const showDrawer = () => {
    // setOpen(true);
  };

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

  useEffect(() => {
    if (possible && !possibleLoading) {
      console.log(possible);
      console.log(start);
      console.log(end);
    }
  }, [possible]);

  useEffect(() => {
    if(!open) {
      form.resetFields();
    }
  }, [open])

  return (
    <Drawer
      title='휴가 등록'
      width={720}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type='primary'>
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        layout='vertical'
        form={form}
        initialValues={{ 
          startDate: dayjs(moment(start).format(), 'YYYY-MM-DD'),
          startTime: dayjs('00:00', 'HH:mm'),
          endDate: dayjs(moment(end).format(), 'YYYY-MM-DD'),
          endTime: dayjs('23:59', 'HH:mm')
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Start Date & Time'>
              <Form.Item 
                name='startDate'
                rules={[{ required: true, message: 'Please choose the Start Date' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              >
                <DatePicker
                  placeholder='Start Date'
                  format={'YYYY-MM-DD'}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
              <Form.Item 
                name='startTime'
                rules={[{ required: true, message: 'Please choose the Start Time' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)', marginLeft: '8px' }}
              >
                <TimePicker
                  placeholder='Start Time'
                  format={'HH:mm'}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='End Date & Time'>
              <Form.Item 
                name='endDate'
                rules={[{ required: true, message: 'Please choose the End Date' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              >
                <DatePicker
                  placeholder='End Date'
                  format={'YYYY-MM-DD'}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
              <Form.Item 
                name='endTime'
                rules={[{ required: true, message: 'Please choose the End Time' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)', marginLeft: '8px' }}
              >
                <TimePicker
                  placeholder='End Time'
                  format={'HH:mm'}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}

export default EventDrawer;