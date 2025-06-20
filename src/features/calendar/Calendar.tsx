import { cn } from "@/lib/utils"
import CalendarSideBar from '@/components/calendar/SideBar';
import CalendarContent from '@/components/calendar';

export default function Calendar() {
  return (
    <div
      className={cn(
        "flex w-full h-full p-[10px]" 
      )}
    >
      <CalendarSideBar />
      <CalendarContent />
    </div>
  );
}