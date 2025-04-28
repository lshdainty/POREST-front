import { create } from 'zustand';

interface Visible {
  id: number | string;
  isVisible: boolean;
}

export const useCalendarVisibleStore = create<{
  userAllVisible: boolean
  calendarAllVisible: boolean
  userVisibles: Visible[]
  calendarVisibles: Visible[]
  actions: {
    resetUserVisible: (userNos: number[]) => void
    resetCalendarVisible: (calendarIds: string[]) => void
    setUserVisible: (userNo: number) => void
    setCalendarVisible: (calendarId: string) => void
    setUserAllVisible: (visible: boolean) => void
    setCalendarAllVisible: (visible: boolean) => void
    setAllVisible: (visible: boolean) => void
  }
}>((set, get) => ({
  userAllVisible: true,
  calendarAllVisible: true,
  userVisibles: [],
  calendarVisibles: [],
  actions: {
    resetUserVisible: (userNos) => {
      const _userVisibles = userNos.map(userNo => ({
        id: userNo,
        isVisible: true,
      }));
      set({ userAllVisible: true, userVisibles: _userVisibles });
    },
    resetCalendarVisible: (calendarIds) => {
      const _calendarVisibles = calendarIds.map(calendarId => ({
        id: calendarId,
        isVisible: true,
      }));
      set({ calendarAllVisible: true, calendarVisibles: _calendarVisibles });
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
    },
    setUserAllVisible: (visible: boolean) => {
      set((state) => ({
        userAllVisible: visible,
        userVisibles: state.userVisibles.map(user => ({ ...user, isVisible: visible })),
      }));
    },
    setCalendarAllVisible: (visible: boolean) => {
      set((state) => ({
        calendarAllVisible: visible,
        calendarVisibles: state.calendarVisibles.map(calendar => ({ ...calendar, isVisible: visible })),
      }));
    },
    setAllVisible: (visible: boolean) => {
      set((state) => ({
        userAllVisible: visible,
        calendarAllVisible: visible,
        userVisibles: state.userVisibles.map(user => ({ ...user, isVisible: visible })),
        calendarVisibles: state.calendarVisibles.map(calendar => ({ ...calendar, isVisible: visible })),
      }));
    }
  }
}));