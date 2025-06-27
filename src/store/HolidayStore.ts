import { create } from 'zustand';

interface Holiday {
  holidayName: string;
  holidayDate: string;
  holidayType: string;
}

export const useHolidayStore = create<{
  baseYear: string
  holidays: Holiday[]
  actions: {
    setBaseYear: (baseYear: string) => void
    setHolidays: (holidays: {
      holiday_name: string;
      holiday_date: string;
      holiday_type: string;
    }[]) => void
    findHolidayName: (date: string) => Holiday
  }
}>((set, get) => ({
  baseYear: '',
  holidays: [],
  actions: {
    setBaseYear: (d) => set({baseYear: d}),
    setHolidays: (d) => set({holidays: d.map(h => {
      return ({
        holidayName: h.holiday_name,
        holidayDate: h.holiday_date,
        holidayType: h.holiday_type
      });
    })}),
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