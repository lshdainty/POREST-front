import { useState } from 'react'
import { Views } from 'react-big-calendar'
import { ToolbarProps } from 'react-big-calendar'
import { Button, Flex, Radio } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

import '@/components/calendar/customToolbar.scss'

const CustomToolbarComponent: React.FC<ToolbarProps> = (props) => {
  const label = props.label;
  const [ btnView , setBtnView ] = useState<string>(Views.MONTH);

  return (
    <div className='rbc-toolbar'>
      <div className='rbc-toolbar-left'>
        <Flex gap="small" wrap>
          <Button
            color="default"
            variant="outlined"
            shape="round"
            onClick={ () => props.onNavigate('TODAY') }
          >Today</Button>
          <Button
            color="default"
            variant="outlined"
            shape="circle"
            onClick={ () => props.onNavigate('PREV') }
          ><LeftOutlined /></Button>
          <Button
            color="default"
            variant="outlined"
            shape="circle"
            onClick={ () => props.onNavigate('NEXT') }
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
            key={ view }
            value={ view }
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

export default CustomToolbarComponent;