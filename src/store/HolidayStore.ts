import {create} from 'zustand'

interface Holiday {
  holidayName: string
  holidayDate: string
  holidayType: string
}

interface ApiHoliday {
  holiday_seq: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
}

export const convertHoliday = (apiData: ApiHoliday[]) => {
  const data = apiData.map((d: ApiHoliday) => ({
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
    checkHoliday: (date: string) => boolean
    findHolidayName: (date: string) => string
  }
}>((set, get) => ({
  baseYear: '',
  holidays: [],
  actions: {
    setBaseYear: (d) => set({baseYear: d}),
    setHolidays: (d) => set({holidays: d}),
    checkHoliday: (d) => get().holidays.some(holiday => holiday.holidayDate === d),
    findHolidayName: (d) => {
      const holiday = get().holidays.find(holiday => (holiday.holidayDate === d && holiday.holidayType === 'PUBLIC'))
      return holiday ? holiday.holidayName : '';
    }
  }
}));