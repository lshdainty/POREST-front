import { create } from 'zustand';

interface Visible {
  id: string;
  isVisible: boolean;
}

export const useCalendarVisibleStore = create<{
  userAllVisible: boolean
  calendarAllVisible: boolean
  allVisible: boolean
  userVisibles: Visible[]
  calendarVisibles: Visible[]
  actions: {
    resetUserVisible: (userIds: string[]) => void
    resetCalendarVisible: (calendarIds: string[]) => void
    setUserVisible: (userId: string) => void
    setCalendarVisible: (calendarId: string) => void
    setUserAllVisible: () => void
    setCalendarAllVisible: () => void
    setAllVisible: () => void
  }
}>((set, get) => ({
  userAllVisible: true,
  calendarAllVisible: true,
  allVisible: true,
  userVisibles: [],
  calendarVisibles: [],
  actions: {
    resetUserVisible: (userIds) => {
      const _userVisibles = userIds.map(userId => ({
        id: userId,
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
    setUserVisible: (userId) => {
      set((state) => {
        const visible = state.userVisibles.map(u =>
          u.id === userId
            ? { ...u, isVisible: !u.isVisible }
            : u
        );

        const userAllVisible = visible.every(u => u.isVisible);
        const allVisible = userAllVisible && state.calendarAllVisible;

        return {
          userVisibles: visible,
          userAllVisible: userAllVisible,
          allVisible: allVisible
        }
      });
    },
    setCalendarVisible: (calendarId) => {
      set((state) => {
        const visible = state.calendarVisibles.map(c => 
          c.id === calendarId 
            ? { ...c, isVisible: !c.isVisible } 
            : c
        );

        const calendarAllVisible = visible.every(c => c.isVisible);
        const allVisible = calendarAllVisible && state.userAllVisible;

        return {
          calendarVisibles: visible,
          calendarAllVisible: calendarAllVisible,
          allVisible: allVisible
        }
      });
    },
    setUserAllVisible: () => {
      set((state) => {
        const userVisibles = state.userVisibles.map(u => ({ ...u, isVisible: !state.userAllVisible }));

        return {
          userVisibles: userVisibles,
          userAllVisible: !state.userAllVisible,
          allVisible: !state.userAllVisible && state.calendarAllVisible
        };
      });
    },
    setCalendarAllVisible: () => {
      set((state) => {
        const calendarVisibles = state.calendarVisibles.map(c => ({ ...c, isVisible: !state.calendarAllVisible }));

        return {
          calendarVisibles: calendarVisibles,
          calendarAllVisible: !state.calendarAllVisible,
          allVisible: !state.calendarAllVisible && state.userAllVisible
        }
      });
    },
    setAllVisible: () => {
      set((state) => {
        return {
          allVisible: !state.allVisible,
          userAllVisible: !state.allVisible,
          calendarAllVisible: !state.allVisible,
          userVisibles: state.userVisibles.map(u => ({ ...u, isVisible: !state.allVisible })),
          calendarVisibles: state.calendarVisibles.map(c => ({ ...c, isVisible: !state.allVisible }))
        }
      });
    }
  }
}));