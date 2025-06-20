import { useEffect, useState } from 'react';
import { ToolbarProps } from 'react-big-calendar';
import { useHolidayStore } from '@/store/HolidayStore';
import { Flex, Radio } from 'antd';
import { Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import { Label } from "@/components/shadcn/label"
import { Switch } from "@/components/shadcn/switch"
import { useIsMobile } from '@/hooks/use-mobile';

import '@/components/calendar/toolbar.scss';


const Toolbar: React.FC<ToolbarProps> = (props) => {
  const label = props.label;
  const [btnView , setBtnView] = useState<string>(props.view);
  const {baseYear} = useHolidayStore();
  const {setBaseYear} = useHolidayStore(s => s.actions);
  const today = () => props.onNavigate('TODAY');
  const prev = () => props.onNavigate('PREV');
  const next = () => props.onNavigate('NEXT');
  const [userView, setUserView] = useState(true);
  const isMobile = useIsMobile();

  if (label.split('.')[0] !== baseYear) setBaseYear(label.split('.')[0]);

  const userViewOption = (value: boolean) => {
    value ?
      document.getElementsByClassName('calendar_sidebar')[0].style.display = 'flex' :
      document.getElementsByClassName('calendar_sidebar')[0].style.display = 'none';
    setUserView(prev => !prev);
  }

  useEffect(() => {
    isMobile ? userViewOption(false) : userViewOption(true);
  }, [isMobile]);

  return (
    <div className='rbc-toolbar'>
      <div className='rbc-toolbar-left'>
        <Flex gap='small' wrap>
          <Button variant='outline' size="sm" className="!rounded-full" onClick={today}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-8 !flex !rounded-full" onClick={prev}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" className="size-8 !flex !rounded-full" onClick={next}>
            <ChevronRight />
          </Button>
        </Flex>
        <div className='rbc-toolbar-label-group'>
          <span className='rbc-toolbar-label'>{label}</span>
        </div>
      </div>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="size-8 !flex !mr-1.5 !rounded-full">
              <Settings />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-3">
              <div>
                <h4 className="leading-none font-medium">Calendar Option</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="userView">userView</Label>
                  <Switch className="justify-self-end" id="userView" checked={userView} onCheckedChange={userViewOption}/>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
    </div>
  );
};

export default Toolbar;