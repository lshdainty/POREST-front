import { create } from 'zustand';

interface Visible {
  id: number | string;
  isVisible: boolean;
}

export const useCalendarVisibleStore = create<{
  userVisibles: Visible[]
  calendarVisibles: Visible[]
  actions: {
    resetUserVisible: (userNos: number[]) => void
    resetCalendarVisible: (calendarIds: string[]) => void
    setUserVisible: (userNo: number) => void
    setCalendarVisible: (calendarId: string) => void
  }
}>((set, get) => ({
  userVisibles: [],
  calendarVisibles: [],
  actions: {
    resetUserVisible: (userNos) => {
      const _userVisibles = userNos.map(userNo => ({
        id: userNo,
        isVisible: true,
      }));
      set({ userVisibles: _userVisibles });
    },
    resetCalendarVisible: (calendarIds) => {
      const _calendarVisibles = calendarIds.map(calendarId => ({
        id: calendarId,
        isVisible: true,
      }));
      set({ calendarVisibles: _calendarVisibles });
    },
    setUserVisible: (userNo) => {
      set((state) => ({
        userVisibles: state.userVisibles.map(user => 
          user.id === userNo 
            ? { ...user, isVisible: !user.isVisible } 
            : user
        )
      }));
    },
    setCalendarVisible: (calendarId) => {
      set((state) => ({
        calendarVisibles: state.calendarVisibles.map(calendar => 
          calendar.id === calendarId 
            ? { ...calendar, isVisible: !calendar.isVisible } 
            : calendar
        )
      }));
    }
  }
}));