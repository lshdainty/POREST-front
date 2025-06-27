import { create } from 'zustand';
import { THoliday } from '@/types/holiday';

export const useHolidayStore = create<{
  baseYear: string
  holidays: THoliday[]
  actions: {
    setBaseYear: (baseYear: string) => void
    setHolidays: (holidays: THoliday[]) => void
    findHolidayName: (date: string) => THoliday
  }
}>((set, get) => ({
  baseYear: '',
  holidays: [],
  actions: {
    setBaseYear: (d) => set({baseYear: d}),
    setHolidays: (d) => set({holidays: d}),
    findHolidayName: (d) => {
      const holiday = get().holidays.find(holiday => holiday.holidayDate === d)
      return holiday ? holiday : ({
          holidayName:'',
          holidayDate:'',
          holidayType:''
        });
    }
  }
}));