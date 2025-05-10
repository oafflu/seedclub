"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarDateRangePicker({
  className,
  value,
  onChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })
  const controlledDate = value !== undefined ? value : date
  const setControlledDate = onChange !== undefined ? onChange : setDate

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !controlledDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {controlledDate?.from ? (
              controlledDate.to ? (
                <>
                  {format(controlledDate.from, "LLL dd, y")} -{" "}
                  {format(controlledDate.to, "LLL dd, y")}
                </>
              ) : (
                format(controlledDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={controlledDate?.from}
            selected={controlledDate}
            onSelect={setControlledDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 