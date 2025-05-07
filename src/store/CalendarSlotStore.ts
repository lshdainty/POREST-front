import { create } from 'zustand';

export const useCalendarSlotStore = create<{
    start: Date
    end: Date
    open: boolean
    actions: {
        setSlots: (start: Date, end: Date) => void
        setOpen: (open: boolean) => void
    }
}>((set, get) => ({
    start: new Date(),
    end: new Date(),
    open: false,
    actions: {
        setSlots: (start, end) => set({start: start, end: end}),
        setOpen: (open) => set({open: open})
    },
}));