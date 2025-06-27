import { useEffect, useState } from 'react';
import { ToolbarProps } from 'react-big-calendar';
import { useHolidayStore } from '@/store/holidayStore';
import { useIsMobile } from '@/hooks/useMobile';
import { Flex } from 'antd';
import { Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/shadcn/tabs"
import { Label } from "@/components/shadcn/label"
import { Switch } from "@/components/shadcn/switch"

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const label = props.label;
  const isMobile = useIsMobile();
  const [calendarView , setCalendarView] = useState<string>(props.view);
  const { baseYear } = useHolidayStore();
  const { setBaseYear } = useHolidayStore(s => s.actions);
  const [calendarSidebarView, setCalendarSidebarView] = useState(true);
  const [holidayTextView, setholidayTextView] = useState(true);

  if (label.split('.')[0] !== baseYear) setBaseYear(label.split('.')[0]);

  const calendarSidebarViewOption = (value: boolean) => {
    const calendarSidebarEl = document.querySelectorAll('.calendar_sidebar');
    calendarSidebarEl && calendarSidebarEl.forEach(element => {
      const el = element as HTMLElement;
      value ? el.style.display = 'flex' : el.style.display = 'none';
    });
    setCalendarSidebarView(value);
  }

  const holidayTextViewOption = (value: boolean) => {
    const holidayPublicEl = document.querySelectorAll('.holiday-public');
    holidayPublicEl && holidayPublicEl.forEach(element => {
      const el = element as HTMLElement;
      value ? el.style.display = 'inline' : el.style.display = 'none';
    });
    const holidayRecommendEl = document.querySelectorAll('.holiday-recommend');
    holidayRecommendEl && holidayRecommendEl.forEach(element => {
      const el = element as HTMLElement;
      value ? el.style.display = 'inline' : el.style.display = 'none';
    });
    setholidayTextView(value);
  }

  useEffect(() => {
    isMobile ? calendarSidebarViewOption(false) : calendarSidebarViewOption(true);
    isMobile ? holidayTextViewOption(false) : holidayTextViewOption(true);
  }, [isMobile]);

  return (
    <div className='flex justify-between items-center mb-2.5'>
      <div className='flex'>
        <Flex gap='small' wrap>
          <Button variant='outline' size="sm" className="rounded-full" onClick={ () => props.onNavigate('TODAY') }>
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={ () => props.onNavigate('PREV') }>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={ () => props.onNavigate('NEXT') }>
            <ChevronRight />
          </Button>
        </Flex>
        <div className='flex justify-center items-center pl-1'>
          <span id='calendarLabel' className='text-lg mx-2'>{label}</span>
        </div>
      </div>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="size-8 mr-2 rounded-full">
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
                  <Label htmlFor="calendarSidebarView">Sidebar</Label>
                  <Switch className="justify-self-end" id="calendarSidebarView" checked={calendarSidebarView} onCheckedChange={calendarSidebarViewOption}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="HolidayView">Holiday Text</Label>
                  <Switch className="justify-self-end" id="HolidayView" checked={holidayTextView} onCheckedChange={holidayTextViewOption}/>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Tabs
          defaultValue='month'
          value={calendarView}
          onValueChange={ (v) => setCalendarView(v) }
        >
          <TabsList>
            {
              props.views && props.views.map((view) => (
                <TabsTrigger
                  key={view}
                  value={view}
                  onClick={ () => props.onView(view) }
                >
                  {view}
                </TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Toolbar;