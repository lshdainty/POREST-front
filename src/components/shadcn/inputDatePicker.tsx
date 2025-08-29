"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import { Input } from "@/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"

interface InputDatePickerProps {
  value?: string; // Expects 'YYYY-MM-DD'
  onValueChange: (value: string | undefined) => void;
}

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

export function InputDatePicker({ value, onValueChange }: InputDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const date = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValidDate(d) ? d : undefined;
  }, [value]);

  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setMonth(date);
  }, [date]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value || ''}
          placeholder="YYYY-MM-DD"
          className="bg-background pr-10"
          onChange={(e) => {
            onValueChange(e.target.value || undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                onValueChange(formatDate(selectedDate));
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}