import {create} from 'zustand'

export const useLoadStateStore = create<{
  state: boolean
  actions: {
    startLoading: () => void
    endLoading: () => void
    getState: () => boolean
  }
}>((set, get) => ({
  state: false,
  actions: {
    startLoading: () => set(s => ({ state: true })),
    endLoading: () => set(s => ({ state: false })),
    getState: () => get().state
  }
}));