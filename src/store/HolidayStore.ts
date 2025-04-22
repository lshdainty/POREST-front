import {create} from 'zustand';
import {THoliday} from '@/api/holiday';

interface Holiday {
  holidayName: string
  holidayDate: string
  holidayType: string
}

export const convertHoliday = (apiData: THoliday[]) => {
  const data = apiData.map((d: THoliday) => ({
    holidayName: d.holiday_name,
    holidayDate: d.holiday_date,
    holidayType: d.holiday_type
  }));
  return data;
}

export const useHolidayStore = create<{
  baseYear: string
  holidays: Holiday[]
  actions: {
    setBaseYear: (baseYear: string) => void
    setHolidays: (holidays: Holiday[]) => void
    findHolidayName: (date: string) => Holiday
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