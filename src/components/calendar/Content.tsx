import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const Content = () => {
  //캘린더를 DragAndDrop으로 바꿉니다.
  const DragAndDropCalendar = withDragAndDrop(Calendar);
  const localizer = momentLocalizer(moment);
  
  return (
      <DragAndDropCalendar
        localizer={localizer}
        resizable
        selectable
        style={{ height: '100%', width: '100%' }}
      />

  );
};

export default Content;