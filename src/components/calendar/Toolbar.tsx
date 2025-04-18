import {useState} from 'react';
import {ToolbarProps} from 'react-big-calendar';
import {Button, Flex, Radio} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {useHolidayStore} from '@/store/HolidayStore';

import '@/components/calendar/toolbar.scss';

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const label = props.label;
  const [btnView , setBtnView] = useState<string>(props.view);
  const {baseYear} = useHolidayStore();
  const {setBaseYear} = useHolidayStore(s => s.actions);
  const today = () => props.onNavigate('TODAY');
  const prev = () => props.onNavigate('PREV');
  const next = () => props.onNavigate('NEXT');

  if (label.split('.')[0] !== baseYear) setBaseYear(label.split('.')[0]);

  return (
    <div className='rbc-toolbar'>
      <div className='rbc-toolbar-left'>
        <Flex gap='small' wrap>
          <Button
            color='default'
            variant='outlined'
            shape='round'
            onClick={today}
          >Today</Button>
          <Button
            color='default'
            variant='outlined'
            shape='circle'
            onClick={prev}
          ><LeftOutlined /></Button>
          <Button
            color='default'
            variant='outlined'
            shape='circle'
            onClick={next}
          ><RightOutlined /></Button>
        </Flex>
        <div className='rbc-toolbar-label-group'>
          <span className='rbc-toolbar-label'>{label}</span>
        </div>
      </div>
      <Radio.Group value={btnView} onChange={(e) => setBtnView(e.target.value)}>
      {
        props.views && props.views.map((view) => (
          <Radio.Button
            key={view}
            value={view}
            onClick={() => props.onView(view)}
          >
            {view}
          </Radio.Button>
        ))
      }
      </Radio.Group>
    </div>
  );
};

export default Toolbar;